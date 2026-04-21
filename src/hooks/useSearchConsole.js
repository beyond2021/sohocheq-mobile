import { useState, useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import * as SecureStore from "expo-secure-store";
import { supabase } from "../lib/supabase";

WebBrowser.maybeCompleteAuthSession();

// const GSC_CLIENT_ID =
//   "731483197307-6tl574r5ck3f8e3sl187iebm36rm8t8n.apps.googleusercontent.com";

const GSC_CLIENT_ID =
  "289638667387-ivdh0543fh7sb33f6tqufui30qje4s7n.apps.googleusercontent.com";
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

const discovery = {
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenEndpoint: "https://oauth2.googleapis.com/token",
};

export function useSearchConsole(user, siteUrl) {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // const redirectUri = AuthSession.makeRedirectUri({
  //   useProxy: true,
  //   projectNameForProxy: "@beyond2021/sohocheq-mobile",

  // });

  const redirectUri = "https://auth.expo.io/@beyond2021/sohocheq-mobile";
  console.log("🔑 Redirect URI:", redirectUri);

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: GSC_CLIENT_ID,
      scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
      redirectUri,
      responseType: AuthSession.ResponseType.Code,
      extraParams: { access_type: "offline", prompt: "consent" },
    },
    discovery,
  );

  useEffect(() => {
    if (user) checkStoredToken();
  }, [user?.id]);

  useEffect(() => {
    if (response?.type === "success") exchangeCode(response.params.code);
    else if (response?.type === "error")
      setError("Google auth failed. Please try again.");
  }, [response]);

  useEffect(() => {
    if (connected && siteUrl) fetchData();
  }, [connected, siteUrl]);

  const checkStoredToken = async () => {
    try {
      const token = await SecureStore.getItemAsync(`gsc_token_${user.id}`);
      if (token) {
        setConnected(true);
        await fetchData(token);
      }
    } catch (e) {
      console.error("❌ GSC token check:", e);
    }
  };

  const exchangeCode = async (code) => {
    setLoading(true);
    try {
      const { data: tokenData, error: fnError } =
        await supabase.functions.invoke("gsc-auth", {
          body: { code, redirectUri },
        });
      if (fnError || !tokenData?.access_token)
        throw new Error("Token exchange failed");
      await SecureStore.setItemAsync(
        `gsc_token_${user.id}`,
        tokenData.access_token,
      );
      if (tokenData.refresh_token)
        await SecureStore.setItemAsync(
          `gsc_refresh_${user.id}`,
          tokenData.refresh_token,
        );
      setConnected(true);
      await fetchData(tokenData.access_token);
    } catch (e) {
      setError("Failed to connect. Please try again.");
      console.error("❌ GSC exchange:", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async (token) => {
    setLoading(true);
    setError(null);
    try {
      const { data: cached } = await supabase
        .from("social_data_cache")
        .select("social_data, cached_at")
        .eq("user_id", user.id)
        .eq("platform", "gsc")
        .single();

      if (cached) {
        const age = Date.now() - new Date(cached.cached_at).getTime();
        if (age < CACHE_TTL) {
          setData(cached.social_data);
          setLoading(false);
          return;
        }
      }

      const accessToken =
        token || (await SecureStore.getItemAsync(`gsc_token_${user.id}`));
      if (!accessToken) throw new Error("No access token");

      const { data: gscData, error: fnError } = await supabase.functions.invoke(
        "gsc-data",
        {
          body: { accessToken, siteUrl },
        },
      );

      if (fnError || !gscData) throw new Error("Failed to fetch data");

      await supabase.from("social_data_cache").upsert(
        {
          user_id: user.id,
          platform: "gsc",
          social_data: gscData,
          cached_at: new Date().toISOString(),
        },
        { onConflict: "user_id,platform" },
      );

      setData(gscData);
    } catch (e) {
      const refreshed = await tryRefresh();
      if (!refreshed) {
        setError("Session expired. Please reconnect.");
        setConnected(false);
        await SecureStore.deleteItemAsync(`gsc_token_${user.id}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const tryRefresh = async () => {
    try {
      const refresh = await SecureStore.getItemAsync(`gsc_refresh_${user.id}`);
      if (!refresh) return false;
      const { data: tokenData, error } = await supabase.functions.invoke(
        "gsc-auth",
        {
          body: { refreshToken: refresh },
        },
      );
      if (error || !tokenData?.access_token) return false;
      await SecureStore.setItemAsync(
        `gsc_token_${user.id}`,
        tokenData.access_token,
      );
      await fetchData(tokenData.access_token);
      return true;
    } catch {
      return false;
    }
  };

  const connect = async () => {
    setError(null);
    await promptAsync();
  };
  const disconnect = async () => {
    await SecureStore.deleteItemAsync(`gsc_token_${user.id}`);
    await SecureStore.deleteItemAsync(`gsc_refresh_${user.id}`);
    await supabase
      .from("social_data_cache")
      .delete()
      .eq("user_id", user.id)
      .eq("platform", "gsc");
    setConnected(false);
    setData(null);
  };

  return {
    connected,
    loading,
    data,
    error,
    connect,
    disconnect,
    refresh: fetchData,
  };
}

import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../constants';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: {
      getItem: async (key) => {
        try {
          const { default: SecureStore } = await import('expo-secure-store');
          return await SecureStore.getItemAsync(key);
        } catch {
          return null;
        }
      },
      setItem: async (key, value) => {
        try {
          const { default: SecureStore } = await import('expo-secure-store');
          await SecureStore.setItemAsync(key, value);
        } catch {}
      },
      removeItem: async (key) => {
        try {
          const { default: SecureStore } = await import('expo-secure-store');
          await SecureStore.deleteItemAsync(key);
        } catch {}
      },
    },
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

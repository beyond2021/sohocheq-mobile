import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Modal,
  Animated,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StyleSheet,
  PanResponder,
} from "react-native";
import { COLORS } from "../constants";

const { height: H } = Dimensions.get("window");

export default function BottomModal({
  visible,
  onClose,
  title,
  children,
  fullScreen,
}) {
  const translateY = useRef(new Animated.Value(H)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        damping: 20,
        mass: 0.8,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: H,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, { dy }) => dy > 10,
      onPanResponderMove: (_, { dy }) => {
        if (dy > 0) translateY.setValue(dy);
      },
      onPanResponderRelease: (_, { dy }) => {
        if (dy > 100) onClose();
        else
          Animated.spring(translateY, {
            toValue: 0,
            damping: 20,
            useNativeDriver: true,
          }).start();
      },
    }),
  ).current;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          onPress={onClose}
          activeOpacity={1}
        />
        <Animated.View
          style={[
            styles.sheet,
            fullScreen && { maxHeight: "95%" },
            { transform: [{ translateY }] },
          ]}
        >
          <View {...panResponder.panHandlers} style={styles.handleWrap}>
            <View style={styles.handle} />
          </View>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
            bounces={false}
          >
            {children}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "flex-end" },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  sheet: {
    backgroundColor: "#0d0d14",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: "90%",
    borderTopWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  handleWrap: { alignItems: "center", paddingTop: 12, paddingBottom: 4 },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#fff",
    fontFamily: "Syne_800ExtraBold",
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 14,
    fontWeight: "700",
  },
  content: { padding: 20, paddingBottom: 40 },
});

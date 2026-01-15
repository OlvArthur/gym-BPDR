import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const PRIMARY = "#3B57A2";

export default function ClassementPage() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/admin")} style={styles.headerLeft}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Classement</Text>

        {/* placeholder to keep title visually centered */}
        <View style={styles.headerRight} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push("/admin/ranking/month")}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryButtonText}>Par mois</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push("/admin/ranking/year")}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryButtonText}>Par année</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },

  // Header
  header: {
    backgroundColor: PRIMARY,
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  headerLeft: {
    position: "absolute",
    left: 16,
    top: 54 - 6, // visually align with header padding
  },
  headerRight: {
    position: "absolute",
    right: 16,
    top: 54 - 6,
    width: 28,
    height: 28,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },

  // Content
  content: {
    paddingHorizontal: 200,
    paddingTop: 52,
  },

  intro: {
    color: "#444",
    fontSize: 15,
    marginBottom: 18,
    textAlign: "left",
  },

  primaryButton: {
    backgroundColor: PRIMARY,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 16,

    // subtle shadow for iOS
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },

    // elevation for Android
    elevation: 3,
  },

  primaryButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
});

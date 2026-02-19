import { useNetworkStatus } from "@/hooks/useNetworkStatus"
import { Ionicons } from "@expo/vector-icons"
import React from "react"
import { Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native"

export default function OfflineBanner() {
  const { isConnected, ssid } = useNetworkStatus()

  if (isConnected) return null

  const openWifiSettings = () => {
    if (Platform.OS === "android") {
      Linking.sendIntent("android.settings.WIFI_SETTINGS")
      return
    } 
    
    Linking.openURL("App-Prefs:root=WIFI")
  }

  return (
    <View style={styles.container}>
      <Ionicons name="wifi-outline" size={20} color="#fff" />

      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={styles.title}>Hors ligne</Text>
        <Text style={styles.subtitle}>
          {ssid ? `Connecté à ${ssid} (sans internet)` : "Aucune connexion internet"}
        </Text>
      </View>

      <TouchableOpacity onPress={openWifiSettings}>
        <Text style={styles.button}>Connexion</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#D9534F",
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontWeight: "700",
  },
  subtitle: {
    color: "#fff",
    fontSize: 12,
  },
  button: {
    color: "#fff",
    fontWeight: "600",
  },
})

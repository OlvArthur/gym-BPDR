import { useNetworkStatus } from "@/hooks/useNetworkStatus"
import { Ionicons } from "@expo/vector-icons"
import React from "react"
import {
    Linking,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native"

export default function OfflineModal() {
  const { isConnected } = useNetworkStatus()

  if (isConnected) return null

  const openWifiSettings = () => {
    if (Platform.OS === "android") {
      Linking.sendIntent("android.settings.WIFI_SETTINGS")
      return
    } 

    Linking.openURL("App-Prefs:root=WIFI")
  }

  return (
    <Modal visible transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>

          <Ionicons name="wifi" size={40} color="#D9534F" />

          <Text style={styles.title}>Aucune connexion</Text>

          <Text style={styles.subtitle}>
            Connectez l'appareil à Internet pour continuer.
          </Text>

          <TouchableOpacity style={styles.button} onPress={openWifiSettings}>
            <Text style={styles.buttonText}>Ouvrir le Wi-Fi</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  )
}

const PRIMARY = "#3B57A2"

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
    textAlign: "center",
  },
  button: {
    marginTop: 20,
    backgroundColor: PRIMARY,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
})

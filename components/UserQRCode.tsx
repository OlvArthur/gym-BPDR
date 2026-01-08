import { Ionicons } from "@expo/vector-icons"
import React, { useRef } from "react"
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import QRCode from "react-native-qrcode-svg"

const PRIMARY = "#3B57A2"

interface User {
    id: string | undefined
    name: string
    role: string
}

export default function UserQRCode({ user, visible }: { user: User, visible: boolean }) {
  const qrRef = useRef<any>(null)

  const qrPayload = `${user.id} - ${user.name}`

  async function handleDownload() {
    try {
      qrRef.current?.toDataURL((base64: string) => {
      // Ensure proper Data URL
      const dataUrl = base64.startsWith("data:image")
        ? base64
        : `data:image/png;base64,${base64}`;

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `qr-${user.id}.png`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    })
    } catch (err) {
      console.error("QR Download Error:", err)
      Alert.alert("Erreur", "Impossible de générer ou télécharger le QR Code.")
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>QR Code</Text>

      {visible ? (
        <>
          <View style={styles.qrBox}>
            <QRCode
              value={qrPayload}
              size={180}
              backgroundColor="white"
              getRef={(ref) => (qrRef.current = ref)}
              />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleDownload}>
            <Ionicons name="download" size={22} color="#fff" />
            <Text style={styles.buttonText}>Télécharger PNG</Text>
          </TouchableOpacity> 
        </>
        ) : (
        <Text>Rentrez le nom et rôle et pressez le bouton pour générer le QR Code</Text>
        )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    paddingHorizontal: 22,
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
    color: PRIMARY,
    marginBottom: 14,
  },

  qrBox: {
    alignSelf: "center",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: PRIMARY,
  },

  button: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: PRIMARY,
    paddingVertical: 14,
    borderRadius: 8,
    gap: 10,
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
})


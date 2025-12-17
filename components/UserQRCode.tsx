import { Ionicons } from "@expo/vector-icons";
import { Directory, File } from "expo-file-system/next";
import * as Sharing from "expo-sharing";
import React, { useRef } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import QRCode from "react-native-qrcode-svg";

const PRIMARY = "#3B57A2";

interface User {
    id: string
    name: string
    role: string
}

// Source - https://stackoverflow.com/a
// Posted by tsu
// Retrieved 2025-12-09, License - CC BY-SA 4.0

type Base64<imageType extends string> = `data:image/${imageType};base64${string}`

export default function UserQRCode({ user, visible }: { user: User, visible: boolean }) {
  const qrRef = useRef<any>(null);

  const qrPayload = JSON.stringify({
    id: user.id,
    name: user.name,
    role: user.role,
  });

  async function handleDownload() {
    try {
      if (!qrRef.current) return;

      qrRef.current.toDataURL(async (base64: Base64<'png'>) => {

        // Choose a safe directory for your file
        const dir = (Directory as any).documentDirectory
        const fileUri = dir.uri + `qr-${user.id}.png`

        // Create a File object
        const file = new File(fileUri)

        // Write base64 PNG into the file
        file.write(base64, {
          encoding: "base64",
        });

        // Share or download
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri)
        } else {
          Alert.alert("QR Code généré", "Le partage n'est pas disponible.");
        }
      })
    } catch (err) {
      console.error("QR Download Error:", err)
      Alert.alert("Erreur", "Impossible de générer ou télécharger le QR Code.");
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
              color={PRIMARY}
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
        <Text>Rentrez le nom e rôle</Text>
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


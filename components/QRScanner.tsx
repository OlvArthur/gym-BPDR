import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function QRScanner({ onScan }: { onScan: (value: string) => void }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  if(!permission) return  <ActivityIndicator />

  if (!permission.granted) {
    return (
      <View>
        <Text>Permission requise</Text>
        <Text onPress={requestPermission}>Permettre l'accès à la caméra</Text>
      </View>
    )
  }

  return (
    <CameraView
      style={{ flex: 1 }}
      facing="front"
      onBarcodeScanned={({ data }) => {
          if (!scanned) {
            setScanned(true);
            onScan(data);
          }
        }
      }
      barcodeScannerSettings={{
        barcodeTypes: ["qr"],
      }}
    />
  );
}

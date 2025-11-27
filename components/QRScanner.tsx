import { CameraView, useCameraPermissions } from "expo-camera";
import { useEffect, useState } from "react";
import { Text } from "react-native";

export default function QRScanner({
  onScan,
}: {
  onScan: (value: string) => void;
}) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  if (!permission)  return <Text>Chargement des permissions...</Text>;

  if (!permission.granted) return <Text>Permission de caméra refusée.</Text>;

  return (
    <CameraView
      style={{ flex: 1 }}
      facing="front"
      onBarcodeScanned={
        scanned
          ? undefined
          : ({ data }) => {
              setScanned(true);
              onScan(data);
            }
      }
      barcodeScannerSettings={{
        barcodeTypes: ["qr"],
      }}
    />
  );
}

import { ActivityIndicator, Modal, StyleSheet, Text, View } from "react-native"

export type StatusModalProps = {
  visible: boolean
  message?: string
  loading?: boolean
}

export function StatusModal({
  visible,
  message,
  loading = false,
}: StatusModalProps) {
  if (!visible) return null

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {loading && <ActivityIndicator size="large" />}
          {message && <Text style={styles.message}>{message}</Text>}
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 12,
    minWidth: 220,
    alignItems: "center",
    gap: 12,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
  },
})

import React from "react"
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native"

interface ConfirmModalProps {
  visible: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  danger?: boolean // for delete actions
}

const PRIMARY = "#3B57A2"
const DANGER = "#C62828"

export default function ConfirmModal({
  visible,
  title,
  message,
  confirmText = "Confirmer",
  cancelText = "Annuler",
  onConfirm,
  onCancel,
  danger = false,
}: ConfirmModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* TITLE */}
          <Text style={styles.title}>{title}</Text>

          {/* MESSAGE */}
          <Text style={styles.message}>{message}</Text>

          {/* ACTIONS */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onCancel}
            >
              <Text style={styles.cancelText}>{cancelText}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.confirmButton,
                danger && styles.dangerButton,
              ]}
              onPress={onConfirm}
            >
              <Text
                style={[
                  styles.confirmText,
                  danger && styles.dangerText,
                ]}
              >
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111",
    marginBottom: 8,
  },

  message: {
    fontSize: 15,
    color: "#444",
    marginBottom: 20,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginRight: 10,
  },

  cancelText: {
    fontSize: 15,
    color: "#666",
  },

  confirmButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: PRIMARY,
  },

  confirmText: {
    fontSize: 15,
    color: "#fff",
    fontWeight: "600",
  },

  dangerButton: {
    backgroundColor: DANGER,
  },

  dangerText: {
    color: "#fff",
  },
})

import { setVisibilityAsync } from 'expo-navigation-bar';
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Button, Image, Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import QRScanner from "@/components/QRScanner";
import { StatusModal, StatusModalProps } from "@/components/SessionStatusModal";
import { handleUserSessionTrigger } from '@/firebase/sessionService';


export default function UserHome() {
  const now = new Date()
  const formattedDate = now.toLocaleDateString("fr-CA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
  const formattedTime = now.toLocaleTimeString("fr-CA", {
    hour: "2-digit",
    minute: "2-digit",
  })

  const router = useRouter()

  const [scannerVisible, setScannerVisible] = useState(false)
  const [status, setStatus] = useState<StatusModalProps>({ visible: false })

  const handleScanPress = () => {
    setScannerVisible(true)
  }

  useEffect(() => {
    if(Platform.OS === 'android') setVisibilityAsync('hidden')
  }, [])

  const handleScanResult = async (value: string) => {
    setScannerVisible(false)

    // value example: 122 - Jhon Doe
    try {
      setStatus({ visible: true, loading: true, message: "Traitement du code QR..." })
      const [userId, userName] = value.split(" - ")
      
      const resultMessage = await handleUserSessionTrigger(Number(userId))
      const userMessage = userName ? resultMessage + ", " + userName.split(" ")[0] : resultMessage

      setStatus({ visible: true, loading: false, message: userMessage })
    } 
    catch (error) {
      setStatus({ visible: true, loading: false, message: "Erreur lors du traitement du code QR. Veuillez réessayer." })
    }
    finally {
      setTimeout(() =>{
        setStatus({ visible: false })
      }, 4000)
    }
  }

  return (
    <View style={styles.container}>
      {/* Header Logo + Date */}
      <View style={styles.header}>
        <Image
          source={require("@/assets/logo.png")} // Replace with your logo
          resizeMode="contain"
          style={styles.logo}
        />

        <View style={styles.dateBlock}>
          <Text style={styles.dateText}>{formattedDate}</Text>
          <Text style={styles.dateText}>{formattedTime}</Text>
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>G.Y.M</Text>

      {/* Center Buttons */}
      <View style={styles.buttonArea}>
        <TouchableOpacity style={styles.bigButton} onPress={handleScanPress}>
          <Text style={styles.bigButtonText}>Scanner un code QR</Text>
        </TouchableOpacity>

        <TouchableOpacity 
            style={styles.smallButton}
            onPress={() => router.push("/user/ranking")}
        >
          <Text style={styles.smallButtonText}>Classement</Text>
        </TouchableOpacity>
      </View>

      {/* Footer with Version */}
      <Text style={styles.version}>Version: 28</Text>

      <Modal visible={scannerVisible} animationType="slide">
        <View style={{ flex: 1 }}>
          <Button title="Fermer" onPress={() => setScannerVisible(false)} />
          <QRScanner onScan={handleScanResult} />
        </View>
      </Modal>

      <StatusModal loading={status.loading} visible={status.visible} message={status.message} />
        
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    justifyContent: "space-between",
  },

  // --- HEADER ---
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 60,
  },

  logo: {
    width: 130,
    height: 70,
  },

  dateBlock: {
    alignItems: "flex-end",
  },

  dateText: {
    fontSize: 14,
    color: "#000",
  },

  // --- TITLE ---
  title: {
    fontSize: 34,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 30,
  },

  // --- BUTTONS ---
  buttonArea: {
    alignItems: "center",
    marginTop: 60,
  },

  bigButton: {
    width: 260,
    backgroundColor: "#3B57A2",
    paddingVertical: 18,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 50,
  },

  bigButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },

  smallButton: {
    width: 140,
    backgroundColor: "#3B57A2",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    alignSelf: "flex-end",
    marginRight: 20,
  },

  smallButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },

  // --- FOOTER ---
  version: {
    marginBottom: 20,
    color: "#444",
    fontSize: 13,
    textAlign: "left",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
})
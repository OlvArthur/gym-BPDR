import UserQRCode from "@/components/UserQRCode"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import React, { useEffect, useState } from "react"
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"

import { getNextIncrementId } from "@/firebase/hooks/getNextIncrementId"
import { createUser } from "@/firebase/userService"

export default function CreateUserScreen() {
  const router = useRouter()

  const [name, setName] = useState("")
  const [role, setRole] = useState("")
  const [nextIncrementId, setNextIncrementId] = useState<string>()
  const [qrCodeVisible, setQrCodeVisible] = useState(false)

  const getIdToCreate = async () => {
    const nextId = await getNextIncrementId("users")
    setNextIncrementId(String(nextId))
  }
  
  useEffect(() => {
    getIdToCreate()
  }, [])

  const handleSave = async () => {
    console.log("Saving:", { name, role })
    await createUser(name, role, Number(nextIncrementId))
    router.push("/admin/users")
  }

  const handleQrCodeGenerate = () => {
    if(!nextIncrementId || !name || !role) return
    setQrCodeVisible(true)
  }

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <Ionicons name="close" size={26} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Utilisateurs</Text>

        <TouchableOpacity onPress={handleSave} style={styles.iconButton}>
          <Ionicons name="checkmark" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* FORM */}
      <View style={styles.formContainer}>
        <Text style={styles.label}>Nom</Text>
        <TextInput
          value={name}
          onChangeText={(name) => {
            qrCodeVisible && setQrCodeVisible(false)
            setName(name)
          }}
          style={styles.input}
        />

        <Text style={styles.label}>Rôle</Text>
        <TextInput
          value={role}
          onChangeText={(role) => {
            qrCodeVisible && setQrCodeVisible(false)
            setRole(role)
          }}
          style={styles.input}
        />

        <TouchableOpacity style={styles.button} onPress={handleQrCodeGenerate}>
          <Ionicons name="download" size={22} color="#fff" />
          <Text style={styles.buttonText}>Gérer QRCode</Text>
        </TouchableOpacity>
      </View>


      <UserQRCode visible={qrCodeVisible} user={{name, id: nextIncrementId, role}} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  /* HEADER */
  header: {
    height: 60,
    backgroundColor: "#3F5EAB",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    justifyContent: "space-between",
  },

  iconButton: {
    padding: 6,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },

  /* FORM */
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 30,
  },

  label: {
    color: "#36418C",
    fontSize: 16,
    marginBottom: 6,
  },

  input: {
    height: 45,
    borderWidth: 1.5,
    borderColor: "#36418C",
    borderRadius: 4,
    paddingHorizontal: 10,
    marginBottom: 25,
    fontSize: 16,
    width: 500
  },

  button: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3B57A2",
    paddingVertical: 14,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 25,
    gap: 10,
    width: 500
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
})

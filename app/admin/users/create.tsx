import UserQRCode from "@/components/UserQRCode"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import React, { useEffect, useState } from "react"
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"

import { getNextIncrementId } from "@/firebase/hooks/getNextIncrementId"

export default function CreateUserScreen() {
  const router = useRouter()

  const [name, setName] = useState("")
  const [role, setRole] = useState("")
  const [nextIncrementId, setNextIncrementId] = useState<String>()

  const getIdToCreate = async () => {
    console.log("n chegou o id")
    const nextId = await getNextIncrementId("users")
    console.log("chegoub o id", nextId)
    setNextIncrementId(String(nextId))
  }
  
  useEffect(() => {
    getIdToCreate()
  }, [])

  const handleSave = () => {
    // You will add Firestore logic here
    console.log("Saving:", { name, role })
  }

  const qrCodeVisible = Boolean(name && role)

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
          onChangeText={setName}
          style={styles.input}
        />

        <Text style={styles.label}>Rôle</Text>
        <TextInput
          value={role}
          onChangeText={setRole}
          style={styles.input}
        />
      </View>


        <UserQRCode visible={qrCodeVisible} user={{name: 'jhon', id: '3', role: 'user'}} />
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
})

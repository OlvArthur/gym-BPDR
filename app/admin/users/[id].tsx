import { Ionicons } from "@expo/vector-icons"
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useLocalSearchParams, useRouter } from "expo-router"
import React, { useEffect, useState } from "react"
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"


import ConfirmModal from "@/components/ConfirmModal"
import { deleteUserById as deleteUser, getUserById, getUserSessions, UserSession as Session, User } from "@/firebase/userService"

const PRIMARY = "#3B57A2"

export default function UserDetailsPage() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()

  const [user, setUser] = useState<User | null>(null)
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)

  const loadData = async () => {
    setLoading(true)
    try {
      const userId = Number(id)
      const userData = await getUserById(userId)
      const sessionData = await getUserSessions(userId)
      setUser(userData)
      setSessions(sessionData)
    } catch (err) {
      console.error("Failed:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const renderSession = ({ item }: { item: Session }) => (
    <View style={styles.sessionCard}>
      <View style={styles.sessionColumn}>
        <Text style={styles.sessionLabel}>Arrivée:</Text>
        <Text style={styles.sessionValue}>{format(item.checkIn.toDate(), "d MMMM yyyy H:mm" , { locale: fr })}</Text>
      </View>

      <View style={styles.sessionColumn}>
        <Text style={styles.sessionLabel}>Départ:</Text>
        <Text style={styles.sessionValue}>{item.checkOut ? format(item.checkOut.toDate(), "d MMMM yyyy H:mm", { locale: fr } ) : "--"}</Text>
      </View>

      <View style={styles.sessionColumn}>
        <Text style={styles.sessionLabel}>Durée:</Text>
        <Text style={styles.sessionValueBold}>{item.duration}</Text>
      </View>

      <TouchableOpacity
        style={styles.arrowContainer}
        onPress={() => router.push(`/admin/sessions/${item.id}` as any)}
      >
        <Ionicons name="chevron-forward" size={28} color={PRIMARY} />
      </TouchableOpacity>
    </View>
  )

  return (
    <View style={styles.screen}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/admin/users")}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Utilisateurs</Text>

        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={() => setShowConfirmDelete(true)} style={styles.headerIconButton}>
            <Ionicons name="trash" size={23} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.headerIconButton}>
            <Ionicons name="pencil" size={23} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <Text style={styles.loading}>Chargement...</Text>
      ) : !user ? (
        <Text style={styles.loading}>Aucun utilisateur trouvé.</Text>
      ) : (
        <>
          {/* USER INFO */}
          <View style={styles.infoBlock}>
            <View style={{ flex: 1, flexDirection: "row", alignItems: "baseline" }}>
              <Text style={styles.infoLabel}>Identifiant utilisateur</Text>
              <View style={styles.userCircle}>
                <Text style={styles.userCircleText}>
                  i
                </Text>
              </View>
            </View>

            <View >
              <Text style={styles.idText}>{user.id}</Text>
            </View>

            <Text style={styles.nameText}>{user.name}</Text>
            <Text style={styles.roleText}>Rôle: {user.role}</Text>
          </View>

          {/* LIST TITLE */}
          <Text style={styles.sectionTitle}>Sessions</Text>

          {/* SESSION LIST */}
          <FlatList
            contentContainerStyle={styles.listContainer}
            data={sessions}
            keyExtractor={(s) => s.id}
            renderItem={renderSession}
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          />
        </>
      )}

      <ConfirmModal
        visible={showConfirmDelete}
        title="Supprimer l'utilisateur"
        message="Cette action est définitive. Voulez-vous continuer ?"
        confirmText="Supprimer"
        cancelText="Annuler"
        danger
        onCancel={() => setShowConfirmDelete(false)}
        onConfirm={async () => {
          setShowConfirmDelete(false)
          await deleteUser(Number(user!.id))
          router.push("/admin/users")
        }}
      />

    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f5f6f8",
  },

  /* HEADER */
  header: {
    backgroundColor: PRIMARY,
    paddingHorizontal: 16,
    paddingTop: 52,
    paddingBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    marginLeft: -24,
  },

  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
  },

  headerIconButton: {
    marginLeft: 12,
    padding: 6,
    borderRadius: 6,
  },

  loading: {
    padding: 16,
    fontSize: 16,
  },

  /* USER INFO BLOCK */
  infoBlock: {
    backgroundColor: "#fff",
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: PRIMARY,
  },

  infoLabel: {
    fontSize: 22,
    color: "#333",
    marginBottom: 10,
    fontWeight: "600",
  },

  userCircle: {
    borderWidth: 2,
    borderColor: PRIMARY,
    borderRadius: 60,
    paddingVertical: 2,
    paddingHorizontal: 10,
    alignSelf: "center",
    marginBottom: 18,
    marginLeft: 12,
  },

  userCircleText: {
    fontSize: 15,
    fontWeight: "700",
    color: PRIMARY,
  },

  idText: {
    fontSize: 30,
    color: "#555",
    marginBottom: 12,
  },

  nameText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#222",
    marginBottom: 6,
  },

  roleText: {
    fontSize: 16,
    color: "#444",
    fontWeight: "500",
  },

  sectionTitle: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
  },

  /* SESSION CARD */
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 50,
  },

  sessionCard: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: PRIMARY,
    paddingVertical: 14,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  sessionColumn: {
    flex: 1,
  },

  sessionLabel: {
    color: "#333",
    fontSize: 13,
    fontWeight: "600",
  },

  sessionValue: {
    fontSize: 13,
    color: "#444",
    marginBottom: 6,
  },

  sessionValueBold: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111",
  },

  arrowContainer: {
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});

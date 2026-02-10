import QRScanner from "@/components/QRScanner"
import { StatusModal, StatusModalProps } from "@/components/SessionStatusModal"
import { UserSession as Session, getUserById, getUserSessions } from '@/firebase/userService'
import { Ionicons } from '@expo/vector-icons'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useRouter } from "expo-router"
import React, { useState } from "react"
import { Button, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native"

const PRIMARY = "#3B57A2"

interface MonthlyStats {
  totalDuration: number
  sessionCount: number
  autoClosedCount: number
}

interface User {
  id: number
  name: string
}

export default function ActivityScreen() {
  const router = useRouter()
  
  const [sessions, setSessions] = useState<Session[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<StatusModalProps>({ visible: false })
  const [scannerVisible, setScannerVisible] = useState(false)
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats>({
    totalDuration: 0,
    sessionCount: 0,
    autoClosedCount: 0
  })


  const calculateMonthlyStats = (sessions: Session[]) => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    let autoClosedCount = 0
    let monthlySessionCount = 0
    
    const totalDuration = sessions.reduce((total, session) => {
      const checkInDate = session.checkIn.toDate()
      const isThisMonth = checkInDate.getMonth() === currentMonth && checkInDate.getFullYear() === currentYear

      if(!isThisMonth) return total

      monthlySessionCount++
      
      if(session.autoClosed) autoClosedCount++
      return total + (session?.duration || 0)
    }, 0)
    
    setMonthlyStats({
      totalDuration,
      sessionCount: monthlySessionCount,
      autoClosedCount,
    })
  }

  const findUserInfo = async (userId: number) => {
    try {
      setStatus({ visible: true, loading: true, message: "Traitement du code QR..." })
      const user = await getUserById(Number(userId))

      if(!user) {
        setStatus({ visible: true, loading: false, message: "Utilisateur non trouvé. Veuillez contacter l'administrateur." })
        return
      }

      setStatus({ visible: true, loading: false, message: `Utilisateur identifié avec succès.` })


      setUser({ id: Number(userId), name: user.name })
    } catch (error) {
      console.error("Error parsing QR code:", error)
    } finally {
      setTimeout(() =>{
        setStatus({ visible: false })
      }, 1000)
    }
  }

  const findUserSessionInfo = async (userId: number) => {
    try {
      setLoading(true)
      const sessionData = await getUserSessions(Number(userId))
      setSessions(sessionData)
      calculateMonthlyStats(sessionData)
    } catch (err) {
      console.error("Failed:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleScanResult = async (value: string) => {
    setScannerVisible(false)
    const [userId, _] = value.split(" - ")
    await findUserInfo(Number(userId))
    await findUserSessionInfo(Number(userId))
  }

  const renderItem = ({ item: session }: { item: Session }) => (
    <View style={styles.sessionCard}>
      <View style={styles.sessionColumn}>
        <Text style={styles.sessionLabel}>Arrivée:</Text>
        <Text style={styles.sessionValue}>{format(session.checkIn.toDate(), "d MMMM yyyy H:mm" , { locale: fr })}</Text>
      </View>

      <View style={styles.sessionColumn}>
        <Text style={styles.sessionLabel}>Départ:</Text>
        <Text style={styles.sessionValue}>{session.checkOut ? format(session.checkOut.toDate(), "d MMMM yyyy H:mm", { locale: fr } ) : "--"}</Text>
      </View>

      <View style={styles.sessionColumn}>
        <Text style={styles.sessionLabel}>Durée:</Text>
        <Text style={styles.sessionValueBold}>{session.duration}</Text>
      </View>
            
      <View style={styles.autoClosedContainer}>
        {session.autoClosed && (
          <Text style={styles.autoClosedText}>
          ⚠️ Clôturée automatiquement
          </Text>
        )}
      </View>
    </View>
  )


  return (
    <View style={styles.screen}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/user")}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <View  style={styles.headerTexts}>
          <Text style={styles.headerTitle}>Mon activité</Text>
          <Text style={styles.headerSubtitle}>{format(new Date(), "MMMM yyyy", { locale: fr })}</Text>
        </View>
      </View>

      {!user ? (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <TouchableOpacity style={styles.button} onPress={() => setScannerVisible(true)}>
            <Text style={styles.buttonText}>Veuillez Scanner votre QR code pour s'identifier</Text>
          </TouchableOpacity>
        </View>
        ) : loading ? (
          <Text style={styles.loading}>Chargement...</Text>
        ) : (
          <>
            <View style={styles.statsCard}>
              <Text style={styles.statsLabel}>Total ce mois-ci</Text>
              <Text style={styles.statsValue}>{Math.floor(monthlyStats.totalDuration / 60)} h {monthlyStats.totalDuration % 60} min</Text>
              <Text style={styles.statsMeta}>
              {monthlyStats.sessionCount} sessions • {monthlyStats.autoClosedCount} clôturées automatiquement
              </Text>

              <Text style={styles.nameText}>{user?.name}</Text>
            </View>

            <FlatList
              contentContainerStyle={styles.listContainer}
              data={sessions}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}            
              ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            />
          </>
        )
      }

      <Modal visible={scannerVisible} animationType="slide">
        <View style={{ flex: 1 }}>
          <Button title="Fermer" onPress={() => setScannerVisible(false)} />
          <QRScanner onScan={handleScanResult} />
        </View>
      </Modal>

      <StatusModal loading={status.loading} visible={status.visible} message={status.message} />
    </View>
  );
}


const styles = StyleSheet.create({
    screen: {
      flex: 1,
      padding: 5,
      paddingTop: 40,
      backgroundColor: "#F7F8FA",
    },

    header: {
      backgroundColor: PRIMARY,
      paddingHorizontal: 16,
      paddingTop: 52,
      paddingBottom: 24,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
      marginBottom: 15,
    },

    headerTexts: {
        flex: 1,
        alignItems: "center",
        marginLeft: -24,
    },

    headerTitle: {
      color: "#fff",
      fontSize: 20,
      fontWeight: "600",
    },
    
    headerSubtitle: {
      color: "#fff",
    },

    statsCard: {
      backgroundColor: "#fff",
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
    },

    statsLabel: {
      color: "#666",
      fontSize: 14,
    },

    statsValue: {
      fontSize: 28,
      fontWeight: "700",
      color: "#1B70D9",
      marginVertical: 4,
    },

    statsMeta: {
      fontSize: 13,
      color: "#888",
    },

    nameText: {
      fontSize: 20,
      fontWeight: "600",
      color: "#222",
      marginBottom: 6,
      marginTop: 12,
    },

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

    autoClosedContainer: {
        width: 100,
        marginLeft: -200,
    },

    autoClosedText: {
      fontSize: 12,
      color: "#999",
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

    loading: {
      textAlign: "center",
      marginTop: 20,
      fontSize: 16,
    },


})
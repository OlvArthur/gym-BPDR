import { Ionicons } from "@expo/vector-icons"
import * as Sentry from '@sentry/react-native'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useRouter } from "expo-router"
import React, { useEffect, useState } from "react"
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"

import { EnrichedSession, getSessionsByDate } from '@/firebase/sessionService'
import CalendarModal from "./CalendarModal"

const PRIMARY = "#3B57A2"

export default function AdminSessions() {
  const router = useRouter()

  const [showCalendar, setShowCalendar] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [search, setSearch] = useState("")
  const [sessions, setSessions] = useState<EnrichedSession[]>([])
  const [loading, setLoading] = useState<Boolean>(false)

  const filtered = sessions.filter((s) =>
    s.userName.toLowerCase().includes(search.toLowerCase())
  )

  const loadSessions = async () => {
    try {
      setLoading(true)
      const sessions = await getSessionsByDate(selectedDate)

      setSessions(sessions)
    } catch (err) {
      Sentry.captureException(err instanceof Error ? err : new Error("Unknown error fetching sessions"))
      setSessions([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSessions()
  }, [selectedDate])

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/admin")}>
          <Ionicons name="arrow-back" size={26} color="white" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Heures</Text>

        <View style={styles.headerIcons}>
          {/* REFRESH BUTTON */}
          <TouchableOpacity onPress={loadSessions} style={{ marginRight: 18 }}>
            <Ionicons name="refresh" size={26} color="white" />
          </TouchableOpacity>

          {/* ADD BUTTON */}
          <TouchableOpacity>
            <Ionicons name="add" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* SEARCH BAR */}
      <View style={styles.searchBar}>
        <Ionicons
          name="search"
          size={20}
          color="#777"
          style={{ marginHorizontal: 8 }}
        />
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Rechercher des éléments"
          placeholderTextColor="#999"
        />
      </View>

      {/* DATE SELECTOR */}
      <View style={styles.dateRow}>
        <TouchableOpacity style={styles.dateBox} onPress={() => setShowCalendar(true)}>
          <Text style={styles.dateText}>{format(selectedDate, "d MMMM yyyy", { locale: fr })}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.calendarBtn} onPress={() => setShowCalendar(true)}>
          <Ionicons name="calendar" color="white" size={20} />
        </TouchableOpacity>
      </View>

      {/* SESSIONS LIST */}
      <ScrollView style={styles.list}>
      {loading ? (
        <Text style={styles.loadingText}>Chargement...</Text>
      ) : !filtered.length ? (
          <Text style={styles.loadingText}>
            Aucun résultat.
          </Text>
      ) : filtered.map((session, idx) => (
          <View
            key={idx}
            style={styles.card}
          >
            <View>
              <Text style={styles.userName}>{session.userName}</Text>
              <Text style={styles.detail}>Arrivée : {format(session.checkIn.toDate(), "d MMMM yyyy H:mm" ,  { locale: fr })}</Text>
              <Text style={styles.detail}>Départ : {session.checkOut ? format(session.checkOut?.toDate(), "d MMMM yyyy H:mm",  { locale: fr }) : '--'}</Text>
              <Text style={styles.detail}>Minutes : {session.duration}</Text>
            </View>

            <TouchableOpacity
              onPress={() => router.push(`/admin/sessions/${session.id}` as any)}
              style={styles.arrowContainer}
            >
                <Ionicons name="chevron-forward" size={32} color={PRIMARY} />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* CALENDAR MODAL */}
      <CalendarModal
        visible={showCalendar}
        onClose={() => setShowCalendar(false)}
        onConfirm={(date) => setSelectedDate(date)}
        currentSelectedDate={selectedDate}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  // HEADER
  header: {
    backgroundColor: PRIMARY,
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
    marginLeft: -20, // optical centering
  },

  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },

  // SEARCH BAR
  searchBar: {
    marginTop: 15,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: "#bbb",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
  },

  searchInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 15,
  },

  // DATE ROW
  dateRow: {
    marginTop: 15,
    marginHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  dateBox: {
    flex: 1,
    borderColor: PRIMARY,
    borderWidth: 2,
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },

  dateText: {
    color: PRIMARY,
    fontSize: 16,
  },

  calendarBtn: {
    backgroundColor: PRIMARY,
    marginLeft: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },

  // LIST
  loadingText: {
    marginTop: 20,
    textAlign: "center",
    color: "#666"
  },

  list: {
    flex: 1,
    marginTop: 10,
    marginHorizontal: 20,
  },

  card: {
    borderBottomWidth: 1,
    borderBottomColor: PRIMARY,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  userName: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },

  detail: {
    fontSize: 14,
    color: "#444",
  },

  arrowContainer: {
    width: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const PRIMARY = "#3B57A2";

export default function AdminSessions() {
  const router = useRouter();

  const [selectedDate, setSelectedDate] = useState("2025-01-01");
  const [search, setSearch] = useState("");

  // MOCKED data — replace with Firestore later
  const sessions = [
    { id: "1", user: "John Doe", start: "07:32", end: "09:14", duration: "1h 42m" },
    { id: "2", user: "Mélissa Dupont", start: "10:18", end: "11:50", duration: "1h 32m" },
    { id: "3", user: "Manuel Villegas", start: "12:00", end: "14:12", duration: "2h 12m" },
  ];

  const filtered = sessions.filter((s) =>
    s.user.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="white" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Heures</Text>

        <View style={styles.headerIcons}>
          {/* REFRESH BUTTON */}
          <TouchableOpacity style={{ marginRight: 18 }}>
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
        <View style={styles.dateBox}>
          <Text style={styles.dateText}>{selectedDate}</Text>
        </View>

        <TouchableOpacity style={styles.calendarBtn}>
          <Ionicons name="calendar" color="white" size={20} />
        </TouchableOpacity>
      </View>

      {/* SESSIONS LIST */}
      <ScrollView style={styles.list}>
        {filtered.map((s) => (
          <View
            key={s.id}
            style={styles.card}
          >
            <View>
              <Text style={styles.userName}>{s.user}</Text>
              <Text style={styles.detail}>Arrivée : {s.start}</Text>
              <Text style={styles.detail}>Départ : {s.end}</Text>
              <Text style={styles.detail}>Minutes : {s.duration}</Text>
            </View>

            <TouchableOpacity
              onPress={() => router.push(`/admin/sessions/${s.id}` as any)}
              style={styles.arrowContainer}
            >
                <Ionicons name="chevron-forward" size={32} color={PRIMARY} />
            </TouchableOpacity>
          </View>
        ))}

        {filtered.length === 0 && (
          <Text style={{ marginTop: 20, textAlign: "center", color: "#666" }}>
            Aucun résultat.
          </Text>
        )}
      </ScrollView>
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

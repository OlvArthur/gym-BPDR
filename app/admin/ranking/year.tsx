import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import React, { useEffect, useState } from "react"
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"

import RankingDropdown from "@/components/RankingDropdown"
import { getYearlyRanking, RankingSession } from "@/firebase/rankingService"

const PRIMARY = "#3B57A2"

export default function ClassementYear() {
  const router = useRouter()

  const currentYear = new Date().getFullYear()

  const years = [2022, 2023, 2024, 2025, 2026, 2027]

  const [selectedYear, setSelectedYear] = useState<number>(currentYear)
  const [ranking, setRanking] = useState<RankingSession[]>([])
  const [loading, setLoading] = useState<Boolean>(false)

  const loadRanking = async () => {
    try {
      setLoading(true)
      const data = await getYearlyRanking(selectedYear)
      setRanking(data)
    } catch(err) {
      console.error("Failed to load yearly ranking:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRanking()
  }, [selectedYear])

  return (
    <View style={styles.screen}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerLeft}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Classement - Anné</Text>

        <View style={styles.headerRight} />
      </View>


        {/* Month / Year Row */}
      <View style={styles.filterRow}>
        <RankingDropdown
            selectedValue={selectedYear}
            onChange={setSelectedYear}
            items={years.map((year) => ({ value: year, label: year.toString() }))}
          />
      </View>
      

      {/* LIST */}
      <ScrollView style={styles.list}>
        {loading ? (
          <Text style={styles.loadingText}>Chargement...</Text>
        ) : !ranking.length ? ( 
            <Text style={styles.loadingText}>
              Aucun résultat.
            </Text>
        ) : ranking.map((item, idx) => (
          <View key={idx} style={styles.card}>
            <Text style={styles.user}>{item.userName}</Text>
            <Text style={styles.time}>{item.formattedDuration}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },

  /* HEADER */
  header: {
    backgroundColor: PRIMARY,
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  headerLeft: {
    position: "absolute",
    left: 16,
    top: 54 - 6,
  },

  headerRight: {
    position: "absolute",
    right: 16,
    top: 54 - 6,
    width: 28,
    height: 28,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },

  // Month / Year Filters
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
    marginTop: 25,
  },


  /* LIST */
  list: {
    marginTop: 20,
    marginHorizontal: 20,
  },

  loadingText: {
    marginTop: 20,
    textAlign: "center",
    color: "#666"
  },

  card: {
    paddingVertical: 14,
    borderBottomColor: PRIMARY,
    borderBottomWidth: 1,
  },

  user: {
    fontSize: 16,
    color: "#222",
    marginBottom: 3,
  },

  time: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
});

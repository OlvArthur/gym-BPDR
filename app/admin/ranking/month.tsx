import { Ionicons } from "@expo/vector-icons"
import * as Sentry from '@sentry/react-native'
import { useRouter } from "expo-router"
import React, { useEffect, useState } from "react"
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"

import RankingDropdown from "@/components/RankingDropdown"
import { getMonthlyRanking, RankingSession } from '@/firebase/rankingService'

const PRIMARY = "#3B57A2"

export default function ClassementMonth() {
  const router = useRouter()

  const currentMonth = new Date().getMonth() // 0-11
    const currentYear = new Date().getFullYear()
  
    const months = new Map<number, string>([
      [0, "Janvier"],
      [1, "Février"],
      [2, "Mars"],
      [3, "Avril"],
      [4, "Mai"],
      [5, "Juin"],
      [6, "Juillet"],
      [7, "Août"],
      [8, "Septembre"],
      [9, "Octobre"],
      [10, "Novembre"],
      [11, "Décembre"],
    ])
  
    const years = [2022, 2023, 2024, 2025, 2026, 2027]
  
    const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth)
    const [selectedYear, setSelectedYear] = useState<number>(currentYear)
    const [ranking, setRanking] = useState<RankingSession[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    const loadRanking = async () => {
      try {
        setLoading(true)
        const data = await getMonthlyRanking(selectedMonth, selectedYear)
        setRanking(data)
      } catch (err) {
        Sentry.captureException(err instanceof Error ? err : new Error("Unknown error loading ranking"))
        setRanking([])
      } finally {
        setLoading(false)
      }
    }

    useEffect(() => {
      loadRanking();
    }, [selectedMonth, selectedYear])


  return (
    <View style={styles.screen}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/admin/ranking")} style={styles.headerLeft}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Classement - Mois</Text>

        <View style={styles.headerRight} />
      </View>


        {/* Month / Year Row */}
      <View style={styles.filterRow}>
        <RankingDropdown
            selectedValue={selectedMonth}
            onChange={setSelectedMonth}
            items={Array.from(months.entries()).map(([value, label]) => ({ value, label }))}
          />

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
  )
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

  loadingText: {
    marginTop: 20,
    textAlign: "center",
    color: "#666"
  },


  /* LIST */
  list: {
    marginTop: 20,
    marginHorizontal: 20,
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
})

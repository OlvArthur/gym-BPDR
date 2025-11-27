import RankingDropdown from "@/components/RankingDropdown";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const PRIMARY = "#3B57A2";

export default function ClassementMonth() {
  const router = useRouter();

  const currentMonth = new Date().getMonth(); // 0-11
    const currentYear = new Date().getFullYear();
  
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
    ]);
  
    const years = [2022, 2023, 2024, 2025, 2026, 2027];
  
    const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);
    const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  // MOCK DATA
  const ranking = [
    { id: 1, user: "John Doe", time: "12h 14m" },
    { id: 2, user: "Mélissa Dupont", time: "10h 48m" },
    { id: 3, user: "Manuel Villegas", time: "9h 22m" },
  ];

  return (
    <View style={styles.screen}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerLeft}>
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
        {ranking.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.user}>{item.user}</Text>
            <Text style={styles.time}>{item.time}</Text>
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

import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { getMonthlyRanking } from "../../firebase/rankingService";

export default function UserRanking() {
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

  const years = [2023, 2024, 2025, 2026];

  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  const [ranking, setRanking] = useState<{ name: string; time: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRanking() {
      setLoading(true)

      try {
        const data = await getMonthlyRanking(selectedMonth, selectedYear)

        const formattedRanking = data.map((item) => ({
          name: item.userName,
          time: `${Math.floor(item.duration / 60)} heures ${item.duration % 60} minutes`,
        }))

        setRanking(formattedRanking)
      } catch (err) {
        console.error("Failed to load ranking:", err)
        setRanking([])
      } finally {
        setLoading(false);
      }
    }

    loadRanking();
  }, [selectedMonth, selectedYear]);

  return (
    <View style={styles.container}>
      {/* Top Row */}
      <View style={styles.topRow}>
        <View style={styles.backButton} onTouchEnd={() => router.back()}>
          <Text style={styles.backButtonText}>Retour</Text>
        </View>

        <View style={styles.pageTitleBox}>
          <Text style={styles.pageTitle}>Classement du mois</Text>
        </View>
      </View>

      {/* Month / Year Row */}
      <View style={styles.filterRow}>
        <View style={styles.dropdownWrapper}>
          {/* Picker for Month */}
          <Picker
            selectedValue={selectedMonth}
            onValueChange={(value: number) => setSelectedMonth(Number(value))}
            mode="dropdown"
            style={styles.picker}
          >
            {Array.from(months.entries()).map(([num, label]) => (
              <Picker.Item key={num} label={label} value={num} />
            ))}
          </Picker>
        </View>

        <View style={styles.dropdownWrapper}>
          {/* Picker for Year */}
          <Picker
            selectedValue={selectedYear}
            onValueChange={(value: number) => setSelectedYear(Number(value))}
            mode="dropdown"
            style={styles.picker}
          >
            {years.map((y) => (
              <Picker.Item key={y} label={String(y)} value={y} />
            ))}
          </Picker>
        </View>
      </View>

      {/* Ranking List */}
      <ScrollView style={styles.listContainer}>
        {loading ? (
          <Text>Chargement...</Text>
        ) : ranking.length === 0 ? (
          <Text>Aucun résultat pour ce mois.</Text>
        ) : (
          ranking.map((item, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
          ))
        )}
      </ScrollView>

      {/* Footer Version */}
      <Text style={styles.version}>Version: 28</Text>
    </View>
  );
}

const PRIMARY = "#3B57A2";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 50,
  },

  // Top Row
  topRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  backButton: {
    backgroundColor: PRIMARY,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },

  backButtonText: {
    color: "#fff",
    fontWeight: "600",
  },

  pageTitleBox: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: PRIMARY,
    borderRadius: 6,
  },

  pageTitle: {
    fontWeight: "600",
    color: PRIMARY,
  },

  // Month / Year Filters
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  dropdownWrapper: {
    width: "47%",
    borderWidth: 2,
    borderColor: PRIMARY,
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === "android" ? 0 : 10,
    borderRadius: 6,

    ...(Platform.OS === "web" && {
    outline: "none",
  })
  },

 picker: {
  ...(
    Platform.OS === "web"
      ? {
          borderWidth: 0,
          outline: "none",
          backgroundColor: "transparent",
        }
      : {}
  ),
  },

  dropdownText: {
    color: PRIMARY,
    fontSize: 15,
  },

  // Ranking List
  listContainer: {
    flex: 1,
    borderWidth: 2,
    borderColor: PRIMARY,
    borderRadius: 6,
    padding: 10,
  },

  card: {
    borderBottomWidth: 1,
    borderBottomColor: PRIMARY,
    paddingVertical: 12,
  },

  name: {
    fontWeight: "600",
    marginBottom: 3,
  },

  time: {
    fontSize: 14,
  },

  // Footer
  version: {
    fontSize: 12,
    color: "#444",
    marginTop: 10,
  },
});

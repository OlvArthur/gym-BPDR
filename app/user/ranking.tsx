import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
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

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  // Mocked ranking data for layout demo
  // const ranking = [
  //   { name: "Liberato Bonfim", time: "169 heures 17 minutes" },
  //   { name: "Manuel Villegas", time: "15 heures 53 minutes" },
  //   { name: "François Pichette", time: "0 heures 0 minutes" },
  // ];


  const [ranking, setRanking] = useState<{ name: string; time: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRanking() {
      setLoading(true);

      const data = await getMonthlyRanking(selectedMonth, selectedYear)

      const formattedRanking = data.map((item) => ({
        name: item.userName,
        time: `${Math.floor(item.duration / 60)} heures ${item.duration % 60} minutes`,
      }));
      
      setRanking(formattedRanking);
      setLoading(false);
    }

    loadRanking();
  }, [selectedMonth, selectedYear]);

  return (
    <View style={styles.container}>
      {/* Top Row */}
      <View style={styles.topRow}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Retour</Text>
        </TouchableOpacity>

        <View style={styles.pageTitleBox}>
          <Text style={styles.pageTitle}>Classement du mois</Text>
        </View>
      </View>

      {/* Month / Year Row */}
      <View style={styles.filterRow}>
        <TouchableOpacity style={styles.dropdown}>
          <Text style={styles.dropdownText}>{months.get(selectedMonth)}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.dropdown}>
          <Text style={styles.dropdownText}>{selectedYear}</Text>
        </TouchableOpacity>
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

  dropdown: {
    width: "47%",
    borderWidth: 2,
    borderColor: PRIMARY,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 6,
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

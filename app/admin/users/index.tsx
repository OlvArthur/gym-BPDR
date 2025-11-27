import { Ionicons } from "@expo/vector-icons"; // expo vector icons
import { router } from "expo-router";
import React, { useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

type User = { id: string; name: string; role: string };

export default function UsersPage({ navigation }: { navigation?: any }) {
  const [search, setSearch] = useState<string>("");

  const users: User[] = [
    { id: "91", name: "Arthur Oliveira", role: "admin" },
    { id: "40", name: "Jean Dupont", role: "user" },
    { id: "113", name: "Maria Santos", role: "user" },
  ];

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.id.includes(search)
  );

  const onPressUser = (item: User) => {
    if (navigation && navigation.navigate) {
      navigation.navigate("UserDetails", { id: item.id });
    } else {
      // If you use Expo Router, you can replace this with router.push(`/admin/user/${item.id}`)
      console.log("Open user", item.id);
    }
  };

  const renderItem = ({ item }: { item: User }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPressUser(item)}
      activeOpacity={0.7}
    >
      <View style={styles.cardText}>
        <Text style={styles.infoLabel}>
          <Text style={styles.infoLabelBold}>ID: </Text>
          <Text style={styles.infoText}>{item.id}</Text>
        </Text>

        <Text style={[styles.infoLabel, { marginTop: 6 }]}>
          <Text style={styles.infoLabelBold}>{item.name}</Text>
        </Text>

        <Text style={[styles.infoLabel, { marginTop: 6 }]}>
          <Text style={styles.infoLabelBold}>Rôle: </Text>
          <Text style={styles.infoText}>{item.role}</Text>
        </Text>
      </View>

      <View style={styles.arrowContainer}>
        <Ionicons name="chevron-forward" size={32} color="#3B57A2" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Utilisateurs</Text>

        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.iconButton} onPress={() => console.log("refresh")}>
            <Ionicons name="refresh" size={22} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={() => console.log("sort")}>
            <Ionicons name="swap-vertical" size={22} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={() => console.log("add")}>
            <Ionicons name="add" size={26} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchWrap}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#999" style={{ marginRight: 10 }} />
          <TextInput
            placeholder="Réchercher des éléments"
            placeholderTextColor="#999"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
            returnKeyType="search"
          />
        </View>
      </View>

      {/* List */}
      <FlatList
        contentContainerStyle={styles.listContainer}
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      />
    </View>
  );
}

const PRIMARY = "#3B57A2";

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f5f6f8",
  },

  // HEADER
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
    // optical centering
    marginLeft: -24,
  },

  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconButton: {
    marginLeft: 12,
    padding: 6,
    borderRadius: 6,
  },

  // SEARCH
  searchWrap: {
    paddingHorizontal: 16,
    marginTop: 14,
  },

  searchBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e6ea",
  },

  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#222",
  },

  // LIST / CARD
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },

  card: {
    borderBottomWidth: 1,
    borderBottomColor: PRIMARY,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
  },


  cardText: {
    flex: 1,
    paddingRight: 12,
  },

  infoLabel: {
    color: "#333",
    fontSize: 14,
  },

  infoLabelBold: {
    fontWeight: "700",
    fontSize: 14,
    color: "#111",
  },

  infoText: {
    fontWeight: "400",
    color: "#333",
  },

  arrowContainer: {
    width: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});

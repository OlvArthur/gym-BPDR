import { getUsers } from "@/firebase/userService"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import React, { useEffect, useState } from "react"
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native"

interface User { 
  id: string
  name: string
  role: string
} 

export default function UsersPage() {
  const router = useRouter()
  
  const [search, setSearch] = useState<string>("")
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [sortingOrder, setSortingOrder] = useState<boolean>(true)

  const fetchUsers = async () => {
    setLoading(true)
    try  {
      const data = await getUsers()
      setUsers(data.sort((a,b) => Number(a.id) - Number(b.id)))
    } catch (err) {
      console.error("Failed to fetch users:", err)
      setUsers([])
    } finally {
      setLoading(false)

    }
  }
  
  useEffect(() => {
    fetchUsers()
  }, [])
  


  let filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.id.includes(search)
  )


  const renderItem = ({ item }: { item: User }) => (
    <View
      style={styles.card}
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

      <TouchableOpacity
        style={styles.arrowContainer}
        onPress={() => router.push(`/admin/users/${item.id}` as any)}
      >
        <Ionicons name="chevron-forward" size={32} color="#3B57A2" />
      </TouchableOpacity>
    </View>
  )

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/admin')}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Utilisateurs</Text>

        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.iconButton} onPress={fetchUsers}>
            <Ionicons name="refresh" size={22} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={() => setSortingOrder(!sortingOrder)}>
            <Ionicons name="swap-vertical" size={22} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/admin/users/create')}>
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

      {loading ? (
        <Text style={styles.loadingText}>Chargement...</Text>
      ) : filtered.length === 0 ? (
        <Text style={styles.loadingText}>Aucun utilisateur trouvé.</Text>
      ) : (
      <FlatList
        contentContainerStyle={styles.listContainer}
        data={sortingOrder ? filtered : filtered.reverse() }
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        extraData={sortingOrder}
      />)}
    </View>
  )
}

const PRIMARY = "#3B57A2"

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
  loadingText: {
    marginTop: 20,
    textAlign: "center",
    color: "#666"
  },

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
})

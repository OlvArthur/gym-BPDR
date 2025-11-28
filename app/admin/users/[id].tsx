import { Ionicons } from "@expo/vector-icons";
import { format } from 'date-fns';
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";


import { getUserById, getUserSessions, UserSession as Session, User } from "@/firebase/userService";

const PRIMARY = "#3B57A2";

export default function UserDetailsPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const formatTimestamp = (timestamp: any) => new Intl.DateTimeFormat(
      'en-US', {day: '2-digit', month: 'short',  year: 'numeric', hour: '2-digit', minute: '2-digit'}
    )
    .format(timestamp)
    .toString()
    

  const [user, setUser] = useState<User | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const userData = await getUserById(id);
      const sessionData = await getUserSessions(id);
      setUser(userData);
      setSessions(sessionData);
    } catch (err) {
      console.error("Failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const renderSession = ({ item }: { item: Session }) => (
    <View style={styles.sessionCard}>
      <View style={styles.sessionColumn}>
        <Text style={styles.sessionLabel}>Arrivée:</Text>
        <Text style={styles.sessionValue}>{format(item.checkIn.toDate(), "d MMMM yyyy H:mm" )}</Text>
      </View>

      <View style={styles.sessionColumn}>
        <Text style={styles.sessionLabel}>Départ:</Text>
        <Text style={styles.sessionValue}>{item.checkOut ? format(item.checkOut.toDate(), "d MMMM yyyy H:mm" ) : "--"}</Text>
      </View>

      <View style={styles.sessionColumn}>
        <Text style={styles.sessionLabel}>Durée:</Text>
        <Text style={styles.sessionValueBold}>{item.duration}</Text>
      </View>

      <TouchableOpacity
        style={styles.arrowContainer}
        onPress={() => router.push(`/admin/sessions/${item.id}` as any)}
      >
        <Ionicons name="chevron-forward" size={28} color={PRIMARY} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.screen}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Utilisateurs</Text>

        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.headerIconButton}>
            <Ionicons name="trash" size={23} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.headerIconButton}>
            <Ionicons name="pencil" size={23} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <Text style={styles.loading}>Chargement...</Text>
      ) : !user ? (
        <Text style={styles.loading}>Aucun utilisateur trouvé.</Text>
      ) : (
        <>
          {/* USER INFO */}
          <View style={styles.infoBlock}>
            
            <Text style={styles.infoLabel}>Identifiant utilisateur</Text>

            <View style={styles.userCircle}>
              <Text style={styles.userCircleText}>{user.id}</Text>
            </View>

            <Text style={styles.nameText}>{user.name}</Text>
            <Text style={styles.roleText}>Rôle: {user.role}</Text>
          </View>

          {/* LIST TITLE */}
          <Text style={styles.sectionTitle}>Sessions</Text>

          {/* SESSION LIST */}
          <FlatList
            contentContainerStyle={styles.listContainer}
            data={sessions}
            keyExtractor={(s) => s.id}
            renderItem={renderSession}
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f5f6f8",
  },

  /* HEADER */
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
    marginLeft: -24,
  },

  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
  },

  headerIconButton: {
    marginLeft: 12,
    padding: 6,
    borderRadius: 6,
  },

  loading: {
    padding: 16,
    fontSize: 16,
  },

  /* USER INFO BLOCK */
  infoBlock: {
    backgroundColor: "#fff",
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: PRIMARY,
  },

  infoLabel: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
    fontWeight: "600",
  },

  userCircle: {
    borderWidth: 2,
    borderColor: PRIMARY,
    borderRadius: 60,
    paddingVertical: 14,
    paddingHorizontal: 22,
    alignSelf: "flex-start",
    marginBottom: 18,
  },

  userCircleText: {
    fontSize: 22,
    fontWeight: "700",
    color: PRIMARY,
  },

  nameText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#222",
    marginBottom: 6,
  },

  roleText: {
    fontSize: 16,
    color: "#444",
    fontWeight: "500",
  },

  sectionTitle: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
  },

  /* SESSION CARD */
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

  arrowContainer: {
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});

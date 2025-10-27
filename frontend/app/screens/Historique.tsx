import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import api from "../../services/api";
import { getOrCreateUserId } from "../../utils/user";

const { width } = Dimensions.get("window");

const Historique = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const navigation = useNavigation();

  // 🔹 Init userId
  useEffect(() => {
    const init = async () => {
      const id = await getOrCreateUserId();
      setUserId(id);
    };
    init();
  }, []);

  // 🔹 Fonction fetchHistory réutilisable
  const fetchHistory = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await api.get(`/chat/history/${userId}`);
      setHistory(res.data || []);
    } catch (err) {
      console.error("Erreur lors du chargement de l'historique :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [userId]);

  const deleteSession = async (session_id: string) => {
    Alert.alert(
      "Supprimer cette session",
      "Voulez-vous vraiment supprimer cette session ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/chat/history/session/${session_id}`);
              fetchHistory(); // 🔹 refresh après suppression
            } catch (err) {
              console.error(err);
            }
          },
        },
      ]
    );
  };

  if (loading)
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={{ marginTop: 10 }}>Chargement de l'historique...</Text>
      </View>
    );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }} contentContainerStyle={{ paddingBottom: 100 }}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Vos conversations précédentes</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={fetchHistory}>
          <Text style={styles.refreshButtonText}>⟳ Refresh</Text>
        </TouchableOpacity>
      </View>

      {history.length === 0 ? (
        <Text style={styles.emptyText}>Aucune conversation enregistrée pour le moment.</Text>
      ) : (
        history.map((item, index) => (
          <View key={index} style={styles.sessionContainer}>
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate("Chat", { session_id: item.session_id })}
            >
              <Text style={styles.cardTitle}>Session {index + 1}</Text>
              <Text style={styles.cardDate}>
                {item.last_date ? new Date(item.last_date).toLocaleString() : "Date inconnue"}
              </Text>
              <Text numberOfLines={1} style={styles.cardQuestion}>
                🗣️ {item.last_question || "Aucune question"}
              </Text>
              <Text numberOfLines={1} style={styles.cardAnswer}>
                🤖 {item.last_answer || "Pas encore de réponse"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteSession(item.session_id)}
            >
              <Text style={styles.deleteButtonText}>Supprimer</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  headerContainer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginHorizontal: 20 },
  title: { fontSize: 20, fontWeight: "700" },
  refreshButton: { backgroundColor: "#2E81A8", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  refreshButtonText: { color: "#fff", fontWeight: "700" },
  emptyText: { textAlign: "center", marginTop: 40, color: "#888", fontSize: 15 },
  loaderContainer: { flex: 1, alignItems: "center", justifyContent: "center", marginTop: 60 },
  sessionContainer: { marginBottom: 15 },
  card: { backgroundColor: "#F2F4F8", borderRadius: 12, marginHorizontal: 20, padding: 15 },
  cardTitle: { fontSize: 16, fontWeight: "700", marginBottom: 4 },
  cardDate: { fontSize: 12, color: "#888" },
  cardQuestion: { fontSize: 14, marginTop: 6, color: "#333" },
  cardAnswer: { fontSize: 14, color: "#2E81A8" },
  deleteButton: { marginHorizontal: 20, marginTop: 5, backgroundColor: "#FF5252", padding: 6, borderRadius: 6, alignItems: "center" },
  deleteButtonText: { color: "#fff", fontWeight: "700" },
});

export default Historique;

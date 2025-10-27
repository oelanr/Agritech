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
import { diseaseData } from "../data/diseaseSeverity";

const { width } = Dimensions.get("window");

const AppText = ({ style, children, weight = "400", ...props }) => {
  let fontFamily = "SpaceGrotesk_400Regular";
  if (weight === "500") fontFamily = "SpaceGrotesk_500Medium";
  if (weight === "700") fontFamily = "SpaceGrotesk_700Bold";
  return <Text style={[{ fontFamily }, style]} {...props}>{children}</Text>;
};

const Historique = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    const init = async () => {
      const id = await getOrCreateUserId();
      setUserId(id);
    };
    init();
  }, []);

  const fetchHistory = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await api.get(`/scan/history/${userId}`);
      const sorted = (res.data || []).sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      // 🔹 Appliquer le nom de maladie via prediction
      const historyWithDisease = sorted.map(item => {
        const diseaseName = item.disease_name || item.prediction;
        return { ...item, disease_name: diseaseName };
      });

      setHistory(historyWithDisease);
    } catch (err) {
      console.error("Erreur chargement historique :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchHistory();
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
              fetchHistory();
            } catch (err) {
              console.error(err);
            }
          },
        },
      ]
    );
  };

  if (loading) return (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="large" color="#000" />
      <Text style={{ marginTop: 10 }}>Chargement de l'historique...</Text>
    </View>
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }} contentContainerStyle={{ paddingBottom: 200 }}>
      <View style={styles.headerContainer}>
        <AppText style={styles.title} weight="700">Historique des sessions</AppText>
        <TouchableOpacity style={styles.refreshButton} onPress={fetchHistory}>
          <AppText style={styles.refreshButtonText} weight="700">↻ Rafraîchir</AppText>
        </TouchableOpacity>
      </View>

      {history.length === 0 ? (
        <AppText style={styles.emptyText}>Aucune session enregistrée pour le moment.</AppText>
      ) : (
        history.map((item, index) => {
          const disease = diseaseData[item.disease_name] || { name: item.disease_name || "Analyse", severity: "Moyenne" };
          const isHighRisk = disease.severity === "Élevée";

          return (
            <View key={index} style={styles.sessionContainer}>
              <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate("Chat", { session_id: item.id })}
              >
                <View style={styles.cardHeader}>
                  <AppText style={styles.cardTitle} weight="700">{disease.name}</AppText>
                  <View style={[styles.statusTag, { backgroundColor: isHighRisk ? '#CC402D33' : 'rgba(0,0,0,0.1)' }]}>
                    <AppText style={[styles.statusText, { color: isHighRisk ? "#CC402D" : "#000" }]} weight="700">
                      {disease.severity}
                    </AppText>
                  </View>
                </View>

                <AppText style={styles.cardDate}>
                  {item.created_at ? new Date(item.created_at).toLocaleString() : "Date inconnue"}
                </AppText>

              
                <TouchableOpacity style={styles.deleteButton} onPress={() => deleteSession(item.id)}>
                  <AppText style={styles.deleteButtonText} weight="700">Supprimer</AppText>
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
          );
        })
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  headerContainer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginHorizontal: 20, marginTop: 20, marginBottom: 15 },
  title: { fontSize: 20, color: "#111" },
  refreshButton: { backgroundColor: "#212121", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12 },
  refreshButtonText: { color: "#fff" },
  emptyText: { textAlign: "center", marginTop: 40, color: "#888", fontSize: 15 },
  loaderContainer: { flex: 1, alignItems: "center", justifyContent: "center", marginTop: 60 },
  sessionContainer: { marginBottom: 15 },
  card: { backgroundColor: "#F2F4F8", borderRadius: 15, marginHorizontal: 20, padding: 18, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 3 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardTitle: { fontSize: 16, color: "#111" },
  statusTag: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3, alignSelf: 'flex-start' },
  statusText: { fontSize: width * 0.035 },
  cardDate: { fontSize: 12, color: "#888", marginBottom: 6 },
  cardQuestion: { fontSize: 14, color: "#333", marginBottom: 4 },
  cardAnswer: { fontSize: 14, color: "#2E81A8", marginBottom: 8 },
  deleteButton: { backgroundColor: "#212121", padding: 8, borderRadius: 10, alignItems: "center", marginTop: 5 },
  deleteButtonText: { color: "#fff" },
});

export default Historique;

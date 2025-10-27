import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, ScrollView } from "react-native";
import CustomHero from "@/components/CustomHero";
import { useRouter } from "expo-router";
import api from "../../services/api";
import { getOrCreateUserId } from "../../utils/user";
import { useFonts, SpaceGrotesk_400Regular, SpaceGrotesk_500Medium, SpaceGrotesk_700Bold } from '@expo-google-fonts/space-grotesk';

const { width, height } = Dimensions.get("window");

const AppText = ({ style, children, weight = "400", ...props }) => {
  let fontFamily = "SpaceGrotesk_400Regular";
  if (weight === "500") fontFamily = "SpaceGrotesk_500Medium";
  if (weight === "700") fontFamily = "SpaceGrotesk_700Bold";
  return <Text style={[{ fontFamily }, style]} {...props}>{children}</Text>;
};

// ----------------- Cards dynamiques avec Refresh -----------------
const Cards = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const id = await getOrCreateUserId();
      setUserId(id);
    };
    init();
  }, []);

  const fetchHistory = async () => {
    if (!userId) return;
    try {
      const res = await api.get(`/chat/history/${userId}`);
      const sorted = (res.data || []).sort((a, b) => new Date(b.last_date).getTime() - new Date(a.last_date).getTime());
      setHistory(sorted.slice(0, 3)); // 🔹 les 3 dernières analyses
    } catch (err) {
      console.error("Erreur récupération historique :", err);
    }
  };

  useEffect(() => {
    if (userId) fetchHistory();
  }, [userId]);

  if (!history.length) {
    return <Text style={{ textAlign: "center", marginTop: 20, color: "#888" }}>Aucune analyse récente.</Text>;
  }

  return (
    <View>
      <TouchableOpacity style={styles.refreshButton} onPress={fetchHistory}>
        <AppText style={styles.refreshText} weight="500">↻ Rafraîchir</AppText>
      </TouchableOpacity>

      {history.map((item, index) => (
        <View key={index} style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.first}>
              <View style={styles.iconContainer}>
                <Image source={require('@/assets/images/droplet.png')} style={styles.cardIcon} />
              </View>
              <View>
                <AppText style={styles.cardTitle} weight="700">{item.disease_name || "Analyse"}</AppText>
                <AppText style={styles.cardType} weight="500">{item.type || "Type inconnu"}</AppText>
              </View>
            </View>
            <View style={[styles.statusTag, { backgroundColor: item.risk_level === "Élevée" ? '#CC402D33' : 'rgba(223,129,66,0.2)' }]}>
              <AppText style={[styles.statusText, { color: item.risk_level === "Élevée" ? "#CC402D" : "#DF8142" }]} weight="700">
                {item.risk_level || "Moyen"}
              </AppText>
            </View>
          </View>
          <AppText style={styles.cardDesc}>{item.description || "Pas de description disponible."}</AppText>
        </View>
      ))}
    </View>
  );
};

// ----------------- Page Home -----------------
const AnalyseButton = () => {
  const router = useRouter();
  return (
    <TouchableOpacity style={styles.mainButton} onPress={() => router.push('/screens/Analyse')}>
      <AppText style={styles.mainButtonText} weight="500">Consultez maintenant</AppText>
      <Image 
        source={require('@/assets/images/arrow.png')} 
        style={{ width: width * 0.08, height: width * 0.08, marginLeft: width * 0.015 }} 
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};

const Home = () => {
  const [fontsLoaded] = useFonts({
    'SpaceGrotesk-Regular': SpaceGrotesk_400Regular,
    'SpaceGrotesk-Bold': SpaceGrotesk_700Bold,
    'SpaceGrotesk-Medium' : SpaceGrotesk_500Medium
  });
  const router = useRouter();

  return (
    <View style={styles.container}>
      <CustomHero title='Préservez le riz, Protegez la vie' heroText='Appuyez sur le bouton pour démarrer l’analyse de vos cultures'/>
      <View style={styles.boxbutton}><AnalyseButton /></View>
      <TouchableOpacity onPress={() => router.push('/screens/Historique')}>
        <AppText style={styles.historyText}>Voir vos historique de diagnostics</AppText>
      </TouchableOpacity>

      <View style={styles.analysisHeader}>
        <AppText style={styles.sectionTitle} weight="700">Dernières analyses</AppText>
        <TouchableOpacity onPress={() => router.push('/screens/Historique')}>
          <AppText style={styles.viewAll} weight="700">Voir tous</AppText>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 200 }}>
        <Cards />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: "#FFFFFF", height: height, flexDirection: 'column', paddingHorizontal:5 },
  boxbutton: { flexDirection: 'row', alignItems: 'center', justifyContent:'center' },
  mainButton: { flexDirection: 'row', alignItems: 'center', justifyContent:'center', backgroundColor: '#212121', borderRadius: 30, paddingVertical: 6, marginHorizontal: 20, marginVertical: 15, width:"70%", shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 3, elevation: 7 },
  mainButtonText: { color: '#fff', fontSize: width * 0.04 },
  historyText: { fontSize:21,textDecorationLine:'underline',marginVertical:10,textAlign:'center'},
  analysisHeader: {flexDirection:'row',justifyContent:'space-between',marginHorizontal:20},
  sectionTitle: { fontSize: 20,fontFamily:'SpaceGrotesk-Bold'},
  viewAll: { fontSize: 20, fontFamily: 'SpaceGrotesk-Medium' },
  refreshButton: { alignSelf:'flex-end', marginRight: width*0.05, marginBottom: 5 },
  refreshText: { color:'#212121', fontSize:16 },
  card: { backgroundColor: '#F2F4F8', borderRadius: 15, marginHorizontal: width * 0.05, marginVertical: height * 0.01, padding: width * 0.04, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 },
  iconContainer: { backgroundColor: 'white', padding: width * 0.015, borderRadius: 6 },
  cardIcon: { width: width * 0.06, height: width * 0.06 },
  cardTitle: { fontSize: 18, color: '#111', fontFamily:'SpaceGrotesk-Bold' },
  cardType: { color: '#353535CC', marginBottom: 4 },
  statusTag: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3, alignSelf: 'flex-start' },
  statusText: { fontSize: width * 0.035,fontFamily:'SpaceGrotesk-Regular' },
  cardDesc: { color: '#353535CC', marginBottom: 8, fontFamily:'SpaceGrotesk-Regular'},
  first: { flexDirection: 'row', alignItems: 'center', gap: width * 0.02 },
});

export default Home;

import { View, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity, Text } from 'react-native';
import { useFonts, SpaceGrotesk_400Regular, SpaceGrotesk_500Medium, SpaceGrotesk_700Bold } from '@expo-google-fonts/space-grotesk';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');


const AppText = ({ style, children, weight = '400', ...props }) => {
  let fontFamily = 'SpaceGrotesk_400Regular';
  if (weight === '500') fontFamily = 'SpaceGrotesk_500Medium';
  if (weight === '700') fontFamily = 'SpaceGrotesk_700Bold';

  return <Text style={[{ fontFamily }, style]} {...props}>{children}</Text>;
};

export default function HomeScreen() {
  const [fontsLoaded] = useFonts({
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_700Bold,
  });

  const router = useRouter();
  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: height * 0.15 }}>

        {/* SECTION PRINCIPALE */}
        <View style={styles.mainSection}>
          <AppText style={styles.mainTitle} weight="700">
            Préserver le riz,{"\n"}protéger la vie
          </AppText>

          <View style={{ alignItems: 'center', marginVertical: height * 0.02 }}>
            <AppText style={styles.subtitleTop}>Appuyez sur le bouton pour démarrer l’analyse</AppText>
            <AppText style={styles.subtitleBottom}>de vos cultures</AppText>
          </View>

          <TouchableOpacity style={styles.mainButton}>
            <AppText style={styles.mainButtonText} weight="500">Consultez maintenant</AppText>
            <Image 
              source={require('../../../assets/images/arrow.png')} 
              style={{ width: width * 0.08, height: width * 0.08, marginLeft: width * 0.015 }} 
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/historique')}>
            <AppText style={styles.historyText}>Voir vos historique de diagnostics</AppText>
          </TouchableOpacity>

        </View>

        {/* SECTION ANALYSES */}
        <View style={styles.analysisHeader}>
          <AppText style={styles.sectionTitle} weight="700">Dernières analyses</AppText>
          <TouchableOpacity onPress={() => router.push('/historique')}>
            <AppText style={styles.viewAll} weight="700">Voir tous</AppText>
          </TouchableOpacity>
        </View>

        {/* CARTES */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.first}>
              <View style={styles.iconContainer}>
                <Image source={require('../../../assets/images/droplet.png')} style={styles.cardIcon} />
              </View>
              <View>
                <AppText style={styles.cardTitle} weight="700">Pyriculariose du riz</AppText>
                <AppText style={styles.cardType} weight="500">Fongique</AppText>
              </View>
            </View>
            <View style={[styles.statusTag, { backgroundColor: '#CC402D33' }]}>
              <AppText style={[styles.statusText, { color: '#CC402D' }]} weight="700">Élevée</AppText>
            </View>
          </View>

          <AppText style={styles.cardDesc}>
            Maladie fongique causée par Pyricularia oryzae affectant les feuilles et les épis.
          </AppText>

          <AppText style={styles.symptomTitle} weight="700">Symptômes principaux :</AppText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 5 }}>
            <View style={styles.symptomRow}>
              <View style={styles.symptomTag}><AppText style={styles.symptomText} weight="500">Tâches brunes</AppText></View>
              <View style={styles.symptomTag}><AppText style={styles.symptomText} weight="500">Flétrissement</AppText></View>
              <View style={styles.symptomTag}><AppText style={styles.symptomText} weight="500">Tâches foliaires</AppText></View>
            </View>
          </ScrollView>
        </View>

         {/* CARTES */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.first}>
              <View style={styles.iconContainer}>
                <Image source={require('../../../assets/images/fire.png')} style={styles.cardIcon} />
              </View>
              <View>
                <AppText style={styles.cardTitle} weight="700">Pyriculariose du riz</AppText>
                <AppText style={styles.cardType} weight="500">Fongique</AppText>
              </View>
            </View>
            <View style={[styles.statusTag, { backgroundColor: 'rgba(223, 129, 66, 0.2)' }]}>
              <AppText style={[styles.statusText, { color: '#DF8142' }]} weight="700">Moyen</AppText>
            </View>
          </View>

          <AppText style={styles.cardDesc}>
            Maladie fongique causée par Pyricularia oryzae affectant les feuilles et les épis.
          </AppText>

          <AppText style={styles.symptomTitle} weight="700">Symptômes principaux :</AppText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 5 }}>
            <View style={styles.symptomRow}>
              <View style={styles.symptomTag}><AppText style={styles.symptomText} weight="500">Tâches brunes</AppText></View>
              <View style={styles.symptomTag}><AppText style={styles.symptomText} weight="500">Flétrissement</AppText></View>
              <View style={styles.symptomTag}><AppText style={styles.symptomText} weight="500">Tâches foliaires</AppText></View>
            </View>
          </ScrollView>
        </View>
        
      </ScrollView>
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FBFBFB' },
  mainSection: {
    alignItems: 'center',
    paddingHorizontal: width * 0.06,
    marginTop: height * 0.03,
  },
  mainTitle: { fontSize: width * 0.075, color: '#111', textAlign: 'center', marginBottom: height * 0.02 },
  subtitleTop: { fontSize: width * 0.038,  textAlign: 'center' },
  subtitleBottom: { fontSize: width * 0.038, textAlign: 'center', marginTop: 2 },
  mainButton: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#212121',
    borderRadius: 30, paddingVertical: height * 0.012, paddingHorizontal: width * 0.05,
    shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 3, elevation: 3, marginBottom: height * 0.03,
  },
  mainButtonText: { color: '#fff', fontSize: width * 0.04 },
  historyText: { fontSize: width * 0.042, borderBottomWidth: 1, borderBottomColor: '#111', paddingBottom: 2, marginTop: 8 },
  analysisHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: width * 0.05, marginTop: height * 0.03, marginBottom: height * 0.02 },
  sectionTitle: { fontSize: width * 0.05 },
  viewAll: { fontSize: width * 0.045 },
  card: { backgroundColor: '#F2F4F8', borderRadius: 15, marginHorizontal: width * 0.05, marginVertical: height * 0.01, padding: width * 0.04, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 },
  iconContainer: { backgroundColor: 'white', padding: width * 0.015, borderRadius: 6 },
  cardIcon: { width: width * 0.06, height: width * 0.06 },
  cardTitle: { fontSize: width * 0.042, color: '#111', flex: 1 },
  cardType: { color: '#353535CC', marginBottom: 4 },
  statusTag: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3, alignSelf: 'flex-start' },
  statusText: { fontSize: width * 0.035 },
  cardDesc: { color: '#353535CC', marginBottom: 8 },
  symptomTitle: { color: '#222', fontSize: width * 0.04 },
  symptomRow: { flexDirection: 'row', gap: 6 },
  symptomTag: { backgroundColor: '#CEE2EC', borderRadius: 10, paddingVertical: 4, paddingHorizontal: 10 },
  symptomText: { color: '#2E81A8', fontSize: width * 0.03 },
  first: { flexDirection: 'row', alignItems: 'center', gap: width * 0.02 },
});

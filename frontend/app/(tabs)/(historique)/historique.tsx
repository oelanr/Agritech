import { View, StyleSheet, ScrollView, Dimensions, Image, Text } from 'react-native';
import { useFonts, SpaceGrotesk_400Regular, SpaceGrotesk_500Medium, SpaceGrotesk_700Bold } from '@expo-google-fonts/space-grotesk';

const { width, height } = Dimensions.get('window');


const AppText = ({ style, children, weight = '400', ...props }) => {
  let fontFamily = 'SpaceGrotesk_400Regular';
  if (weight === '500') fontFamily = 'SpaceGrotesk_500Medium';
  if (weight === '700') fontFamily = 'SpaceGrotesk_700Bold';
  return <Text style={[{ fontFamily }, style]} {...props}>{children}</Text>;
};

export default function HistoriqueScreen() {
  const [fontsLoaded] = useFonts({
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_700Bold,
  });

  if (!fontsLoaded) return null;

  const analyses = [
    {
      id: 1,
      title: 'Pyriculariose du riz',
      type: 'Fongique',
      status: 'Élevée',
      statusColor: '#CC402D',
      backgroundColor: '#CC402D33',
      description: 'Maladie fongique causée par Pyricularia oryzae affectant les feuilles et les épis.',
      symptoms: ['Tâches brunes', 'Flétrissement', 'Tâches foliaires'],
      traitement: 'Fongicides à base de tricyclazole, amélioration de la ventilation.',
      icon: require('../../../assets/images/droplet.png')
    },
    {
      id: 2,
      title: 'Feu bactérien du riz',
      type: 'Bactérienne',
      status: 'Moyen',
      statusColor: '#DF8142',
      backgroundColor: 'rgba(223, 129, 66, 0.2)',
      description: 'Maladie bactérienne affectant les feuilles et la croissance.',
      symptoms: ['Nécrose', 'Taches jaunes'],
      traitement: 'Traitement au cuivre, rotation des cultures et bon drainage.',
      icon: require('../../../assets/images/fire.png')
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator
        scrollIndicatorInsets={{ right: 0 }}
      >
        <AppText style={styles.mainTitle} weight="700">
          Visualisez vos {"\n"}différentes analyses
        </AppText>

        <View style={styles.textCenter}>
          <AppText style={styles.subtitleTop}>
            Consultez toutes vos analyses grâce à cet
          </AppText>
          <AppText style={styles.subtitleBottom}>
            historique à la fois simple et clair
          </AppText>
        </View>

        <AppText style={styles.nombre}>4 maladie(s) trouvée(s)</AppText>

        {analyses.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.first}>
                <View style={styles.iconContainer}>
                  <Image source={item.icon} style={styles.cardIcon} />
                </View>
                <View>
                  <AppText style={styles.cardTitle} weight="700">{item.title}</AppText>
                  <AppText style={styles.cardType} weight="500">{item.type}</AppText>
                </View>
              </View>
              <View style={[styles.statusTag, { backgroundColor: item.backgroundColor }]}>
                <AppText style={[styles.statusText, { color: item.statusColor }]} weight="700">{item.status}</AppText>
              </View>
            </View>

            <AppText style={styles.cardDesc}>{item.description}</AppText>

            <AppText style={styles.symptomTitle} weight="700">Symptômes principaux :</AppText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 5 }}>
              <View style={styles.symptomRow}>
                {item.symptoms.map((symptom, idx) => (
                  <View key={idx} style={styles.symptomTag}>
                    <AppText style={styles.symptomText} weight="500">{symptom}</AppText>
                  </View>
                ))}
              </View>
            </ScrollView>

            <View style={styles.separator} />

            <View style={styles.traitementContainer}>
              <AppText style={styles.traitementTitle} weight="700">Traitement :</AppText>
              <AppText style={styles.traitementText}>{item.traitement}</AppText>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FBFBFB',
  },
  scrollContent: {
    paddingHorizontal: width * 0.05,
    paddingBottom: height * 0.1,
  },
  mainTitle: { fontSize: width * 0.075, color: '#111', textAlign: 'center', marginBottom: height * 0.005, marginTop:18 },

  textCenter: { alignItems: 'center', marginVertical: height * 0.02 },
  subtitleTop: { fontSize: width * 0.038, textAlign: 'center' },
  subtitleBottom: { fontSize: width * 0.038, textAlign: 'center', marginTop: 2 },
  nombre: {  marginBottom: height * 0.02, fontSize: width * 0.04, color: '#3E3E3E', fontWeight: "bold" , marginTop:15},
  card: { 
    backgroundColor: '#F2F4F8', 
    borderRadius: 15, 
    marginBottom: height * 0.02, 
    padding: width * 0.04, 
    shadowColor: '#000', 
    shadowOpacity: 0.05, 
    shadowRadius: 3, 
    elevation: 2 
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 },
  first: { flexDirection: 'row', alignItems: 'center', gap: width * 0.02 },
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
  separator: { height: 1.2, backgroundColor: '#C9D1D9', marginVertical: height * 0.015, width: '100%', alignSelf: 'center' },
  traitementContainer: { marginTop: 4 },
  traitementTitle: { fontSize: width * 0.04, color: '#111' },
  traitementText: { color: '#01725E', fontSize: width * 0.035, marginTop: 2 },
});

import { StyleSheet, Text, View,Dimensions,ScrollView,Image } from 'react-native'
import React from 'react'
import { 
  useFonts, 
  SpaceGrotesk_400Regular, // Poids Regular
  SpaceGrotesk_500Medium,
  SpaceGrotesk_700Bold      // Poids Bold 
} from '@expo-google-fonts/space-grotesk';

import CustomHero from '@/components/CustomHero';

const AppText = ({ style, children, weight = '400', ...props }) => {
  let fontFamily = 'SpaceGrotesk_400Regular';
  if (weight === '500') fontFamily = 'SpaceGrotesk_500Medium';
  if (weight === '700') fontFamily = 'SpaceGrotesk_700Bold';

  return <Text style={[{ fontFamily }, style]} {...props}>{children}</Text>;
};

const Cards = () => {
  const [fontsLoaded] = useFonts({
    'SpaceGrotesk-Regular': SpaceGrotesk_400Regular,
    'SpaceGrotesk-Bold': SpaceGrotesk_700Bold,
    'SpaceGrotesk-Medium' : SpaceGrotesk_500Medium
  });

  return <>
    <ScrollView
      style={{ flex: 1, backgroundColor: "#FFFFFF" }}
      contentContainerStyle={{paddingTop:10,paddingBottom: 200 }} // espace bas
      showsVerticalScrollIndicator={false}
    >
      {/* CARTES */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.first}>
            <View style={styles.iconContainer}>
              <Image source={require('@/assets/images/droplet.png')} style={styles.cardIcon} />
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
              <Image source={require('@/assets/images/fire.png')} style={styles.cardIcon} />
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
  </>
}

const Historique = () => {
  return (
    <View style={styles.container}>
      <CustomHero title='Visualiser vos différentes analyses' heroText='Consultez toutes vos analyses grâce a cet historique à la fois simple et clair'/>
      <AppText style={styles.nbrmaladie}>
        4 maladie(s) trouvée(s)
      </AppText>
      <Cards />
    </View>
  )
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    height: height
  },
  nbrmaladie:{marginHorizontal:20,marginVertical:10,fontSize:20,fontFamily:'SpaceGrotesk-Medium'},
  card: { backgroundColor: '#F2F4F8', borderRadius: 15, marginHorizontal: width * 0.05, marginVertical: height * 0.01, padding: width * 0.04, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 },
  iconContainer: { backgroundColor: 'white', padding: width * 0.015, borderRadius: 6 },
  cardIcon: { width: width * 0.06, height: width * 0.06 },
  cardTitle: { fontSize: 18, color: '#111',fontFamily:'SpaceGrotesk-Bold' },
  cardType: { color: '#353535CC', marginBottom: 4 },
  statusTag: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3, alignSelf: 'flex-start' },
  statusText: { fontSize: width * 0.035,fontFamily:'SpaceGrotesk-Regular' },
  cardDesc: { color: '#353535CC', marginBottom: 8, fontFamily:'SpaceGrotesk-Regular'},
  symptomTitle: { color: '#222', fontSize: width * 0.04,fontFamily:'SpaceGrotesk-Medium' },
  symptomRow: { flexDirection: 'row', gap: 6 },
  symptomTag: { backgroundColor: '#CEE2EC', borderRadius: 10, paddingVertical: 4, paddingHorizontal: 10 },
  symptomText: { color: '#2E81A8', fontSize: width * 0.03 },
  first: { flexDirection: 'row', alignItems: 'center', gap: width * 0.02 },
})

export default Historique
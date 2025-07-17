import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import de AsyncStorage

const SymptomSelector = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const router = useRouter();

  // Mapping des noms d'affichage des symptômes aux clés attendues par le backend
  const symptomKeyMap: { [key: string]: string } = {
    'Taches': 'taches',
    'Feuilles brune': 'bord_feuille_brun',
    'Flétrissures': 'fletrissure',
    'Champignon': 'presence_champignons',
    'Feuilles jaune': 'feuille_jaune',
    'Tâches circulaire': 'taches_circulaires',
    'Pluie récente': 'pluie_recente',
    'Fértilisation récente': 'fertilisation_recente',
  };

  const symptoms = [
    { name: 'Taches', icon: require('../../../assets/images/tache.png') },
    { name: 'Feuilles brune', icon: require('../../../assets/images/feuillebr.png') },
    { name: 'Flétrissures', icon: require('../../../assets/images/fletrissure.png') },
    { name: 'Champignon', icon: require('../../../assets/images/champignon.png') },
    { name: 'Feuilles jaune', icon: require('../../../assets/images/jaune.png') },
    { name: 'Tâches circulaire', icon: require('../../../assets/images/tachecirculaire.png') },
    { name: 'Pluie récente', icon: require('../../../assets/images/pluie.png') },
    { name: 'Fértilisation récente', icon: require('../../../assets/images/fertilisation.png') },
  ];

  const toggleSymptom = (symptomName: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptomName) ? prev.filter(s => s !== symptomName) : [...prev, symptomName]
    );
  };

  // Fonction pour gérer le clic sur le bouton "Choisir"
  const handleChooseSymptoms = async () => {
    // Initialiser l'objet avec toutes les clés de symptômes à false
    // et les clés environnementales à null/valeur par défaut, car elles seront définies sur la page suivante.
    const inputData: { [key: string]: boolean | string | null } = {
      taches: false,
      feuille_jaune: false,
      taches_circulaires: false,
      bord_feuille_brun: false,
      fletrissure: false,
      presence_champignons: false,
      pluie_recente: false,
      fertilisation_recente: false,
      // Les champs suivants seront remplis sur la page suivante
      humidite: null,
      luminosite: null,
      vent: null,
      stade_croissance: null,
      type_sol: null,
      irrigation: null,
    };

    // Mettre à jour les valeurs booléennes pour les symptômes sélectionnés
    selectedSymptoms.forEach(symptomName => {
      const backendKey = symptomKeyMap[symptomName];
      if (backendKey) {
        inputData[backendKey] = true;
      }
    });

    try {
      // Sauvegarder les données dans AsyncStorage
      await AsyncStorage.setItem('currentAnalysisInput', JSON.stringify(inputData));
      Alert.alert('Succès', 'Symptômes sauvegardés. Veuillez compléter les informations environnementales.');
      
      // Naviguer vers la prochaine page
      router.push('/(tabs)/(scan)/analyse'); 
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des symptômes :", error);
      Alert.alert('Erreur', 'Impossible de sauvegarder les symptômes. Veuillez réessayer.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.titleAnal}>
        <Feather name="arrow-left" size={20} color="black" />
        <Text style={styles.title}>Nouvelle analyse</Text>
      </View>

      <View style={styles.descri}>
        <Text style={styles.subtitle2}>Choisissez les symptômes</Text>
        <Text style={styles.description}>
          Sélectionnez les symptômes et maladies pour l’analyse
        </Text>
      </View>

      <View style={styles.symptomsGrid}>
        {symptoms.map((symptom, index) => {
          const isSelected = selectedSymptoms.includes(symptom.name);
          return (
            <View key={index} style={styles.symptomContainer}>
              <TouchableOpacity
                style={[styles.symptomButton, isSelected && { borderColor: '#255C50', borderWidth: 2 }]}
                onPress={() => toggleSymptom(symptom.name)}
              >
                <Image source={symptom.icon} style={styles.icon} resizeMode="contain" />
              </TouchableOpacity>
              <Text style={[styles.symptomLabel, isSelected && styles.selectedLabel]}>
                {symptom.name}
              </Text>
            </View>
          );
        })}
      </View>

      <TouchableOpacity
        style={styles.chooseButton}
        onPress={handleChooseSymptoms} // Appelle la fonction de sauvegarde et de navigation
      >
        <Text style={styles.chooseButtonText}>Choisir</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    padding: 30,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  userCercle: {
    width: 60,
    height: 60,
    borderRadius: '50%',
    backgroundColor: '#E1E1E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  userInitial: {
    fontWeight: 'bold',
    color: '#000',
    fontSize:30,
  },
  userName: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  titleAnal: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 25,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000',
    marginLeft: 30,
  },
  descri: {
    marginBottom: 16,
  },
  subtitle2: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    color: 'gray',
  },
  symptomsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  symptomContainer: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 25,
  },
  symptomButton: {
    width: 70,
    height: 70,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor:'#CCE9DF',
  },
  icon: {
    width: 40,
    height: 50,
  },
  symptomLabel: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
  },
  selectedLabel: {
    color: '#000000',
    fontWeight: 'bold',
  },
  chooseButton: {
    backgroundColor: '#000000',
    padding: 15,
    borderRadius: '10%',
    alignItems: 'center',
    marginTop: 20,
  },
  chooseButtonText: {
    color: 'white',
    fontSize: 30,
  },
});

export default SymptomSelector;

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '@/services/api'; 
import { AuthErrorResponse } from '@/services/types';
import { AxiosError } from 'axios';

type DropdownKey =
  | 'humidite'
  | 'luminosite'
  | 'vent'
  | 'stadeCroissance'
  | 'typeSol'
  | 'irrigation';

const backendKeyMap: Record<DropdownKey, string> = {
  humidite: 'humidite',
  luminosite: 'luminosite',
  vent: 'vent',
  stadeCroissance: 'stade_croissance',
  typeSol: 'type_sol',
  irrigation: 'irrigation',
};

const data: Record<DropdownKey, string[]> = {
  humidite: ['élevée', 'moyenne', 'faible'],
  luminosite: ['élevée', 'moyenne', 'faible'],
  vent: ['fort', 'modéré', 'faible'],
  stadeCroissance: ['germination', 'croissance', 'floraison', 'maturation'],
  typeSol: ['sableux', 'argileux', 'limonneux', 'humifère'],
  irrigation: ['naturelle', 'artificielle', 'aucune'],
};

export default function AnalyseForm() {
  const [selections, setSelections] = useState<Record<DropdownKey, string>>({
    humidite: '',
    luminosite: '',
    vent: '',
    stadeCroissance: '',
    typeSol: '',
    irrigation: '',
  });
  const [openDropdown, setOpenDropdown] = useState<DropdownKey | null>(null);
  const [initialAnalysisInput, setInitialAnalysisInput] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('currentAnalysisInput');
        if (storedData !== null) {
          setInitialAnalysisInput(JSON.parse(storedData));
        } else {
          Alert.alert('Erreur', 'Aucune donnée de symptômes trouvée. Veuillez commencer une nouvelle analyse.');
          router.back();
        }
      } catch (error: any) {
        console.error("Erreur lors du chargement des données initiales :", error);
        Alert.alert('Erreur', 'Impossible de charger les données initiales.');
      }
    };
    loadInitialData();
  }, []);

  const toggleDropdown = (key: DropdownKey) => {
    setOpenDropdown(openDropdown === key ? null : key);
  };

  const selectOption = (key: DropdownKey, value: string) => {
    setSelections({ ...selections, [key]: value });
    setOpenDropdown(null);
  };

  const renderDropdown = (label: string, key: DropdownKey) => {
    const options = data[key];
    const selected = selections[key];
    const isOpen = openDropdown === key;

    return (
      <View key={key} style={styles.section}>
        <View style={styles.dropdownContainer}>
          {!isOpen && (
            <TouchableOpacity
              style={styles.dropdownHeader}
              onPress={() => toggleDropdown(key)}
            >
              <Text style={styles.dropdownText}>
                {selected || label}
              </Text>
              <Feather name="chevron-down" size={20} />
            </TouchableOpacity>
          )}

          {isOpen && (
            <View style={styles.dropdownInnerList}>
              {options.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.dropdownItem}
                  onPress={() => selectOption(key, option)}
                >
                  <Text>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>
    );
  };

  const handleAnalyze = async () => {
    const allEnvironmentalSelected = Object.values(selections).every(value => value !== '');

    if (!allEnvironmentalSelected) {
      Alert.alert('Champs manquants', 'Veuillez sélectionner une option pour chaque caractéristique environnementale.');
      return;
    }

    if (!initialAnalysisInput) {
      Alert.alert('Erreur', 'Les données de symptômes ne sont pas chargées. Veuillez réessayer.');
      return;
    }

    setIsLoading(true);

    try {
      const finalInput: { [key: string]: boolean | string } = { ...initialAnalysisInput };

      for (const key in selections) {
        if (Object.prototype.hasOwnProperty.call(selections, key)) {
          const backendKey = backendKeyMap[key as DropdownKey];
          if (backendKey) {
            finalInput[backendKey] = selections[key as DropdownKey];
          }
        }
      }

      console.log('Données envoyées au backend:', { input: finalInput });

      // Appel API
      const response = await api.post('http://127.0.0.1:8001/api/chat/chat-predict/', { input: finalInput });

      // --- DÉBUT DU NOUVEAU CODE D'AFFICHAGE PAR ALERTE ---
      Alert.alert(
        'Analyse terminée',
        `Votre analyse a été soumise avec succès !\n\nDonnées envoyées:\n${JSON.stringify(finalInput, null, 2)}`,
        [
          {
            text: 'OK',
            onPress: async () => {
              await AsyncStorage.removeItem('currentAnalysisInput');
              router.replace('/(tabs)/(home)');
            },
          },
        ],
        { cancelable: false }
      );
      // --- FIN DU NOUVEAU CODE D'AFFICHAGE PAR ALERTE ---

      console.log('Réponse du backend:', response.data);

    } catch (error) {
      const axiosError = error as AxiosError<AuthErrorResponse>;
      let errorMessage = 'Une erreur est survenue lors de l\'analyse.';
      
      if (axiosError.response) {
        errorMessage = axiosError.response.data?.error || 'Erreur du serveur inconnue.';
      } else if (axiosError.request) {
        errorMessage = 'Impossible de se connecter au serveur. Vérifiez votre connexion internet.';
      } else {
        errorMessage = axiosError.message || 'Une erreur inattendue est survenue.';
      }
      
      console.error("Erreur lors de l'envoi de l'analyse :", error);
      Alert.alert('Erreur d\'analyse', errorMessage);
    } finally {
      
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.titleRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Nouvelle analyse</Text>
      </View>

      <View style={styles.descri}>
        <Text style={styles.subtitle2}>Choisissez les caractéristiques</Text>
        <Text style={styles.description}>
          Cliquez sur chaque champ pour afficher les options disponibles
        </Text>
      </View>

      {renderDropdown('Humidité', 'humidite')}
      {renderDropdown('Luminosité', 'luminosite')}
      {renderDropdown('Vent', 'vent')}
      {renderDropdown('Stade de croissance', 'stadeCroissance')}
      {renderDropdown('Type de sol', 'typeSol')}
      {renderDropdown('Irrigation', 'irrigation')}

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleAnalyze}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Analyser</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 30,
    backgroundColor: '#F5F5F5',
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
    userCircle: {
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 30,
    color: '#000000',
  },
  descri: {
    marginBottom: 20,
  },
  subtitle2: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    color: 'gray',
  },
  section: {
    marginBottom: 10,
  },
  dropdownContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  dropdownHeader: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownInnerList: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  button: {
    backgroundColor: '#000000',
    padding: 15,
    borderRadius: '10%',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 30,
  },
  buttonText: {
    color: 'white',
    fontSize: 30,
    
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});

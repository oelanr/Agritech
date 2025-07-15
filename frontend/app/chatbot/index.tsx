import React, { useState } from 'react';
import { View, Text, Switch, ScrollView, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import CustomButton from '@/components/CustomButton';
import { Colors } from '@/constants/Colors';

// Définition des types pour les options du formulaire
type StringOption = "basse" | "moyenne" | "élevée" | "faible" | "modéré" | "fort" | "jeune" | "mature" | "floraison" | "argileux" | "sableux" | "limoneux" | "manuelle" | "automatique" | "aucune";

const CLASSIFICATION_API_URL = 'http://127.0.0.1:8001/predict';
const AGRICHAT_API_URL = 'http://127.0.0.1:8000/chat';

export default function ChatbotScreen() {
  // États pour chaque champ du formulaire
  const [symptomes, setSymptomes] = useState({
    taches: false,
    feuille_jaune: false,
    taches_circulaires: false,
    bord_feuille_brun: false,
    fletrissure: false,
    presence_champignons: false,
    pluie_recente: false,
    fertilisation_recente: false,
  });
  const [conditions, setConditions] = useState<{ [key: string]: StringOption }>({
    humidite: 'moyenne',
    luminosite: 'moyenne',
    vent: 'modéré',
    stade_croissance: 'mature',
    type_sol: 'limoneux',
    irrigation: 'manuelle',
  });

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [prediction, setPrediction] = useState('');

  const handleDiagnose = async () => {
    setLoading(true);
    setResponse('');
    setPrediction('');

    const sessionId = `session_${Math.random().toString(36).substring(7)}`;

    const requestBody = {
      ...symptomes,
      ...conditions,
      session_id: sessionId,
    };

    try {
      // Étape 1: Appel à l'API de classification
      const classificationRes = await fetch(CLASSIFICATION_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!classificationRes.ok) {
        throw new Error(`Erreur de classification: ${classificationRes.statusText}`);
      }

      const classificationData = await classificationRes.json();
      const diseasePrediction = classificationData.prediction;
      setPrediction(diseasePrediction);

      // Étape 2: Appel à l'API du chatbot avec le résultat de la classification
      const chatRes = await fetch(AGRICHAT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: `Quels sont les conseils pour une plante atteinte de : ${diseasePrediction}?`,
          session_id: sessionId,
        }),
      });

      if (!chatRes.ok) {
        throw new Error(`Erreur du chatbot: ${chatRes.statusText}`);
      }

      const chatData = await chatRes.json();
      setResponse(chatData.answer);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Une erreur inconnue est survenue.';
      Alert.alert('Erreur', `Impossible de contacter les services. Veuillez vérifier qu'ils sont bien démarrés. Détails: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const renderSwitch = (label: string, key: keyof typeof symptomes) => (
    <View style={styles.fieldContainer}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <Switch
        value={symptomes[key]}
        onValueChange={(value) => setSymptomes(prev => ({ ...prev, [key]: value }))}
        trackColor={{ false: '#767577', true: Colors.light.tint }}
        thumbColor={symptomes[key] ? Colors.dark.tint : '#f4f3f4'}
      />
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ThemedText type="title" style={styles.title}>Diagnostic de la Plante</ThemedText>
        <ThemedText style={styles.subtitle}>
          Remplissez ce formulaire pour obtenir un diagnostic et des conseils de notre assistant.
        </ThemedText>

        <View style={styles.section}>
          <ThemedText type="subtitle">Symptômes Visibles</ThemedText>
          {renderSwitch('Taches sur les feuilles', 'taches')}
          {renderSwitch('Feuilles jaunissantes', 'feuille_jaune')}
          {renderSwitch('Taches circulaires', 'taches_circulaires')}
          {renderSwitch('Bord des feuilles brun', 'bord_feuille_brun')}
          {renderSwitch('Flétrissure de la plante', 'fletrissure')}
          {renderSwitch('Présence de champignons', 'presence_champignons')}
          {renderSwitch('Pluie récente', 'pluie_recente')}
          {renderSwitch('Fertilisation récente', 'fertilisation_recente')}
        </View>

        {/* Note: For simplicity, categorical options are not implemented as pickers. */}
        {/* This can be enhanced with a custom component. */}
        <ThemedText style={styles.infoText}>
            Les options pour l'environnement (humidité, luminosité, etc.) sont fixées à des valeurs par défaut ("moyenne", "modéré", etc.).
        </ThemedText>

        <CustomButton title="Obtenir un diagnostic" onPress={handleDiagnose} disabled={loading} />

        {loading && <ActivityIndicator size="large" color={Colors.light.tint} style={styles.loader} />}

        {prediction && (
            <View style={styles.responseContainer}>
                <ThemedText type="subtitle">Diagnostic Initial :</ThemedText>
                <ThemedText style={styles.predictionText}>{prediction}</ThemedText>
            </View>
        )}
        
        {response && (
          <View style={styles.responseContainer}>
            <ThemedText type="subtitle">Conseils de l'Assistant :</ThemedText>
            <ThemedText style={styles.responseText}>{response}</ThemedText>
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
  },
  title: {
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: 20,
    textAlign: 'center',
    color: '#666',
  },
  section: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: Colors.light.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  fieldContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    fontSize: 16,
  },
  infoText: {
    textAlign: 'center',
    marginVertical: 15,
    color: '#888',
    fontStyle: 'italic',
  },
  loader: {
    marginTop: 20,
  },
  responseContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  predictionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.tint,
    textAlign: 'center',
    marginVertical: 5,
  },
  responseText: {
    fontSize: 16,
    lineHeight: 24,
  },
});

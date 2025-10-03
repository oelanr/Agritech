import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { CheckCircle, Circle, Search, ArrowRight } from 'lucide-react-native';

export default function DiagnosticScreen() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const router = useRouter();

  const symptomCategories = [
    {
      category: 'Feuilles',
      symptoms: [
        { id: 'taches_brunes', name: 'Taches brunes sur les feuilles', description: 'Petites taches circulaires brunes' },
        { id: 'jaunissement', name: 'Jaunissement des feuilles', description: 'Feuilles qui deviennent jaunes' },
        { id: 'fletrissement', name: 'Flétrissement', description: 'Feuilles qui se flétrissent et sèchent' },
        { id: 'rayures_blanches', name: 'Rayures blanches', description: 'Lignes blanches sur les feuilles' },
        { id: 'taches_oranges', name: 'Taches orange/rouille', description: 'Pustules orange sur les feuilles' },
      ]
    },
    {
      category: 'Tiges',
      symptoms: [
        { id: 'lesions_tiges', name: 'Lésions sur les tiges', description: 'Taches sombres sur la tige' },
        { id: 'pourriture_base', name: 'Pourriture à la base', description: 'Base de la tige qui pourrit' },
        { id: 'cassure_tiges', name: 'Cassure des tiges', description: 'Tiges qui se cassent facilement' },
      ]
    },
    {
      category: 'Épis/Grains',
      symptoms: [
        { id: 'grains_vides', name: 'Grains vides', description: 'Épis avec des grains non formés' },
        { id: 'taches_grains', name: 'Taches sur les grains', description: 'Grains tachetés ou décolorés' },
        { id: 'epis_courbes', name: 'Épis courbés', description: 'Épis qui se plient anormalement' },
      ]
    },
  ];

  const toggleSymptom = (symptomId: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptomId)
        ? prev.filter(id => id !== symptomId)
        : [...prev, symptomId]
    );
  };

  const handleDiagnose = () => {
    
    router.push('/(tabs)/(scan)/analyse');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Diagnostic des Maladies</Text>
        <Text style={styles.subtitle}>Sélectionnez les symptômes observés sur vos plants de riz</Text>
        <View style={styles.selectedCount}>
          <Text style={styles.selectedText}>{selectedSymptoms.length} symptôme(s) sélectionné(s)</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {symptomCategories.map((category, categoryIndex) => (
          <View key={categoryIndex} style={styles.categorySection}>
            <Text style={styles.categoryTitle}>{category.category}</Text>
            {category.symptoms.map((symptom) => (
              <TouchableOpacity
                key={symptom.id}
                style={[
                  styles.symptomCard,
                  selectedSymptoms.includes(symptom.id) && styles.selectedSymptomCard
                ]}
                onPress={() => toggleSymptom(symptom.id)}
              >
                <View style={styles.symptomContent}>
                  <View style={styles.symptomInfo}>
                    <Text style={[
                      styles.symptomName,
                      selectedSymptoms.includes(symptom.id) && styles.selectedSymptomText
                    ]}>
                      {symptom.name}
                    </Text>
                    <Text style={styles.symptomDescription}>{symptom.description}</Text>
                  </View>
                  <View style={styles.checkboxContainer}>
                    {selectedSymptoms.includes(symptom.id) ? (
                      <CheckCircle size={24} color="#22C55E" />
                    ) : (
                      <Circle size={24} color="#9ca3af" />
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>

      {selectedSymptoms.length > 0 && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.diagnoseButton} onPress={handleDiagnose}>
            <Search size={20} color="white" />
            <Text style={styles.diagnoseText}>Analyser les Symptômes</Text>
            <ArrowRight size={20} color="white" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: 'white',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 24,
    marginBottom: 16,
  },
  selectedCount: {
    backgroundColor: '#f0fdf4',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  selectedText: {
    fontSize: 14,
    color: '#22C55E',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  categorySection: {
    marginBottom: 30,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  symptomCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  selectedSymptomCard: {
    borderColor: '#22C55E',
    backgroundColor: '#f0fdf4',
  },
  symptomContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  symptomInfo: {
    flex: 1,
  },
  symptomName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  selectedSymptomText: {
    color: '#22C55E',
  },
  symptomDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  checkboxContainer: {
    marginLeft: 16,
  },
  footer: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  diagnoseButton: {
    backgroundColor: '#22C55E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  diagnoseText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});
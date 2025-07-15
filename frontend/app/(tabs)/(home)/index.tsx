import { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';

export default function HomeScreen() {
  const [selectedCard, setSelectedCard] = useState(null);

  const handleCardPress = (index) => {
    setSelectedCard(index === selectedCard ? null : index);
  };

  const cards = [
    {
      time: '1h',
      title: 'Rouille brune du blé',
      description: 'Présence de nombreuses tâches brun orangé sur les feuilles',
    },
    {
      time: '1j',
      title: 'Mildiou de la pomme de terre',
      description: 'Tâche sombre sur les feuilles de maïs et pourriture des tubercules',
    },
    {
      time: '5j',
      title: 'Rouille brune du blé',
      description: 'Présence de nombreuses tâches brun orangé sur les feuilles',
    },
    {
      time: '6j',
      title: 'Tache bactérienne de la tomate',
      description: 'Petites taches brunes entourées de jaune sur les feuilles',
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.text}>Dernière analyse</Text>

      <View style={styles.card}>
        <Text style={styles.title}>Infection par mildiou</Text>

        <View style={styles.infoRow}>
          <View style={styles.infoBlock}>
            <Text style={styles.label}>Sujet</Text>
            <Text style={styles.value}>Tomates</Text>
          </View>

          <View style={styles.infoBlock}>
            <Text style={styles.label}>Date d’analyse</Text>
            <Text style={styles.value}>18/07/25</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoBlock}>
            <Text style={styles.label}>ID</Text>
            <Text style={styles.value}>78456</Text>
          </View>

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Voir le traitement</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.text}>Liste de toutes les analyses</Text>

      {cards.map((item, index) => {
        const isSelected = selectedCard === index;
        return (
          <View style={styles.cardRow} key={index}>
            <Text style={styles.timestamp}>{item.time}</Text>
            <TouchableOpacity
              style={[styles.grayCard, isSelected && styles.grayCardSelected]}
              onPress={() => handleCardPress(index)}
              activeOpacity={0.8}
            >
              <Text style={[styles.cardTitle, isSelected && styles.whiteText]}>
                {item.title}
              </Text>
              <Text style={[styles.cardDescription, isSelected && styles.whiteText]}>
                {item.description}
              </Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  text: {
    marginHorizontal: 30,
    marginTop: 25,
    fontSize: 23,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#255C50',
    borderRadius: 30,
    paddingHorizontal:30,
    paddingVertical:20,
    margin: 30,
    marginBottom:5,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 25,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoBlock: {
    flex: 1,
  },
  label: {
    fontSize: 17,
    color: '#FFF',
    marginBottom: 4,
    fontWeight: 'bold'
  },
  value: {
    fontSize: 15,
    fontWeight: '600',
    color: '#D9D9D9',
  },
  button: {
    backgroundColor: '#261E1E',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    marginRight: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 16,
    marginHorizontal: 20,
  },
  timestamp: {
    fontSize: 15,
    color: 'black',
    width: 35,
    marginLeft: 10,
    marginRight: 5,
    marginTop: 40,
  },
  grayCard: {
    flex: 1,
    backgroundColor: '#EFEFEF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D3D3D3',
    padding: 16,
    marginRight: 10,
  },
  grayCardSelected: {
    backgroundColor: '#261E1E',
    borderColor: '#252625',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#222',
  },
  cardDescription: {
    fontSize: 14,
    color: 'black',
  },
  whiteText: {
    color: '#fff',
  },
});

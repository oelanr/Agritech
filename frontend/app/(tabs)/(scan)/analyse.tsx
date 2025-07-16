import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

type DropdownKey =
  | 'humidite'
  | 'luminosite'
  | 'vent'
  | 'stadeCroissance'
  | 'typeSol'
  | 'irrigation';

const data: Record<DropdownKey, string[]> = {
  humidite: ['Sec', 'Humide', 'Très humide'],
  luminosite: ['Faible', 'Moyenne', 'Élevée'],
  vent: ['Faible', 'Modéré', 'Fort'],
  stadeCroissance: ['Germination', 'Croissance', 'Floraison', 'Maturation'],
  typeSol: ['Sableux', 'Argileux', 'Limonneux', 'Humifère'],
  irrigation: ['Naturelle', 'Artificielle', 'Aucune'],
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
  const router = useRouter();

  const userName = "Salanitra, User";
  const userInitial = userName.charAt(0);

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

  return (
    <ScrollView contentContainerStyle={styles.container}>
     
     {/*<View style={styles.userHeader}>
        <View style={styles.userCircle}>
          <Text style={styles.userInitial}>{userInitial}</Text>
        </View>
        <Text style={styles.userName}>{userName}</Text>
      </View>*/}
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
        style={styles.button}
        onPress={() => {
          console.log('Sélections:', selections);
          setSelections({
            humidite: '',
            luminosite: '',
            vent: '',
            stadeCroissance: '',
            typeSol: '',
            irrigation: '',
          });
          setOpenDropdown(null);
        }}
      >
        <Text style={styles.buttonText}>Analyser</Text>
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
});

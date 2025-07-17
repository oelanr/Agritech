import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function EditProfileScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const handleSave = () => {
    if (!username || !fullname || !email || !passwordConfirm) {
      Alert.alert('Tous les champs sont obligatoires');
      return;
    }

    Alert.alert('Succès', 'Profil modifié avec succès');
    router.back();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 40 ,  marginTop:40,}}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginLeft: 40 ,}}>
          Modifier le profil
        </Text>
      </View>
      
      <View style={styles.field}>
        <Text style={styles.label}>Nom complet</Text>
        <TextInput
          value={fullname}
          onChangeText={setFullname}
          style={styles.input}
          placeholder="Entrez votre nom complet"
          placeholderTextColor="#666"
          
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Nom d'utilisateur</Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          placeholder="Entrez votre nom d'utilisateur"
          placeholderTextColor="#666"
        />
      </View>


      <View style={styles.field}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          placeholder="Entrez votre mail"
          placeholderTextColor="#666"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Mot de passe</Text>
        <TextInput
          value={passwordConfirm}
          onChangeText={setPasswordConfirm}
          secureTextEntry
          style={styles.input}
          placeholder="Entrez votre mot de passe"
          placeholderTextColor="#666"
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Enregistrer</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 40,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#261E1E',
  
    marginBottom: 34,
    textAlign: 'center',
  },
  field: {
    marginBottom: 20,
  
  },
  label: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
    marginBottom: 8,
    marginLeft:8,
    
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000',
    borderWidth: 1,
    borderColor: '#CCC',
  },
  button: {
    backgroundColor: '#153F35',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

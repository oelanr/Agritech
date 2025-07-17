import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ChangePasswordScreen() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  const handleChangePassword = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert('Erreur', 'Tous les champs sont requis.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
      return;
    }

    // Remplace ceci par ta logique de mise à jour réelle
    Alert.alert('Succès', 'Mot de passe mis à jour avec succès.');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 40 ,  marginTop:40,}}>
            <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginLeft: 20 ,}}>
                Changer le mot de passe
            </Text>
        </View>

      <Text style={styles.label}>Ancien mot de passe</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        placeholder="Entrez l'ancien mot de passe"
        value={oldPassword}
        onChangeText={setOldPassword}
      />

      <Text style={styles.label}>Nouveau mot de passe</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        placeholder="Entrez le nouveau mot de passe"
        value={newPassword}
        onChangeText={setNewPassword}
      />

      <Text style={styles.label}>Confirmer le mot de passe</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        placeholder="Confirmez le mot de passe"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>Mettre à jour</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#261E1E',
    marginBottom: 32,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    color: '#153F35',
    marginBottom: 6,
    marginTop: 16,
    marginLeft:8,
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 25,
    padding: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  button: {
    backgroundColor: '#255C50',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginTop: 30,  
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight:"bold",
  },
});

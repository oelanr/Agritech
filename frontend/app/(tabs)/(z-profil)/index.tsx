import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [userInitial, setUserInitial] = useState<string>('U');

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        if (storedUsername !== null) {
          setUsername(storedUsername);
          setUserInitial(storedUsername.charAt(0).toUpperCase());
        }
      } catch (error) {
        console.error("Erreur lors du chargement du nom d'utilisateur dans ProfileScreen :", error);
      }
    };
    loadUserData();
  }, []);

  const handleEditProfile = () => {
    router.push('/(tabs)/(z-profil)/edit-profil');
  };

  const handleChangePassword = () => {
    router.push('/(tabs)/(z-profil)/change-password');
  };

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Voulez-vous vraiment vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('authToken');
              await AsyncStorage.removeItem('username'); 
              
              console.log('Utilisateur déconnecté. Jetons supprimés.');
              
              router.replace('/auth');
            } catch (error) {
              console.error('Erreur lors de la déconnexion :', error);
              Alert.alert('Erreur', 'Impossible de se déconnecter. Veuillez réessayer.');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.initialText}>{userInitial}</Text>
        </View>
        <Text style={styles.username}>{username || 'Utilisateur'}</Text>
      </View>

      <View style={styles.card}>
        <TouchableOpacity style={styles.option} onPress={handleEditProfile}>
          <View style={styles.row}>
            <View style={styles.leftRow}>
              <Ionicons name="create-outline" size={20} color="#153F35" style={styles.iconLeft} />
              <Text style={styles.optionText}>Modifier le profil</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={20} color="#153F35" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={handleChangePassword}>
          <View style={styles.row}>
            <View style={styles.leftRow}>
              <Ionicons name="lock-closed-outline" size={20} color="#153F35" style={styles.iconLeft} />
              <Text style={styles.optionText}>Changer le mot de passe</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={20} color="#153F35" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.option, styles.logout]} onPress={handleLogout}>
          <View style={styles.row}>
            <Ionicons name="log-out-outline" size={20} color="#fff" style={styles.iconLeft} />
            <Text style={[styles.optionText, styles.logoutText]}>Se déconnecter</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 100,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#D9D9D9',
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#261E1E',
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#261E1E',
  },
  card: {
    width: '100%',
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  option: {
    paddingVertical: 14,
    paddingHorizontal: 0,
    borderBottomWidth: 3,
    borderColor: "#A2C8AC",
    backgroundColor: 'transparent',
    marginBottom: 16,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#153F35',
  },
  logout: {
    alignSelf: 'center',
    justifyContent:'center',
    alignItems: 'center',
    marginTop:20,
    borderRadius:30,
    width:300,
    backgroundColor: '#255C50',
    borderBottomWidth: 0,
  },
  logoutText: {
    color: '#fff',
    fontWeight:"bold"
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconLeft: {
    marginRight: 10,
  },
});

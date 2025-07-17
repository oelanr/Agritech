import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CustomHeader() {
  const [username, setUsername] = useState<string | null>(null);
  const [initial, setInitial] = useState<string>('U');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        if (storedUsername !== null) {
          setUsername(storedUsername);
          setInitial(storedUsername.charAt(0).toUpperCase());
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du nom d'utilisateur dans CustomHeader :", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <Text style={styles.initial}>{initial}</Text>
      </View>
      <Text style={styles.text}>Salanitra, {username || 'Utilisateur'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingTop:18,
    paddingBottom:10,
  },
  iconWrapper: {
    width: 45,
    height: 45,
    backgroundColor: '#E0E0E0',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: {
    fontSize: 24,
    textAlign: 'center',
    resizeMode: 'contain',
    color: 'black',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    paddingLeft: 20,
  },
});

import { View, Text, StyleSheet } from 'react-native';
import { 
  useFonts, 
  SpaceGrotesk_400Regular,
  SpaceGrotesk_700Bold
} from '@expo-google-fonts/space-grotesk';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';

export default function CustomHeader() {

  const [fontsLoaded] = useFonts({
    'SpaceGrotesk-Regular': SpaceGrotesk_400Regular,
    'SpaceGrotesk-Bold': SpaceGrotesk_700Bold,
  });

  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const loadEmail = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem('email');
        if (storedEmail) setEmail(storedEmail);
      } catch (error) {
        console.error('Erreur lors du chargement de l’email', error);
      }
    };
    loadEmail();
  }, []);

  // Tronquer l'email pour afficher seulement les 2 premières lettres
  const circleInitials = email ? email.substring(0,2).toUpperCase() : "US";

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
          <Text style={styles.title}>Agritech</Text>
          <View style={styles.profile}>
              <Text style={styles.nickname}>{circleInitials}</Text>
          </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    backgroundColor: '#FFFFFF',
  },
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 32,
    color: "#212121",
    fontFamily: "SpaceGrotesk-Bold"
  },
  profile: {
    height: 50,
    width: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#212121",
    borderRadius: 50,
  },
  nickname: {
    fontSize: 20, 
    color: "#FFFFFF",
    fontFamily: "SpaceGrotesk-Bold"
  }
});

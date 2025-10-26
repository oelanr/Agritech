// components/UserEmail.tsx
import React, { useEffect, useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserEmail: React.FC<{ style?: object }> = ({ style }) => {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const loadEmail = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem('email');
        if (storedEmail) setEmail(storedEmail);
      } catch (error) {
        console.error('Erreur lors du chargement de l’email :', error);
      }
    };
    loadEmail();
  }, []);

  return (
    <Text style={[styles.emailText, style]}>
      {email ?? 'Chargement...'}
    </Text>
  );
};

const styles = StyleSheet.create({
  emailText: {
    fontFamily: 'SpaceGrotesk-Regular',
    color: '#d1d1d1ff',
    fontSize: 20,
    marginRight: 10,
  },
});

export default UserEmail;

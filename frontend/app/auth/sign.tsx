
import React,{useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from "expo-router";

import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';
import { AuthResponse, AuthErrorResponse } from '../../services/types';
import { AxiosResponse, AxiosError } from 'axios';

const googleLogo = { uri: 'https://cdn-icons-png.flaticon.com/512/281/281764.png' };
const facebookLogo = { uri: 'https://cdn-icons-png.flaticon.com/512/5968/5968764.png' };
const arrowIcon = { uri: 'https://cdn-icons-png.flaticon.com/512/271/271228.png' };

const SignUpScreen: React.FC = () => {
  const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSignUp = async () => {
        // Validation des données côté client
        if (!username || !password || !confirmPassword) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
            return;
        }

        setIsLoading(true); // Activez l'indicateur de chargement

        try {
            // Appel de l'API d'inscription
            const response: AxiosResponse<AuthResponse> = await api.post<AuthResponse>('/register/', { username, password });
            
            const { token } = response.data;
            
            // Le token est renvoyé par le backend, il peut être stocké
            await AsyncStorage.setItem('authToken', token);

            Alert.alert('Succès', 'Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
            
            // Redirection vers la page de connexion après l'inscription réussie
            router.push("/auth/login"); // Assurez-vous que la route '/login' est correcte

        } catch (error) {
            const axiosError = error as AxiosError<AuthErrorResponse>;
            if (axiosError.response) {
                const errorMessage = axiosError.response.data.error || 'Erreur d\'inscription inconnue.';
                Alert.alert('Erreur d\'inscription', errorMessage);
            } else {
                Alert.alert('Erreur réseau', 'Impossible de se connecter au serveur. Vérifiez votre connexion.');
            }
        } finally {
            setIsLoading(false); // Désactivez l'indicateur de chargement
        }
    };

    return (
        <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => { router.push("/auth") }}>
          <Image source={arrowIcon} style={[styles.arrowIcon, { tintColor: 'white', transform: [{ rotate: '180deg' }] }]} />
        </TouchableOpacity>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Sign up</Text>
        <Text style={styles.subtitle}>Créez votre compte</Text>
      </View>
      
      <View style={styles.body}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#999"
            onChangeText={setUsername}
            value={username}
            />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            secureTextEntry={true}
            onChangeText={setPassword}
            value={password}
            />
          <TextInput
            style={styles.input}
            placeholder="Confirm password"
            placeholderTextColor="#999"
            secureTextEntry={true}
            onChangeText={setConfirmPassword}
            value={confirmPassword}
            />

          <TouchableOpacity 
                        style={[styles.signInButton, isLoading && styles.signInButtonDisabled]}
                        onPress={handleSignUp}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.signInButtonText}>Sign up</Text>
                        )}
                    </TouchableOpacity>
          
          <Text style={styles.alreadyAccountText} onPress={() => router.push("/auth/login")}>Already account ?</Text>

          <TouchableOpacity style={styles.socialButton}>
            <Image source={googleLogo} style={styles.socialIcon} />
            <Text style={styles.socialButtonText}>Continuer avec google</Text>
            <Image source={arrowIcon} style={styles.arrowIcon} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton}>
            <Image source={facebookLogo} style={styles.socialIcon} />
            <Text style={styles.socialButtonText}>Continuer avec facebook</Text>
            <Image source={arrowIcon} style={styles.arrowIcon} />
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default SignUpScreen;

const colors = {
  primaryGreen: '#255C50',
  lightGray: '#F0F0F0',
  darkGrayText: '#757575',
  white: '#FFFFFF',
  black: '#000000',
  borderColor: '#E0E0E0',
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primaryGreen,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 20,
        backgroundColor: colors.primaryGreen,
    },
    backButton: {
        padding: 10,
    },
    titleContainer: {
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.white,
    },
    subtitle: {
        fontSize: 20,
        color: 'rgba(255, 255, 255, 0.7)',
        marginTop: 8,
    },
    body: {
        flex: 1,
        backgroundColor: colors.white,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        paddingHorizontal: 24,
        paddingTop: 32,
    },
    input: {
        backgroundColor: colors.lightGray,
        borderRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 16,
        marginBottom: 16,
    },
    signInButton: {
        backgroundColor: colors.black,
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: 'center',
        marginBottom: 24, 
    },
    signInButtonText: {
        color: colors.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    alreadyAccountText: {
        textAlign: 'center',
        marginBottom: 24,
        fontSize: 16,
        color: colors.black,
    },
    socialButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingVertical: 16,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: colors.borderColor,
        marginTop: 16,
        paddingHorizontal: 20,
    },
    socialButtonText: {
        color: colors.black,
        marginLeft: 10,
        flex: 1,
    },
    socialIcon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
    arrowIcon: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },signInButtonDisabled: {
        opacity: 0.5,
    },
});

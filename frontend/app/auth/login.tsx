import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from "expo-router";

const googleLogo = { uri: 'https://cdn-icons-png.flaticon.com/512/281/281764.png' };
const facebookLogo = { uri: 'https://cdn-icons-png.flaticon.com/512/5968/5968764.png' };
const arrowIcon = { uri: 'https://cdn-icons-png.flaticon.com/512/271/271228.png' };

const SignInScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => {router.push("/auth")}}>
          <Image source={arrowIcon} style={[styles.arrowIcon, { tintColor: 'white', transform: [{ rotate: '180deg' }] }]} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.registerButtonText}>Registre</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Sign in</Text>
        <Text style={styles.subtitle}>Connecter vous à votre compte</Text>
      </View>
      
      <View style={styles.body}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#999"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            secureTextEntry={true}
          />

          <TouchableOpacity style={styles.forgotPasswordButton}>
            <Text style={styles.forgotPasswordText}>Forgot password ?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.signInButton}>
            <Text style={styles.signInButtonText}>Sign in</Text>
          </TouchableOpacity>

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

export default SignInScreen;

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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: colors.primaryGreen,
  },
  backButton: {
    padding: 10,
  },
  registerButtonText: {
    color: colors.white,
    fontWeight: 'bold',
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
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: colors.darkGrayText,
    fontWeight: 'bold',
  },
  signInButton: {
    backgroundColor: colors.primaryGreen,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  signInButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
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
  },
});
import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import CustomButton from "@/components/CustomButton"

const AuthIndex = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Agri<Text style={styles.span}>TECH</Text></Text>
        <Text style={styles.subtitle}>Analyse traitement et conseil</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Tongasoa</Text>
        <Text style={styles.cardSubtitle}>
          Veuillez créer ou vous connecter à votre compte pour commencer
        </Text>

        <CustomButton
          title="Sign in"
          handlePress={() => router.push("/auth/login")}
          containerStyles={styles.signInButton}
          textStyles={styles.signInText}
        />
        <CustomButton
          title="Sign up"
          handlePress={() => router.push("/auth/sign")}
          containerStyles={styles.signUpButton}
          textStyles={styles.signUpText}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  logoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#B5A663",
    marginTop: 10,
  },
  subtitle: {
    fontSize: 20,
  },
  span: {
    fontSize: 30,
    color: "#255C50",
  },
  card: {
    backgroundColor: "#255C50",
    padding: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingBottom: 50,
    height:381
  },
  cardTitle: {
    fontSize: 32,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  cardSubtitle: {
    fontSize: 24,
    color: "#FFFFFF",
    marginTop: 10,
    marginBottom: 30,
  },
  signInButton: {
    backgroundColor: "#000000",
    borderRadius: 25,
    marginBottom: 15,
  },
  signInText: {
    color: "#FFFFFF",
  },
  signUpButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
  },
  signUpText: {
    color: "#000000",
  },
});

export default AuthIndex;
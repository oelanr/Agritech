import React from "react";
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, SafeAreaView, Dimensions } from "react-native";
import { router } from "expo-router";


const { width, height } = Dimensions.get("window");

const WelcomeScreen = () => {
  return (
    <ImageBackground
      source={require("../../assets/images/rice.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.topTextContainer}>
          <Text style={styles.title}>L'application idéale pour vos plantations de riz</Text>
        </View>

        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.signInButton} onPress={() => router.push('/auth/login')}>
            <Text style={styles.signInText}>Se connecter</Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text style={styles.createText} onPress={() => router.push('/auth/sign')}>S'inscrire</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "105%",
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  topTextContainer: {
    marginTop: height * 0.1,
    marginLeft: width * 0.05,
  },
  title: {
    color: "#fff",
    fontSize: width * 0.1,
    lineHeight: width * 0.15,
  },
  bottomContainer: {
    alignItems: "center",
    marginBottom: height * 0.30,
  },
  signInButton: {
    backgroundColor: "rgba(128, 128, 128, 0.3)",
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.35,
    borderRadius: 25,
    marginBottom: 15,
  },
  signInText: {
    color: "#fff",
    fontSize: width * 0.05,
  },
  createText: {
    color: "#fff",
    fontSize: width * 0.04,
    textDecorationLine: "underline",
  },
});
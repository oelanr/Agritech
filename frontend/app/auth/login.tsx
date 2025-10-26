import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  StatusBar,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import Checkbox from "expo-checkbox";
import { MaterialIcons, Entypo, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import api from "../../services/api"; // ton fichier api.ts

const { width } = Dimensions.get("window");

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erreur", "Veuillez saisir votre email et mot de passe.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post("users/login", { email, password });
      const { access_token, email: userEmail, id: userId } = response.data;

      await AsyncStorage.setItem("authToken", access_token);
      await AsyncStorage.setItem("email", userEmail);
      await AsyncStorage.setItem("userId", userId);

      // Alert.alert("Succès", message);
      router.replace("/screens");
    } catch (error: any) {
      const msg =
        error?.response?.data?.detail ||
        "Impossible de se connecter au serveur.";
      Alert.alert("Erreur de connexion", msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <ImageBackground
        source={require("@/assets/images/vary_tymain.jpg")}
        style={styles.imageBackground}
        resizeMode="cover"
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push('/auth')}
        >
          <Ionicons name="chevron-back" size={20} color="white" />
        </TouchableOpacity>
      </ImageBackground>

      <View style={styles.formContainer}>
        <Text style={styles.title}>Bon retour parmi nous</Text>
        <Text style={styles.subtitle}>Connecter vous à votre compte</Text>

        <View style={styles.inputContainer}>
          <MaterialIcons name="person" size={20} color="#777" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Entypo name="lock" size={20} color="#777" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            placeholderTextColor="#999"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Entypo
              name={showPassword ? "eye" : "eye-with-line"}
              size={20}
              color="#777"
              style={styles.iconRight}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <View style={styles.checkboxRow}>
            <Checkbox value={remember} onValueChange={setRemember} />
            <Text style={styles.rememberText}>Se souvenir de moi</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.forgot}>Mots de passe oublié ?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.loginBtn, isLoading && { opacity: 0.6 }]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginText}>Se connecter</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.signup} onPress={() => router.push('/auth/sign')}>
          Nouveau chez Agritech?{" "}
          <Text style={styles.signupLink}>S'inscrire</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  imageBackground: {
    position: "absolute",
    top: 0,
    width: width,
    height: 410,
    overflow: "hidden",
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(128,128,128,0.5)",
    justifyContent: "center",
    alignItems: "center",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  formContainer: {
    flex: 1,
    marginTop: 320,
    paddingTop: 70,
    padding: 20,
    backgroundColor: "#fff",
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#b9b9b9ff",
    elevation:3
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    color: "#777",
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    width: "100%",
  },
  icon: { marginRight: 10 },
  iconRight: { marginLeft: 10 },
  input: { flex: 1, height: 45, fontSize: 14 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  checkboxRow: { flexDirection: "row", alignItems: "center" },
  rememberText: { fontSize: 16, color: "#555", marginLeft: 5 },
  forgot: { fontSize: 16, color: "#2e7d32", fontWeight: "bold" },
  loginBtn: {
    backgroundColor: "#2e7d32",
    borderRadius: 10,
    paddingVertical: 12,
    width: "100%",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  loginText: { color: "white", fontWeight: "bold", fontSize: 20 },
  signup: { fontSize: 16, color: "#555" },
  signupLink: { color: "#2e7d32", fontWeight: "bold" },
});

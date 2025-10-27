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
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
} from "react-native";
import Checkbox from "expo-checkbox";
import { MaterialIcons, Entypo, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import api from "../../services/api";

const { width } = Dimensions.get("window");

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 🌿 Animation d’apparition
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(40))[0];

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
    ]).start();
  }, []);

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

      router.replace("/screens");
    } catch (error) {
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
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* 🌾 Image de fond avec overlay vert */}
      <ImageBackground
        source={require("@/assets/images/vary_tymain.jpg")}
        style={styles.imageBackground}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        <TouchableOpacity style={styles.backButton} onPress={() => router.push("/auth")}>
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </TouchableOpacity>
      </ImageBackground>

      {/* 🧩 Formulaire animé */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Animated.View
          style={[
            styles.formContainer,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Text style={styles.title}>Bon retour parmi nous</Text>
          <Text style={styles.subtitle}>Connectez-vous à votre compte</Text>

          {/* Champ email */}
          <View style={styles.inputContainer}>
            <MaterialIcons name="person" size={20} color="#2E7D32" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Adresse email"
              placeholderTextColor="#888"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
          </View>

          {/* Champ mot de passe */}
          <View style={styles.inputContainer}>
            <Entypo name="lock" size={20} color="#2E7D32" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Mot de passe"
              placeholderTextColor="#888"
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

          {/* Ligne options */}
          <View style={styles.row}>
            <View style={styles.checkboxRow}>
              <Checkbox
                value={remember}
                onValueChange={setRemember}
                color={remember ? "#2E7D32" : undefined}
              />
              <Text style={styles.rememberText}>Se souvenir de moi</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.forgot}>Mot de passe oublié ?</Text>
            </TouchableOpacity>
          </View>

          {/* Bouton principal */}
          <TouchableOpacity
            style={[styles.loginBtn, isLoading && { opacity: 0.7 }]}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginText}>Se connecter</Text>
            )}
          </TouchableOpacity>

          {/* Lien d'inscription */}
          <Text style={styles.signup}>
            Nouveau chez <Text style={styles.brand}>AgriTech</Text> ?{" "}
            <Text style={styles.signupLink} onPress={() => router.push("/auth/sign")}>
              Créez un compte
            </Text>
          </Text>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  imageBackground: {
    position: "absolute",
    top: 0,
    width: width,
    height: 420,
    justifyContent: "flex-start",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(46,125,50,0.35)",
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },

  formContainer: {
    flex: 1,
    marginTop: 330,
    backgroundColor: "#fff",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingHorizontal: 25,
    paddingTop: 50,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 6,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2E7D32",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#555",
    marginBottom: 25,
    textAlign: "center",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F6F8F7",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 18,
    width: "100%",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  input: {
    flex: 1,
    height: 46,
    fontSize: 15,
    color: "#222",
  },
  icon: { marginRight: 8 },
  iconRight: { marginLeft: 8 },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 25,
  },
  checkboxRow: { flexDirection: "row", alignItems: "center" },
  rememberText: { fontSize: 14, color: "#555", marginLeft: 6 },
  forgot: { fontSize: 14, color: "#2E7D32", fontWeight: "600" },

  loginBtn: {
    backgroundColor: "#2E7D32",
    borderRadius: 30,
    paddingVertical: 14,
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#2E7D32",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  loginText: { color: "#fff", fontWeight: "600", fontSize: 17 },

  signup: { fontSize: 15, color: "#444", textAlign: "center" },
  brand: { color: "#2E7D32", fontWeight: "700" },
  signupLink: { color: "#2E7D32", fontWeight: "700" },
});

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  ActivityIndicator,
  StatusBar,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
} from "react-native";
import { MaterialIcons, Entypo, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import api from "../../services/api";

const { width } = Dimensions.get("window");

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✨ Animation d’apparition
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(40))[0];

  useEffect(() => {
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

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("users/signup", { email, password });

      if (response.status === 201 || response.status === 200) {
        Alert.alert("Succès", "Compte créé avec succès !");
        router.push("/auth/login");
      } else {
        Alert.alert("Erreur", "Une erreur est survenue. Réessayez.");
      }
    } catch (error) {
      console.log("Erreur d’inscription:", error.response?.data || error.message);
      Alert.alert(
        "Erreur",
        error.response?.data?.detail || "Impossible de créer le compte."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* 🌿 Image décorative en haut */}
      <ImageBackground
        source={require("../../assets/images/rice.jpg")}
        style={styles.imageHeader}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        <TouchableOpacity style={styles.backButton} onPress={() => router.push("/auth")}>
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </TouchableOpacity>
      </ImageBackground>

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
          <Text style={styles.title}>Créer un compte 🌾</Text>
          <Text style={styles.subtitle}>
            Rejoignez <Text style={styles.brand}>AgriTech</Text> et innovez dans l’agriculture !
          </Text>

          {/* Champ email */}
          <View style={styles.inputContainer}>
            <MaterialIcons name="email" size={20} color="#2E7D32" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Adresse e-mail"
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

          {/* Bouton inscription */}
          <TouchableOpacity
            style={[styles.registerBtn, loading && { opacity: 0.7 }]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.registerText}>S'inscrire</Text>
            )}
          </TouchableOpacity>

          {/* Lien vers connexion */}
          <Text style={styles.login}>
            Vous avez déjà un compte ?{" "}
            <Text style={styles.loginLink} onPress={() => router.push("/auth/login")}>
              Se connecter
            </Text>
          </Text>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  imageHeader: {
    position: "absolute",
    top: 0,
    width,
    height: 380,
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
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },

  formContainer: {
    flex: 1,
    marginTop: 310,
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
  },
  subtitle: {
    fontSize: 15,
    color: "#555",
    marginBottom: 35,
    textAlign: "center",
  },
  brand: { color: "#2E7D32", fontWeight: "700" },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F6F8F7",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 20,
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

  registerBtn: {
    backgroundColor: "#2E7D32",
    borderRadius: 30,
    paddingVertical: 14,
    width: "100%",
    alignItems: "center",
    marginBottom: 25,
    shadowColor: "#2E7D32",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  registerText: { color: "#fff", fontWeight: "600", fontSize: 17 },

  login: { fontSize: 15, color: "#444", textAlign: "center" },
  loginLink: { color: "#2E7D32", fontWeight: "700" },
});

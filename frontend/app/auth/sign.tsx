import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons, Entypo, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import api from "../../services/api"; // 🔹 on utilise ton api.tsx

const { width } = Dimensions.get("window");

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    try {
      setLoading(true);

      // 🔹 Appel vers ton backend FastAPI via api.tsx
      const response = await api.post("users/signup", { email, password });

      if (response.status === 201 || response.status === 200) {
        Alert.alert("Succès", "Compte créé avec succès !");
        router.push("/auth/login");
      } else {
        Alert.alert("Erreur", "Une erreur est survenue. Réessayez.");
      }
    } catch (error: any) {
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
      <TouchableOpacity style={styles.backButton} onPress={() => router.push("/auth")}>
        <Ionicons name="chevron-back" size={20} color="black" />
      </TouchableOpacity>

      <View style={styles.formContainer}>
        <Text style={styles.title}>Inscription</Text>
        <Text style={styles.subtitle}>Créer votre compte simplement</Text>

        <View style={styles.inputContainer}>
          <MaterialIcons name="email" size={20} color="#777" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="user@gmail.com"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
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

        <TouchableOpacity
          style={[styles.loginBtn, loading && { opacity: 0.7 }]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginText}>S'inscrire</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.login} onPress={() => router.push("/auth/login")}>
          Vous avez déjà un compte ?{" "}
          <Text style={styles.loginLink}>Se connecter</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(128,128,128,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  formContainer: {
    flex: 1,
    alignItems: "center",
    paddingTop: "40%",
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
    marginBottom: 60,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 35,
    width: "100%",
  },
  icon: { marginRight: 10 },
  iconRight: { marginLeft: 10 },
  input: { flex: 1, height: 45, fontSize: 14 },
  loginBtn: {
    backgroundColor: "#2e7d32",
    borderRadius: 10,
    paddingVertical: 12,
    width: "100%",
    alignItems: "center",
    marginVertical: 15,
  },
  loginText: { color: "white", fontWeight: "bold", fontSize: 16 },
  login: { fontSize: 16, color: "#555", marginTop: 20 },
  loginLink: { color: "#2e7d32", fontWeight: "bold" },
});

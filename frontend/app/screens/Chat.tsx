import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
  TextInput,
  TouchableOpacity,
} from "react-native";
import api from "../../services/api";
import CustomHero from "@/components/CustomHero";
import { useRoute } from "@react-navigation/native";
import { getOrCreateUserId } from "../../utils/user"; // ✅ ajouté

const { width } = Dimensions.get("window");

// ------------------- TypingIndicator -------------------
const TypingIndicator = () => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  const animateDot = (dot: Animated.Value, delay: number) => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(dot, { toValue: 1, duration: 400, delay, useNativeDriver: true }),
        Animated.timing(dot, { toValue: 0, duration: 400, useNativeDriver: true }),
      ])
    ).start();
  };

  useEffect(() => {
    animateDot(dot1, 0);
    animateDot(dot2, 200);
    animateDot(dot3, 400);
  }, []);

  return (
    <View style={styles.typingIndicatorContainer}>
      {[dot1, dot2, dot3].map((dot, i) => (
        <Animated.View
          key={i}
          style={[
            styles.typingDot,
            {
              opacity: dot.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }),
              transform: [{ translateY: dot.interpolate({ inputRange: [0, 1], outputRange: [0, -5] }) }],
            },
          ]}
        />
      ))}
    </View>
  );
};

// ------------------- MessageBubble -------------------
interface MessageProps {
  sender: "bot" | "user";
  text: string;
}

const MessageBubble: React.FC<MessageProps> = ({ sender, text }) => {
  const isUser = sender === "user";
  return (
    <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.botBubble]}>
      <Text style={[styles.messageText, isUser ? styles.userText : styles.botText]}>{text}</Text>
    </View>
  );
};

// ------------------- Chat Component -------------------
const Chat = () => {
  const [messages, setMessages] = useState<{ sender: "bot" | "user"; text: string }[]>([
    { sender: "bot", text: "Analyse de vos symptômes en cours..." },
  ]);
  const [loading, setLoading] = useState(true);
  const [inputText, setInputText] = useState("");
  const [userId, setUserId] = useState<string | null>(null); // ✅ stocke l'user_id
  const [sessionId, setSessionId] = useState<string>(""); // ✅ stocke sessionId

  const scrollViewRef = useRef<ScrollView>(null);
  const route = useRoute();
  const initialData = route.params?.data || null;

  // 🔹 Initialise userId et sessionId
  useEffect(() => {
    const init = async () => {
      const uid = await getOrCreateUserId();
      setUserId(uid);
      setSessionId(`sess-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`);
    };
    init();
  }, []);

  // 🔹 Scroll automatique
  useEffect(() => {
    if (scrollViewRef.current) scrollViewRef.current.scrollToEnd({ animated: true });
  }, [messages]);

  // ------------------- Scan initial -------------------
  useEffect(() => {
    if (!initialData || !userId || !sessionId) return; // ✅ attendre que userId et sessionId soient prêts

    const sendScanAndChat = async () => {
      try {
        const payload = {
          user_id: userId, // ✅ userId persistant
          symptomes: Object.fromEntries(Object.entries(initialData).map(([k, v]) => [k, v ?? 0])),
        };

        const response = await api.post("/scan/predict", payload);
        const prediction = response.data?.prediction || "Impossible de déterminer le résultat.";

        setMessages((prev) => [...prev, { sender: "bot", text: `Résultat du scan : ${prediction}` }]);

        const chatResponse = await api.post("/chat/ask", {
          question: `La maladie détectée est ${prediction}. Donne les causes, symptômes principaux, actions correctives et méthodes de prévention adaptées.`,
          session_id: sessionId,
          user_id: userId, // ✅ userId persistant
        });

        const advice = chatResponse.data?.answer || "Impossible de fournir des conseils détaillés pour le moment.";
        setMessages((prev) => [...prev, { sender: "bot", text: advice }]);
      } catch (error) {
        console.error("Erreur scan:", error);
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "Erreur lors de l'analyse ou de la génération de conseils." },
        ]);
      } finally {
        setLoading(false);
      }
    };

    sendScanAndChat();
  }, [initialData, userId, sessionId]);

  // ------------------- Envoi message utilisateur -------------------
  const sendMessage = async () => {
    if (!inputText.trim() || !userId || !sessionId) return;

    const userMessage = { sender: "user", text: inputText };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");

    try {
      const response = await api.post("/chat/ask", {
        question: inputText,
        session_id: sessionId,
        user_id: userId, // ✅ userId persistant
      });

      const botMessage = { sender: "bot", text: response.data.answer || "Aucune réponse reçue du chatbot." };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      setMessages((prev) => [...prev, { sender: "bot", text: "Erreur de communication avec le chatbot." }]);
    }
  };

  // ------------------- Rendu -------------------
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#fff" }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <CustomHero title="Résultat du Scan" heroText="Voici l'analyse détaillée basée sur vos symptômes." />

      <ScrollView ref={scrollViewRef} style={styles.chatContainer} contentContainerStyle={{ paddingBottom: 100 }}>
        {messages.map((msg, i) => (
          <MessageBubble key={i} sender={msg.sender} text={msg.text} />
        ))}
        {loading && (
          <View style={[styles.messageBubble, styles.botBubble]}>
            <TypingIndicator />
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Écrivez un message..."
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={{ color: "#fff" }}>Envoyer</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

// ------------------- Styles -------------------
const styles = StyleSheet.create({
  chatContainer: { flex: 1, paddingHorizontal: 20, marginTop: 10 },
  messageBubble: { padding: 12, borderRadius: 15, marginVertical: 6, maxWidth: width * 0.85 },
  botBubble: { backgroundColor: "#212121", alignSelf: "flex-start", borderTopLeftRadius: 5 },
  userBubble: { backgroundColor: "#f0f0f0", alignSelf: "flex-end", borderTopRightRadius: 5 },
  messageText: { fontSize: 16, lineHeight: 22 },
  botText: { color: "#fff" },
  userText: { color: "#212121" },
  typingIndicatorContainer: { flexDirection: "row", alignItems: "center", paddingHorizontal: 5 },
  typingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#fff", marginHorizontal: 2 },
  inputContainer: { flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 8, borderTopWidth: 1, borderColor: "#ddd", backgroundColor: "#fff" },
  input: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 20, paddingHorizontal: 15, paddingVertical: 8, fontSize: 16, marginRight: 10 },
  sendButton: { backgroundColor: "#212121", paddingHorizontal: 15, paddingVertical: 10, borderRadius: 20 },
});

export default Chat;

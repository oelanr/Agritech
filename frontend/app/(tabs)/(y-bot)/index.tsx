import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

// --- TYPES ET MOCKS D'API ---
// Remplacez-les par vos vrais types et appels API (ex: avec fetch ou axios)

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

// --- CONFIGURATION API ---
// TODO: Remplacez cette URL par l'adresse de votre backend.
// Si vous testez sur un appareil physique, utilisez l'adresse IP de votre machine sur le réseau local.
// Exemple: 'http://192.168.1.10:5000'
const API_BASE_URL = 'http://VOTRE_API_URL';

/**
 * Appelle votre API de classification.
 * @param message Le message de l'utilisateur.
 * @returns La catégorie du message. ex: { category: 'GENERAL_QUERY' }
 */
const callClassificationApi = async (message: string): Promise<{ category: string }> => {
  console.log(`[API] Classification du message: "${message}"`);
  const response = await fetch(`${API_BASE_URL}/classify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erreur API de classification (${response.status}): ${errorText}`);
  }

  return response.json();
};

/**
 * Appelle votre API de chatbot.
 * @param message Le message de l'utilisateur.
 * @returns La réponse du bot. ex: { reply: '...' }
 */
const callChatbotApi = async (message: string): Promise<{ reply: string }> => {
  console.log(`[API] Obtention de la réponse du bot pour: "${message}"`);
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erreur API du chatbot (${response.status}): ${errorText}`);
  }

  return response.json();
};

// --- COMPOSANT DE L'ÉCRAN ---

export default function YBotScreen() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 'init', text: 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?', sender: 'bot' },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const handleSend = async () => {
    if (input.trim().length === 0 || isLoading) return;

    const userMessageText = input.trim();
    const userMessage: Message = { id: Date.now().toString(), text: userMessageText, sender: 'user' };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // 1. Appel à l'API de classification
      const classification = await callClassificationApi(userMessageText);

      let botResponseText: string;

      // 2. Logique basée sur la classification
      if (classification.category === 'INAPPROPRIATE_CONTENT') {
        botResponseText = "Je ne peux pas répondre à cette demande. Restons courtois.";
      } else {
        // 3. Si tout va bien, appel à l'API du chatbot
        const chatResponse = await callChatbotApi(userMessageText);
        botResponseText = chatResponse.reply;
      }

      const botMessage: Message = { id: `${Date.now()}-bot`, text: botResponseText, sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error("Erreur lors de l'appel API:", error);
      const errorMessage: Message = { id: `${Date.now()}-error`, text: "Désolé, une erreur est survenue. Veuillez réessayer.", sender: 'bot' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fait défiler la liste vers le bas quand un nouveau message arrive
  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={90}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={[styles.messageBubble, item.sender === 'user' ? styles.userBubble : styles.botBubble]}>
              <Text style={item.sender === 'user' ? styles.userText : styles.botText}>{item.text}</Text>
            </View>
          )}
          contentContainerStyle={styles.messagesContainer}
        />

        {isLoading && <ActivityIndicator size="small" color={Colors.light.tint} style={styles.loadingIndicator} />}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Écrivez votre message..."
            placeholderTextColor="#999"
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend} disabled={isLoading}>
            <Ionicons name="send" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// --- STYLES ---

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f0' },
  messagesContainer: { padding: 10, paddingBottom: 20 },
  messageBubble: { padding: 12, borderRadius: 20, marginBottom: 10, maxWidth: '80%' },
  userBubble: { backgroundColor: Colors.light.tint, alignSelf: 'flex-end' },
  botBubble: { backgroundColor: 'white', alignSelf: 'flex-start' },
  userText: { color: 'white' },
  botText: { color: 'black' },
  loadingIndicator: { marginVertical: 10 },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.tint,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
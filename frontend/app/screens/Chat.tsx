import { StyleSheet, Text, View, ActivityIndicator, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import api from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Chat = () => {
  const route = useRoute();
  const { data } = route.params || {}; // Données du scan (symptômes, etc.)
  
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [userMessage, setUserMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Charger userId depuis le stockage local
  useEffect(() => {
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem('userId');
      setUserId(id);
    };
    fetchUserId();
  }, []);

  // Fonction d’envoi du formulaire (scan)
  const handleScanSubmit = async () => {
    if (!userId) {
      alert("Utilisateur non identifié !");
      return;
    }

    setLoading(true);
    try {
      // Étape 1 — Envoi des symptômes au modèle
      const payload = {
        user_id: userId, // ✅ vrai identifiant utilisateur
        symptomes: Object.fromEntries(Object.entries(data).map(([k, v]) => [k, v ?? 0])),
      };

      const response = await api.post('/scan/predict', payload);
      const prediction = response.data.prediction;
      const newSessionId = response.data.session_id;

      setSessionId(newSessionId);
      setMessages([{ sender: 'bot', text: `Résultat du scan : ${prediction}` }]);

      // Étape 2 — Appel au chatbot pour explication de la maladie
      const chatResponse = await api.post('/chat/ask', {
        question: `La maladie détectée est ${prediction}. Donne les causes, symptômes principaux, actions correctives et méthodes de prévention adaptées.`,
        session_id: newSessionId,
      });

      const botReply = chatResponse.data.answer;
      setMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
    } catch (error) {
      console.error('Erreur lors du scan:', error);
      setMessages(prev => [...prev, { sender: 'bot', text: "Une erreur est survenue lors de l'analyse." }]);
    } finally {
      setLoading(false);
    }
  };

  // Fonction d’envoi de message utilisateur
  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;

    const newMessage = { sender: 'user', text: userMessage };
    setMessages(prev => [...prev, newMessage]);
    setUserMessage('');

    try {
      const response = await api.post('/chat/ask', {
        question: userMessage,
        session_id: sessionId || 'default_thread_non_persisted',
      });

      const botReply = response.data.answer;
      setMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
    } catch (error) {
      console.error('Erreur chatbot:', error);
      setMessages(prev => [...prev, { sender: 'bot', text: "Erreur de communication avec le chatbot." }]);
    }
  };

  useEffect(() => {
    handleScanSubmit();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.chatContainer}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg, index) => (
          <View
            key={index}
            style={[
              styles.messageContainer,
              msg.sender === 'user' ? styles.userMessage : styles.botMessage,
            ]}
          >
            <Text style={styles.messageText}>{msg.text}</Text>
          </View>
        ))}
        {loading && <ActivityIndicator size="small" color="#006A61" />}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Écrire un message..."
          value={userMessage}
          onChangeText={setUserMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Text style={styles.sendText}>Envoyer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { flex: 1 },
  chatContainer: { padding: 10 },
  messageContainer: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#F1F0F0',
  },
  messageText: { color: '#333' },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  input: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  sendButton: {
    backgroundColor: '#006A61',
    borderRadius: 20,
    marginLeft: 8,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  sendText: { color: '#fff', fontWeight: 'bold' },
});

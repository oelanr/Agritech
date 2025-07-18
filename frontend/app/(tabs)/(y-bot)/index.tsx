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
  Image,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError } from 'axios';

const BASE_URL_FASTAPI = 'http://192.128.88.251:8000';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

interface AnalysisResult {
  diagnostic: string;
}

interface ApiErrorResponse {
  detail?: string;
  error?: string;
  message?: string;
}

const callClassificationApi = async (message: string): Promise<{ category: string }> => {
  console.log(`[API] Classification du message: "${message}"`);
  const response = await axios.post(`${BASE_URL_FASTAPI}/classify`, { message });
  return response.data;
};

const callChatbotApi = async (message: string): Promise<{ reply: string }> => {
  console.log(`[API] Obtention de la réponse du bot pour: "${message}"`);
  const response = await axios.post(`${BASE_URL_FASTAPI}/chat`, { message });
  return response.data;
};

export default function YBotScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState('User');
  const [diagnosticResult, setDiagnosticResult] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const storedUserName = await AsyncStorage.getItem('userName');
        if (storedUserName) {
          setUserName(storedUserName);
        }

        const storedAnalysisResult = await AsyncStorage.getItem('lastAnalysisResult');
        if (storedAnalysisResult) {
          const parsedResult: AnalysisResult = JSON.parse(storedAnalysisResult);
          setDiagnosticResult(parsedResult.diagnostic);
          setMessages([
            { id: 'init-bot', text: `Bonjour, en fonction du résultat du diagnostic (${parsedResult.diagnostic}), je vous donnerais les traitements nécessaires à appliquer.`, sender: 'bot' },
          ]);
        } else {
          setMessages([
            { id: 'init-bot', text: 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?', sender: 'bot' },
          ]);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données initiales:", error);
        setMessages([
          { id: 'init-bot', text: 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?', sender: 'bot' },
        ]);
      }
    };
    loadInitialData();
  }, []);

  const handleSend = async () => {
    if (input.trim().length === 0 || isLoading) return;

    const userMessageText = input.trim();
    const userMessage: Message = { id: Date.now().toString(), text: userMessageText, sender: 'user' };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const classification = await callClassificationApi(userMessageText);

      let botResponseText: string;

      if (classification.category === 'INAPPROPRIATE_CONTENT') {
        botResponseText = "Je ne peux pas répondre à cette demande. Restons courtois.";
      } else {
        const chatResponse = await callChatbotApi(userMessageText);
        botResponseText = chatResponse.reply;
      }

      const botMessage: Message = { id: `${Date.now()}-bot`, text: botResponseText, sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error("Erreur lors de l'appel API:", error);
      const axiosError = error as AxiosError<ApiErrorResponse>;
      let errorMessageText = "Désolé, une erreur est survenue. Veuillez réessayer.";

      if (axiosError.response) {
        errorMessageText = `Erreur du serveur: ${axiosError.response.status} - ${axiosError.response.data?.detail || axiosError.response.data?.error || axiosError.response.data?.message || 'Réponse inattendue'}`;
      } else if (axiosError.request) {
        errorMessageText = "Erreur réseau: Impossible de se connecter au serveur. Vérifiez votre IP et connexion.";
      } else {
        errorMessageText = `Erreur inattendue: ${axiosError.message}`;
      }

      const errorMessage: Message = { id: `${Date.now()}-error`, text: errorMessageText, sender: 'bot' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const getUserInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingContainer}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.header}>
          <View style={styles.userHeader}>
            <View style={styles.userCircle}>
              <Text style={styles.userInitial}>{getUserInitial(userName)}</Text>
            </View>
            <Text style={styles.userName}>{userName}, User</Text>
          </View>

          <Text style={styles.analysisTitle}>Résultat de l'analyse</Text>

          <View style={styles.diagnosticContainer}>
            <Text style={styles.diagnosticLabel}>Diagnostic:</Text>
            <Text style={styles.diagnosticText}>{diagnosticResult || 'Chargement...'}</Text>
          </View>
        </View>

        <View style={styles.agribotSection}>
          <View style={styles.agribotInfo}>
            <Ionicons name="leaf-outline" size={30} color={Colors.light.tint} style={styles.agribotIcon} />
            <View>
              <Text style={styles.agribotTitle}>Agribot</Text>
              <Text style={styles.agribotDescription}>Bot traitant de problème de maladie de culture agricole</Text>
            </View>
          </View>
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={[styles.messageBubble, item.sender === 'user' ? styles.userBubble : styles.botBubble]}>
              {item.sender === 'bot' && (
                <Ionicons name="chatbubble-outline" size={16} color={item.sender === 'user' ? 'white' : Colors.light.icon} style={styles.messageIcon} />
              )}
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
            placeholder="Entrez votre requête..."
            placeholderTextColor="#999"
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend} disabled={isLoading}>
            <Ionicons name="send" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem} onPress={() => router.replace('/(tabs)/(home)')}>
            <Ionicons name="home-outline" size={24} color="black" />
            <Text style={styles.navText}>Accueil</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => router.replace('/(tabs)/(scan)')}>
            <Ionicons name="stats-chart-outline" size={24} color="black" />
            <Text style={styles.navText}>Analyse</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => router.replace('/(tabs)/(y-bot)')}>
            <Ionicons name="chatbubbles-outline" size={24} color={Colors.light.tint} />
            <Text style={[styles.navText, { color: Colors.light.tint }]}>Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => router.replace('/(tabs)/(z-profil)')}>
            <Ionicons name="person-outline" size={24} color="black" />
            <Text style={styles.navText}>Profil</Text>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    marginBottom: 15,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  userCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E1E1E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  userInitial: {
    fontWeight: 'bold',
    color: '#000',
    fontSize: 24,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  analysisTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#000',
  },
  diagnosticContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  diagnosticLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    marginRight: 10,
  },
  diagnosticText: {
    fontSize: 18,
    color: Colors.light.tint,
    fontWeight: '600',
  },
  agribotSection: {
    backgroundColor: 'white',
    borderRadius: 15,
    marginHorizontal: 20,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 20,
  },
  agribotInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  agribotIcon: {
    marginRight: 10,
  },
  agribotTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  agribotDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  messagesContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexGrow: 1,
  },
  messageBubble: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginBottom: 10,
    maxWidth: '85%',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  userBubble: {
    backgroundColor: Colors.light.tint,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 5,
  },
  botBubble: {
    backgroundColor: 'white',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 5,
  },
  userText: {
    color: 'white',
    fontSize: 16,
  },
  botText: {
    color: '#333',
    fontSize: 16,
    flexShrink: 1,
  },
  messageIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  loadingIndicator: {
    marginVertical: 10,
    alignSelf: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 15,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: 'white',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    minHeight: 45,
    backgroundColor: '#f0f4f7',
    borderRadius: 25,
    paddingHorizontal: 18,
    marginRight: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  sendButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.light.tint,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: 'white',
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
  },
  navText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});

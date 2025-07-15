import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function BotResultScreen() {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    console.log('Message envoyé :', message);
    setMessage('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.fullScreen}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Résultat de l’analyse</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Diagnostic :</Text>
            <Text style={styles.value}>Type de maladie</Text>
          </View>

          <View style={styles.botInfo}>
            <Image
              source={require('@/assets/images/agribot.png')}
              style={styles.botImage}
            />
            <View style={styles.botTextContainer}>
              <Text style={styles.botTitle}>Agribot</Text>
              <Text style={styles.botSubtitle}>
                Bot traiteur de problème de maladie de culture agricole
              </Text>
            </View>
          </View>

         
          <View style={styles.chatContainer}>
            <View style={[styles.botMessageRow, { marginTop: 10 }]}>
              <Image
                source={require('@/assets/images/agribot.png')}
                style={styles.profilePic}
              />
              <View style={styles.messageBubble}>
                <Text style={styles.messageText}>
                  Bonjour, en fonction du résultat du diagnostic je vous donnerais les traitements nécessaires à appliquer.
                </Text>
              </View>
            </View>

         
            <View style={styles.inputRow}>
              <TextInput
                placeholder="Entrez votre requête..."
                placeholderTextColor="black"
                style={styles.input}
                value={message}
                onChangeText={setMessage}
              />
              <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                <Ionicons name="send" size={22} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  fullScreen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  profilPic: {
    backgroundColor: '#FFF',
    borderRadius: '10'
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    //marginTop:10,
    marginBottom: 24,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    justifyContent: 'center',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 10,
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#888888',
  },
  botInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    justifyContent: 'center',
  },
  botImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginRight: 16,
  },
  botTextContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  botTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F362E',   
    marginBottom: 10,
  },
  botSubtitle: {
    fontSize: 14,
    color: 'black',
  },
  chatContainer: {
    backgroundColor: '#F3F3F3',
    borderRadius: 12,
    padding: 12,
    minHeight: 220,
    justifyContent: 'space-between',
  },
  botMessageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  profilePic: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
  },
  messageBubble: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 12,
    maxWidth: '85%',
  },
  messageText: {
    color: 'black',
    fontSize: 14,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    fontSize: 14,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 20,
  },
});

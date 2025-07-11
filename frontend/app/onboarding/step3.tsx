import { ImageBackground, View, Text, Button, StyleSheet, Image, Pressable} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function Step3() {
  const router = useRouter();

  const finishOnboarding = async () => {
    try {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      router.replace('/'); 
    } catch (error) {
      console.error('Erreur lors de la fin de l’onboarding :', error);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/Onboarding_formation.png')}
      style={styles.background} 
      resizeMode="cover"
    >
      <View style={styles.content}>
            <Image
                source={require('../../assets/images/Progress_bar3.png')} 
                style={{ marginTop: 450, marginLeft: 10}}
            />
            <View style={{ marginTop: 15, padding:10, display:'flex', gap: 2 }}>
                <Text style={styles.title}>Apprenez et</Text>
                <Text style={styles.title}>Appliquez</Text>
            </View>
            <Text style={styles.description}>
                 Si vous êtes nouveau ou que vous souhaitez obtenir des techniques plus avancées, notre application est faite pour vous aider.
            </Text>
           
            <Pressable style={styles.button} onPress={finishOnboarding}>
                <Text style={styles.buttonText}>Commencer</Text>
            </Pressable>
            
            
        </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
    background: {
      flex: 1,
    },
    content: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      padding: 25,
      
      
    },
    title: {
      fontSize: 35,
      fontWeight: 'bold',
      marginBottom: 0,
      color: 'white', 
    },
    button: {
      backgroundColor: '#8B280F',
      paddingVertical: 12,
      width: '100%',
      borderRadius: 16,
      marginBottom: 120
    },
    buttonText: {
      color: 'white',
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center'
    },
    description: {
      
      fontSize: 13,
      color: '#FFFF', 
      fontWeight: 'bold',
      marginHorizontal: 11,
      marginTop: 15,
      marginBottom: 30
      
    },
  });
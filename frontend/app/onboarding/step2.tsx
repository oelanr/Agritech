import { ImageBackground, View, Text, Button, StyleSheet, Image, Pressable} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Step2() {
  const router = useRouter();


  return (
    <ImageBackground
      source={require('../../assets/images/Onboarding_prevision.png')}
      style={styles.background} 
      resizeMode="cover"
    >
      <View style={styles.content}>
            <Image
                source={require('../../assets/images/Progress_bar2.png')} 
                style={{ marginTop: 450, marginLeft: 10}}
            />
            <View style={{ marginTop: 15, padding:10, display:'flex', gap: 2 }}>
                <Text style={styles.title}>Récoltez au</Text>
                <Text style={styles.title}>bon moment</Text>
            </View>
            <Text style={styles.description}>
                Nous vous donnerons une suivie de vos plantations par vérification régulière, ainsi la récolte vous sera plus facile à prévoir. 
            </Text>
           
            <Pressable style={styles.button} onPress={() => router.push('/onboarding/step3')}>
                <Text style={styles.buttonText}>Continuer</Text>
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
    backgroundColor: '#DFC376',
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


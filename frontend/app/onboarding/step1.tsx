import { ImageBackground, View, Text, Button, StyleSheet, Image, Pressable} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Step1() {
  const router = useRouter();


  return (
    <ImageBackground
      source={require('../../assets/images/Onboarding_analyse.png')}
      style={styles.background} 
      resizeMode="cover"
    >
      <View style={styles.content}>
            <Image
                source={require('../../assets/images/Progress_bar1.png')} 
                style={{ marginTop: 450, marginLeft: 10}}
            />
            <View style={{ marginTop: 15, padding:10, display:'flex', gap: 2 }}>
                <Text style={styles.title}>Analysez</Text>
                <Text style={styles.title}>vos cultures</Text>
            </View>
            <Text style={styles.description}>
                Grâce à l’intelligence artificielle, nous pouvons facilement donner un diagnostic rapide sur l’état de vos cultures.
            </Text>
           
            <Pressable style={styles.button} onPress={() => router.push('/onboarding/step2')}>
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
    backgroundColor: '#92AB7C',
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

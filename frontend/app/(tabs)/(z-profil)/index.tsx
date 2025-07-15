
import { useRouter } from 'expo-router';
import { Button, View, Text } from 'react-native';

export default function Profil() {
    const router = useRouter();
  
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' }}>
        <Text>Profil</Text>
       
      </View>
    );
  }
  
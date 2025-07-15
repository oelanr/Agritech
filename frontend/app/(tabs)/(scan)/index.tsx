
import { useRouter } from 'expo-router';
import { Button, View, Text } from 'react-native';

export default function Scan() {
    const router = useRouter();
  
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' }}>
        <Text>Scan</Text>
       
      </View>
    );
  }
  
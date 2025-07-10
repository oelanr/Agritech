/*import { View, Text } from 'react-native';

export default function scan() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>scan</Text>
    </View>
  );
}
*/
import { useRouter } from 'expo-router';
import { Button, View, Text } from 'react-native';

export default function Scan() {
    const router = useRouter();
  
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Scan</Text>
       
      </View>
    );
  }
  
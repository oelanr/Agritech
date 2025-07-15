
import { useRouter } from 'expo-router';
import { Button, View, Text } from 'react-native';

export default function Scan() {
    const router = useRouter();
  
    const handleSimulateClassification = () => {
      const simulatedResult = "Mildiou"; // Simulate a classification result
      router.push({ pathname: '/(tabs)/(y-bot)', params: { classificationResult: simulatedResult } });
    };

    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' }}>
        <Text>Scan</Text>
        <Button
          title="Simulate Classification and Go to Chatbot"
          onPress={handleSimulateClassification}
        />
      </View>
    );
  }
  
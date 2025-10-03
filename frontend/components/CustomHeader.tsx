import { View, Text, StyleSheet } from 'react-native';
import { 
  useFonts, 
  SpaceGrotesk_400Regular, // Poids Regular
  SpaceGrotesk_700Bold      // Poids Bold 
} from '@expo-google-fonts/space-grotesk';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function CustomHeader() {

  const [fontsLoaded] = useFonts({
    'SpaceGrotesk-Regular': SpaceGrotesk_400Regular,
    'SpaceGrotesk-Bold': SpaceGrotesk_700Bold,
  });

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
          <Text style={styles.title}>Agritech</Text>
          <View style={styles.profile}>
              <Text style={styles.nickname}>BR</Text>
          </View>
      </View>
    </SafeAreaView>
    
  );
}

const styles = StyleSheet.create({
    safeContainer: {
        backgroundColor: '#FFFFFF',
    },
    container: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between', 
      alignItems: 'center',
      paddingHorizontal: 20, 
    },
  title: {
    fontSize: 32,
    color: "#212121",
    fontFamily: "SpaceGrotesk-Bold"
  },
  profile: {
    height: 50,
    width: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#212121",
    borderRadius: 50,
  },
  nickname: {
    fontSize: 20, 
    color: "#FFFFFF",
    fontFamily: "SpaceGrotesk-Bold"
  }
});

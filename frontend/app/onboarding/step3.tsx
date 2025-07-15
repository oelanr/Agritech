// // import { ImageBackground, View, Text, Button, StyleSheet, Image, Pressable} from 'react-native';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import { useRouter } from 'expo-router';

// // export default function Step3() {
// //   const router = useRouter();

// //   const finishOnboarding = async () => {
// //     try {
// //       await AsyncStorage.setItem('hasSeenOnboarding', 'true');
// //       router.replace('/'); 
// //     } catch (error) {
// //       console.error('Erreur lors de la fin de l’onboarding :', error);
// //     }
// //   };

// //   return (
// //     <ImageBackground
// //       // source={require('../../assets/images/Onboarding_formation.png')}
// //       style={styles.background} 
// //       resizeMode="cover"
// //     >
// //       <View style={styles.content}>
// //             <Image
// //                 // source={require('../../assets/images/Progress_bar3.png')} 
// //                 style={{ marginTop: 450, marginLeft: 10}}
// //             />
// //             <View style={{ marginTop: 15, padding:10, display:'flex', gap: 2 }}>
// //                 <Text style={styles.title}>Apprenez et</Text>
// //                 <Text style={styles.title}>Appliquez</Text>
// //             </View>
// //             <Text style={styles.description}>
// //                  Si vous êtes nouveau ou que vous souhaitez obtenir des techniques plus avancées, notre application est faite pour vous aider.
// //             </Text>
           
// //             <Pressable style={styles.button} onPress={finishOnboarding}>
// //                 <Text style={styles.buttonText}>Commencer</Text>
// //             </Pressable>
            
            
// //         </View>
// //     </ImageBackground>
// //   );
// // }

// // const styles = StyleSheet.create({
// //     background: {
// //       flex: 1,
// //     },
// //     content: {
// //       display: 'flex',
// //       justifyContent: 'center',
// //       alignItems: 'flex-start',
// //       padding: 25,
      
      
// //     },
// //     title: {
// //       fontSize: 35,
// //       fontWeight: 'bold',
// //       marginBottom: 0,
// //       color: 'white', 
// //     },
// //     button: {
// //       backgroundColor: '#8B280F',
// //       paddingVertical: 12,
// //       width: '100%',
// //       borderRadius: 16,
// //       marginBottom: 120
// //     },
// //     buttonText: {
// //       color: 'white',
// //       fontSize: 20,
// //       fontWeight: 'bold',
// //       textAlign: 'center'
// //     },
// //     description: {
      
// //       fontSize: 13,
// //       color: '#FFFF', 
// //       fontWeight: 'bold',
// //       marginHorizontal: 11,
// //       marginTop: 15,
// //       marginBottom: 30
      
// //     },
// //   });



// import React from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useRouter } from 'expo-router';

// import { useNavigation } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// // Définition des types pour la navigation
// // Note: Le type doit inclure le nom des Stacks pour pouvoir naviguer
// type RootStackParamList = {
//   Onboarding: { screen: string };
//   Auth: { screen: 'Choice' | 'Login' | 'SignUp' };
// };

// type Step3ScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;

// const ThirdScreen = () => {

//   const navigation = useNavigation<Step3ScreenNavigationProp>();

//   const handleStart = () => {
//     // Navigue vers le Stack 'Auth', puis spécifie l'écran 'Choice' à l'intérieur de ce Stack
//     navigation.navigate('Auth', { screen: 'Choice' });

//     // C'est également un bon endroit pour sauvegarder dans le AsyncStorage
//     // ou une autre base de données locale que l'utilisateur a terminé l'onboarding.
//     // Par exemple : AsyncStorage.setItem('onboardingDone', 'true');
//   };

//   const router = useRouter();

//   const finishOnboarding = async () => {
//     try {
//       await AsyncStorage.setItem('hasSeenOnboarding', 'true');
//       router.replace('/'); 
//     } catch (error) {
//       console.error('Erreur lors de la fin de l’onboarding :', error);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.content}>
//         <Text style={styles.title}>Bienvenue dans AgriTech</Text>

//         <Text style={styles.subtitle}>
//           Inscrivez-vous ou connectez-vous à notre application pour plus de pratiques
//         </Text>

//         <View style={styles.logo}>
//           <Text style={styles.logoName}>
//             Agri
//             <Text style={styles.span}>TECH</Text>
//           </Text>
//         </View>

//         <Text style={styles.description}>
//           Commencez votre expérience en intégrant la communauté agricole de demain
//         </Text>
//       </View>

//       <View style={styles.footer}>
//         <View style={styles.dots}>
//           <View style={styles.dot} />
//           <View style={styles.dot} />
//           <View style={styles.dotActive} />
//         </View>

//         <TouchableOpacity>
//           <Text style={styles.next} onPress={()=>{finishOnboarding}}>Commencer </Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default ThirdScreen;

// const styles = StyleSheet.create({
//  container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     paddingHorizontal: 16,
//     justifyContent: 'space-between',
//   },
//   content: {
//     marginTop: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 6,
//   },
//   link: {
//     marginTop:10,
//     marginBottom:10,
//     fontSize:20,
//     fontWeight:"medium"
//   },
//   image: {
//   },
//   subtitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginTop:10,
//     marginBottom: 10,
//   },
//   description: {
//     marginTop:10,
//     fontSize: 20,
//     color: '#333',
//     lineHeight: 30,
//     textAlign:"center"
//   },
//   logo:{
//     backgroundColor:"#E0F2E2",
//     width: '100%',
//     height: 350,
//     borderRadius: 175,
//     marginBottom: 20,
//     marginTop: 20,
//     justifyContent:"center"
//   },
//   logoName:{
//     fontWeight:"semibold",
//     color:"#B5A663",
//     fontSize: 40,
//     textAlign:"center"
//   },
//   span:{
//     fontWeight:"bold",
//     fontSize: 40,
//     color:"#255C50"
//   },
//   footer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   dots: {
//     flexDirection: 'row',
//     gap: 6,
//   },
//   dot: {
//     width: 14,
//     height: 14,
//     borderRadius: 7,
//     backgroundColor: '#ccc',
//   },
//   dotActive: {
//     width: 14,
//     height: 14,
//     borderRadius: 7,
//     backgroundColor: '#000',
//   },
//   next: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#000',
//   },
// });

import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

const Onboarding3 = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Bienvenue dans AgriTech</Text>

        <Text style={styles.subtitle}>
          Inscrivez-vous ou connectez-vous à notre application pour plus de pratiques
        </Text>

        <View style={styles.logo}>
          <Text style={styles.logoName}>
            Agri
            <Text style={styles.span}>TECH</Text>
          </Text>
        </View>

        <Text style={styles.description}>
          Commencez votre expérience en intégrant la communauté agricole de demain
        </Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.dots}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dotActive} />
        </View>

        <TouchableOpacity>
          <Text style={styles.next} onPress={()=>{router.replace("../auth")}}>Commencer </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  content: {
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  link: {
    marginTop:10,
    marginBottom:10,
    fontSize:20,
    fontWeight:"medium"
  },
  image: {
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop:10,
    marginBottom: 10,
  },
  description: {
    marginTop:10,
    fontSize: 20,
    color: '#333',
    lineHeight: 30,
    textAlign:"center"
  },
  logo:{
    backgroundColor:"#E0F2E2",
    width: '100%',
    height: 350,
    borderRadius: 175,
    marginBottom: 20,
    marginTop: 20,
    justifyContent:"center"
  },
  logoName:{
    fontWeight:"semibold",
    color:"#B5A663",
    fontSize: 40,
    textAlign:"center"
  },
  span:{
    fontWeight:"bold",
    fontSize: 40,
    color:"#255C50"
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#ccc',
  },
  dotActive: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#000',
  },
  next: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
});

export default Onboarding3;
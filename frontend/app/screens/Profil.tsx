import { StyleSheet, Text, View,TouchableOpacity } from 'react-native'
import React,{ useEffect,useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { CustomHeroForProfile } from '@/components/CustomHero'
import UserEmail from '@/components/UserEmail'
import { router } from "expo-router";
import { 
  useFonts, 
  SpaceGrotesk_400Regular, // Poids Regular
  SpaceGrotesk_500Medium,
  SpaceGrotesk_700Bold      // Poids Bold 
} from '@expo-google-fonts/space-grotesk';
const UserName = () => {

  const [fontsLoaded] = useFonts({
    'SpaceGrotesk-Regular': SpaceGrotesk_400Regular,
    'SpaceGrotesk-Bold': SpaceGrotesk_700Bold,
    'SpaceGrotesk-Medium' : SpaceGrotesk_500Medium,
  });

  return <>
    <View style={styles.Usercontainer}>
      <Text style={styles.label}>Nom Complet</Text>
      <Text style={styles.fullname}>Bryan Ranaivo</Text>
    </View>
  </>
}

const handleLogout = async () => {
  try {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('email');
    router.replace('/auth/login'); // ou ton chemin d’écran de login
  } catch (error) {
    console.error('Erreur lors de la déconnexion :', error);
  }
};


const SecurityAccount = () => {
   const [fontsLoaded] = useFonts({
    'SpaceGrotesk-Regular': SpaceGrotesk_400Regular,
    'SpaceGrotesk-Bold': SpaceGrotesk_700Bold,
    'SpaceGrotesk-Medium' : SpaceGrotesk_500Medium,
   });
  
  const [email, setEmail] = useState<string | null>(null);

  // récupération de l'email depuis AsyncStorage
  useEffect(() => {
    const loadEmail = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem('email');
        if (storedEmail) setEmail(storedEmail);
      } catch (error) {
        console.error('Erreur lors du chargement de l’email', error);
      }
    };
    loadEmail();
  }, []);
  
  return <>
    <View style={styles.SecurityContainer}>
      <Text style={styles.label}>Sécurité du compte</Text>
      <View style={styles.infoView}>
        <Text style={styles.label}>Email</Text>
        <UserEmail />
      </View>
      <View style={styles.infoView}>
        <Text style={styles.label}>Mot de passe</Text>
        <Text style={styles.fullname}>ooooooooooo</Text>
      </View>
      <View style={styles.infoView}>
        <Text style={styles.label}>Déconnexion</Text>
        <TouchableOpacity style={styles.modify} onPress={handleLogout}>
          <Text style={styles.modifyText}>Se déconnecter</Text>
        </TouchableOpacity>

      </View>
    </View>
  </>
}

const DeleteAccount = () => {
  return <>
    <View style={styles.DeleteContainer}>
        <Text style={styles.label}>Suppression du compte</Text>
        <Text style={styles.labelRequest}>Voulez-vous supprimer votre compte?</Text>
        <Text style={styles.deleteText}>Supprimer</Text>
    </View>
  </>
}

const Profil = () => {
  return <>
    <View style={styles.container}>
      <CustomHeroForProfile />
      <UserName />
      <SecurityAccount />
      <DeleteAccount/>
    </View>
  </>
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    height:"100%"
  },
  Usercontainer: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginHorizontal: 30,
    marginVertical:20,
    borderRadius: 15,
    backgroundColor: "#212121",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  SecurityContainer: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginHorizontal: 30,
    marginBottom:20,
    borderRadius: 15,
    backgroundColor: "#212121",
  },
  DeleteContainer: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginHorizontal: 30,
    borderRadius: 15,
    backgroundColor: "#212121",
  },
  label: {
    fontFamily: "SpaceGrotesk-Medium",
    color: "#FFFFFF",
    fontSize:20
  },
  labelRequest: {
    fontFamily: "SpaceGrotesk-Medium",
    color: "#d1d1d1ff",
    fontSize:16
  },
  fullname: {
    fontFamily: "SpaceGrotesk-Regular",
    color: "#d1d1d1ff",
    fontSize: 20,
    marginRight:10
  },
  infoView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop:20
  },
  modify: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    marginRight:10
  },
  modifyText: {
    fontFamily: "SpaceGrotesk-Medium",
    color: "#212121",
    fontSize:20
  },
  deleteText: {
    fontFamily: "SpaceGrotesk-Medium",
    color: "#e05454ff",
    fontSize: 20,
    textAlign: "right",
    marginRight:10
  }
})

export default Profil
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { CustomHeroForProfile } from '@/components/CustomHero'
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

const SecurityAccount = () => {
   const [fontsLoaded] = useFonts({
    'SpaceGrotesk-Regular': SpaceGrotesk_400Regular,
    'SpaceGrotesk-Bold': SpaceGrotesk_700Bold,
    'SpaceGrotesk-Medium' : SpaceGrotesk_500Medium,
   });
  
  return <>
    <View style={styles.SecurityContainer}>
      <Text style={styles.label}>Sécurité du compte</Text>
      <View style={styles.infoView}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.fullname}>harosonbryan@gmail.com</Text>
      </View>
      <View style={styles.infoView}>
        <Text style={styles.label}>Mot de passe</Text>
        <Text style={styles.fullname}>ooooooooooo</Text>
      </View>
      <View style={styles.infoView}>
        <Text style={styles.label}>Modification</Text>
        <View style={styles.modify}>
          <Text style={styles.modifyText}>Modifier</Text>
        </View>
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
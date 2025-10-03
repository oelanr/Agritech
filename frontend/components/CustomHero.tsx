import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { 
  useFonts, 
  SpaceGrotesk_400Regular, // Poids Regular
  SpaceGrotesk_700Bold      // Poids Bold 
} from '@expo-google-fonts/space-grotesk';
const CustomHero = ({title="",heroText=""}) => {

  const [fontsLoaded] = useFonts({
    'SpaceGrotesk-Regular': SpaceGrotesk_400Regular,
    'SpaceGrotesk-Bold': SpaceGrotesk_700Bold,
  });

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.heroText}>{ heroText }</Text>
      </View>
    </View>
  )
}

export const CustomHeroForProfile = () => {
  return <>
    <View style={styles.profileContainer}>
      <View style={styles.profile}>
        <Text style={styles.nickname}>BR</Text>
      </View>
      <Text style={styles.fullname}>bryan Ranaivo</Text>
      <Text style={styles.email}>harosonbryan@gmail.com</Text>
    </View>
  </>
}

export default CustomHero

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
  },
  profileContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop:10
  },
  title: {
    textAlign:'center',
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 36
  },
  heroText: {
    marginHorizontal:10,
    textAlign:'center',
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize:18
  },
  profile: {
    height: 150,
    width: 150,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#212121",
    borderRadius: 150,
    borderWidth: 5,
    borderColor: "#212121",
    elevation:20
  },
  nickname: {
    fontSize: 80, 
    color: "#FFFFFF",
    fontFamily: "SpaceGrotesk-Bold"
  },
  fullname: {
    fontFamily: "SpaceGrotesk-Bold",
    color: "#212121",
    fontSize:32
  },
  email: {
    fontFamily: "SpaceGrotesk-Regular",
    color: "#666666ff",
    fontSize:20
  }
})
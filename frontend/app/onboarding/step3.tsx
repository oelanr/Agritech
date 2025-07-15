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
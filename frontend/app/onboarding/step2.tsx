import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

const step2 = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Bienvenue dans AgriTech</Text>

        <Text style={styles.link}>
          Protégez vos récoltes en appliquant les traitements fournis
        </Text>

        <Image
          source={require("../../assets/images/agriculteur.jpg")}
          style={styles.image}
        />

        <Text style={styles.subtitle}>Traitements adéquat</Text>

        <Text style={styles.description}>
          Une aide approfondie grâce à notre modèle spécialisé dans les soins
          des cultures agricoles vous avantagera encore plus
        </Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.dots}>
          <View style={styles.dot} />
          <View style={styles.dotActive} />
          <View style={styles.dot} /> 
        </View>

        <TouchableOpacity >
          <Text style={styles.next} onPress={() => router.push('/onboarding/step3')}>Suivant </Text>
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
    width: '100%',
    height: 300,
    borderRadius: 20,
    marginBottom: 20,
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

export default step2;
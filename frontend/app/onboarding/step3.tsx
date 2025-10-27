import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

const Step3 = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* 🌿 Décorations */}
      <View style={styles.decorTopLeft} />
      <View style={styles.decorBottomRight} />

      <Animated.View
        style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
      >
        {/* ✅ Logo ISPM stylisé */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/ispm.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>Une équipe passionnée par l’agro-technologie</Text>

        <Text style={styles.subtitle}>
          Le projet <Text style={styles.highlight}>AgriTech</Text> est conçu par une équipe de chercheurs et
          développeurs de l’<Text style={styles.highlight}>ISPM</Text>.
        </Text>

        <View style={styles.teamCard}>
          <Image
            source={require('../../assets/images/hand.jpeg')}
            style={styles.teamImage}
            resizeMode="cover"
          />
        </View>

        <Text style={styles.description}>
          Ensemble, nous mettons la technologie au service de l’agriculture pour un avenir plus durable 🌱
        </Text>

        <TouchableOpacity style={styles.button} onPress={() => router.replace('../auth/login')}>
          <Text style={styles.buttonText}>Commencer →</Text>
        </TouchableOpacity>

        <View style={styles.dots}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dotActive} />
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  content: { alignItems: 'center', width: '100%' },

  // 🌿 Décorations visuelles
  decorTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 140,
    height: 140,
    borderBottomRightRadius: 140,
    backgroundColor: '#E0F2E2',
    opacity: 0.35,
  },
  decorBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 180,
    height: 180,
    borderTopLeftRadius: 180,
    backgroundColor: '#CDE8CF',
    opacity: 0.25,
  },

  // ✅ Logo avec fond et ombre douce
  logoContainer: {
    backgroundColor: '#E9F5EC',
    borderRadius: 80,
    padding: 20,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  logo: { width: 100, height: 100 },

  // 🌾 Carte équipe avec image arrondie
  teamCard: {
    width: '100%',
    height: 220,
    borderRadius: 25,
    overflow: 'hidden',
    backgroundColor: '#F1F8F3',
    marginVertical: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  teamImage: { width: '100%', height: '100%' },

  // Texte
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#212121',
    textAlign: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#4F4F4F',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  highlight: { color: '#2E7D32', fontWeight: '700' },
  description: {
    fontSize: 15,
    color: '#333',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
    paddingHorizontal: 20,
  },

  // Bouton
  button: {
    backgroundColor: '#2E7D32',
    borderRadius: 30,
    paddingHorizontal: 36,
    paddingVertical: 14,
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },

  // Dots
  dots: { flexDirection: 'row', gap: 8, marginTop: 25 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#D9D9D9' },
  dotActive: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#2E7D32' },
});

export default Step3;

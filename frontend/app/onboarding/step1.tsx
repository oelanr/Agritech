import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

const Step1 = () => {
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
      {/* --- Petites décorations de fond --- */}
      <View style={styles.decorTopLeft} />
      <View style={styles.decorBottomRight} />

      <Animated.View
        style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
      >
        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/images/riziere.png')}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        <Text style={styles.title}>
          Bienvenue dans <Text style={styles.highlight}>AgriTech</Text>
        </Text>
        <Text style={styles.subtitle}>
          Analysez facilement la santé de vos cultures grâce à l’intelligence artificielle.
        </Text>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/onboarding/step2')}>
          <Text style={styles.buttonText}>Suivant →</Text>
        </TouchableOpacity>

        <View style={styles.dots}>
          <View style={styles.dotActive} />
          <View style={styles.dot} />
          <View style={styles.dot} />
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

  // ✅ Image container avec radius + shadow
  imageContainer: {
    width: '100%',
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E9F5EC',
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 40,
  },
  image: {
    width: '90%',
    height: '90%',
    borderRadius: 25,
  },

  content: { alignItems: 'center', width: '100%' },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#212121',
    textAlign: 'center',
    marginBottom: 10,
  },
  highlight: { color: '#2E7D32' },
  subtitle: {
    fontSize: 16,
    color: '#4F4F4F',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
    paddingHorizontal: 20,
  },
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
  dots: { flexDirection: 'row', gap: 8, marginTop: 25 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#D9D9D9' },
  dotActive: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#2E7D32' },

  // 🌿 Décorations subtiles en arrière-plan
  decorTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 120,
    height: 120,
    borderBottomRightRadius: 120,
    backgroundColor: '#E0F2E2',
    opacity: 0.4,
  },
  decorBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 160,
    height: 160,
    borderTopLeftRadius: 160,
    backgroundColor: '#CDE8CF',
    opacity: 0.3,
  },
});

export default Step1;

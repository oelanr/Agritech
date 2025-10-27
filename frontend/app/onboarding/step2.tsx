import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

const Step2 = () => {
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
      {/* 🌿 Décorations vertes discrètes */}
      <View style={styles.decorTopRight} />
      <View style={styles.decorBottomLeft} />

      <Animated.View
        style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
      >
        {/* ✅ Image stylisée avec radius et ombre */}
        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/images/farmer.jpg')}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        <Text style={styles.title}>Identifiez les maladies du riz en un clic</Text>
        <Text style={styles.subtitle}>
          Prenez une photo ou décrivez vos symptômes, notre IA fait le reste !
        </Text>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/onboarding/step3')}>
          <Text style={styles.buttonText}>Suivant →</Text>
        </TouchableOpacity>

        <View style={styles.dots}>
          <View style={styles.dot} />
          <View style={styles.dotActive} />
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

  content: { alignItems: 'center', width: '100%' },

  // ✅ Image container stylisée
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

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#212121',
    textAlign: 'center',
    marginBottom: 10,
  },
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

  // 🌱 Petites décorations visuelles
  decorTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 130,
    height: 130,
    borderBottomLeftRadius: 130,
    backgroundColor: '#E0F2E2',
    opacity: 0.4,
  },
  decorBottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 160,
    height: 160,
    borderTopRightRadius: 160,
    backgroundColor: '#CDE8CF',
    opacity: 0.3,
  },
});

export default Step2;

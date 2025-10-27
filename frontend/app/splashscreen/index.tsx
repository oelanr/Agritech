import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Text, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';

const LogoScreen = () => {
  const router = useRouter();

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  const translateX = useRef(new Animated.Value(-50)).current; // départ gauche
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animation d'entrée : fade + translate Y + translate X
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 700,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: 0,
        duration: 700,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
    ]).start();

    // Animation “bounce” infinie pour la gerbe
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -5,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 5,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(500),
      ])
    ).start();

    // Timer pour sortie et navigation
    const timer = setTimeout(() => {
      // Animation de sortie : fade-out rapide
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        router.replace('/onboarding/step1');
      });
    }, 1500); // durée totale légèrement plus courte

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY }, { translateX }],
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Text style={styles.title}>Agritech</Text>
        <Animated.View style={{ transform: [{ translateY: bounceAnim }] }}>
          <FontAwesome5 name="seedling" size={28} color="#f0c040" style={styles.icon} />
        </Animated.View>
      </Animated.View>
    </View>
  );
};

export default LogoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff', // fond blanc
  },
  title: {
    fontSize: 42,
    color: '#212121',
    fontWeight: '700',
    textAlign: 'center',
  },
  icon: {
    marginLeft: 8,
  },
});

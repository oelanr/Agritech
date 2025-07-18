import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const LogoScreen = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/onboarding/step1");
    }, 2000); 

    return () => clearTimeout(timer); 
  }, [router]);

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/ispm.png')} style={styles.logo} />
    </View>
  );
};

export default LogoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',     
    backgroundColor: '#fff',  
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
});

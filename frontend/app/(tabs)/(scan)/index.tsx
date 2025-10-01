import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SymptomSelector() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>scan</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  text: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000',
  },
});

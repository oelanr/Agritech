import React from 'react'
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native'

const CustomAlert = ({ visible, onClose, missingFields }) => {
  if (!visible) return null

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.title}>Champs manquants !</Text>
          <Text style={styles.message}>
            Veuillez remplir tous les champs avant de continuer :
          </Text>
          {missingFields.map((f) => (
            <Text key={f} style={styles.field}>• {f}</Text>
          ))}
          <TouchableOpacity onPress={onClose} style={styles.button}>
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  box: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    width: '80%',
    elevation: 10
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12
  },
  message: {
    fontSize: 16,
    marginBottom: 12
  },
  field: {
    fontSize: 14,
    color: '#333'
  },
  button: {
    marginTop: 16,
    backgroundColor: '#212121',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  }
})

export default CustomAlert

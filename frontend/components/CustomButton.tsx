import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native";
import React from "react";

interface CustomButtonProps {
  title: string;
  handlePress: () => void;
  containerStyles?: object;
  textStyles?: object;
  isLoading?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({ 
  title, 
  handlePress, 
  containerStyles, 
  textStyles, 
  isLoading 
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={[styles.button, containerStyles, isLoading ? styles.buttonDisabled : {}]}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text style={[styles.text, textStyles]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 50,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    text: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    }
});

export default CustomButton;
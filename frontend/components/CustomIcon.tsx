import React from 'react';
import { Image, StyleProp, ImageStyle } from 'react-native';

type CustomIconProps = {
  name: 'home' | 'analyse' | 'chat' | 'historique' | 'profile';
  focused?: boolean; // <-- nouvelle prop pour gérer focus
  size?: number;
  style?: StyleProp<ImageStyle>;
};

const iconMap = {
  home: require('../assets/icons/home.png'),
  homeFocused: require('../assets/icons/home-active.png'),
  analyse: require('../assets/icons/stethoscope.png'),
  analyseFocused: require('../assets/icons/stethoscope-active.png'),
  chat: require('../assets/icons/chat-gpt.png'),
  chatFocused: require('../assets/icons/chat-gpt.png'),
  historique: require('../assets/icons/book-open.png'),
  historiqueFocused: require('../assets/icons/book-open-active.png'),
  profile: require('../assets/icons/user.png'),
  profileFocused: require('../assets/icons/user-active.png'),
};

const CustomIcon: React.FC<CustomIconProps> = ({ name, focused = false, size = 24, style }) => {
  // Sélection de l’icône selon le focus
  const key = focused ? `${name}Focused` : name;
  const source = iconMap[key as keyof typeof iconMap];

  if (!source) return null;

  return <Image source={source} style={[{ width: size, height: size }, style]} />;
};

export default CustomIcon;
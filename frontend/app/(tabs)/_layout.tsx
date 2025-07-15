
import React from 'react';
import { Tabs } from 'expo-router';
import {
  Platform,
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
} from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarStyle: {
          backgroundColor: '#261E1E',
          borderRadius: 50,
          marginHorizontal: 30,
          marginBottom: 45,
          position: 'absolute',
          height: 55,
          paddingBottom: 0,
          paddingTop: 0,
          justifyContent: 'center',
          elevation: 0, 
          shadowColor: 'transparent', 
          borderTopWidth: 0, 
        },
        
        tabBarLabelStyle: {
          fontSize: 13,
          lineHeight: 60,
          fontWeight: '500',
          textAlign: 'center',
        },
        tabBarItemStyle: {
          paddingHorizontal: 4,
          paddingVertical: 6,
          marginBottom: 0,
          borderRadius: 0,
        },
        tabBarActiveTintColor: '#546346',
        tabBarInactiveTintColor: 'white',
        tabBarActiveBackgroundColor: 'transparent', 
        headerShown: false,

        tabBarButton: (props) => {
          const { accessibilityState, children, style, ...rest } = props;
          const focused = accessibilityState?.selected;

          return (
            <TouchableOpacity
              {...rest}
              style={[
                style,
                {
                  borderBottomWidth: focused ? 4 : 0,
                  borderBottomColor: 'white',
                  paddingBottom: 2,
                },
              ]}
            >
              {children}
            </TouchableOpacity>
          );
        },
      })}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          tabBarLabel: () => null,
          tabBarIcon: () => (
            <Image
              source={require('../../assets/images/home-1.png')}
              style={{
                width: 45,
                height: 45,
                resizeMode: 'contain',
                marginTop: 7,
              }}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="(scan)"
        options={{
          tabBarLabel: () => null,
          tabBarIcon: () => (
            <Image
              source={require('../../assets/images/align-horizontal-bottom.png')}
              style={{
                width: 45,
                height: 45,
                resizeMode: 'contain',
                marginTop: 7,
              }}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="(y-bot)"
        options={{
          tabBarLabel: () => null,
          tabBarIcon: () => (
            <Image
              source={require('../../assets/images/wheat-awn-solid 1.png')}
              style={{
                width: 35,
                height: 35,
                resizeMode: 'contain',
                marginTop: 7,
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="(z-profil)"
        options={{
          tabBarLabel: () => null,
          tabBarIcon: () => (
            <Image
              source={require('../../assets/images/user-solid 1.png')}
              style={{
                width: 28,
                height: 28,
                resizeMode: 'contain',
                marginTop: 7,
              }}
            />
          ),
        }}
      />
    </Tabs>
  );
}

import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { TouchableOpacity } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
  
      screenOptions={({ route }) => ({
        tabBarStyle: {
          backgroundColor: '#546346',
          borderRadius: 50,
          marginHorizontal: 16,
          marginBottom: 70,
          position: 'absolute',
          height: 62,
          paddingBottom: 0,
          paddingTop: 0,
          justifyContent: 'center',
        },
    
        tabBarLabelStyle: {
          fontSize: 13,
          lineHeight: 44,
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
        tabBarActiveBackgroundColor: 'white',
    
        tabBarIconStyle: {
          display: 'none',
        },
        tabBarIcon: () => null,
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
                  borderWidth: focused ? 2 : 0,
                  borderColor: focused ? 'white' : 'transparent',
                  borderRadius: 25,
                 
                  
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
          title: 'Home',         
           tabBarIcon: () => null,
        }}
      />
      
      <Tabs.Screen
        name="(scan)"
        options={{
          title: 'Scan',
          tabBarIcon: () => null,
        
        }}
      />
      <Tabs.Screen 
        name="(soin)"
        options={{
          title: 'Soin',
          tabBarIcon: () => null,
        }}
        
      />
      <Tabs.Screen
        name="(z_ai)"
        options={{
          title: 'AI',
          tabBarIcon: () => null,


        }}
      />
      
    </Tabs>
  );
}
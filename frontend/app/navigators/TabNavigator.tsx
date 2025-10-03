import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/Home';
import { StyleSheet } from 'react-native';
import Analyse from '../screens/Analyse';
import Chat from '../screens/Chat';
import Historique from '../screens/Historique';
import Profil from '../screens/Profil';
import CustomIcon from '@/components/CustomIcon';
import CustomHeader from '@/components/CustomHeader';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
        <Tab.Navigator screenOptions={{
                headerShown: true,
                tabBarHideOnKeyboard: true,
                tabBarShowLabel: false,
                tabBarStyle:styles.tabBarStyle
            }}
        >
          
        <Tab.Screen
            name="Home"
            component={Home}
            options={{
                tabBarIcon: ({ focused, color, size }) => (
                    <CustomIcon
                        name="home"
                        focused={focused}  
                        size={35}
                        style={{ tintColor: '#212121' }} 
                    /> 
                ),
                header:({ navigation, route, options }) => (
                    <CustomHeader />
                ),
            }}
          />

          <Tab.Screen
            name="Analyse"
            component={Analyse}
            options={{
                tabBarIcon: ({ focused, color, size }) => (
                    <CustomIcon
                        name="analyse"
                        focused={focused}  
                        size={35}
                        style={{ tintColor: '#212121' }} 
                    /> 
                ),
                header:({ navigation, route, options }) => (
                    <CustomHeader />
                ),
            }}
          />

          <Tab.Screen
            name="Chat"
            component={Chat}
            options={{
                tabBarIcon: ({ focused, color, size }) => (
                    <CustomIcon
                        name="chat"
                        focused={focused}  
                        size={35}
                        style={{ tintColor: '#212121' }} 
                    /> 
                ),
                header:({ navigation, route, options }) => (
                    <CustomHeader />
                ),
            }}
          />

          <Tab.Screen
            name="Historique"
            component={Historique}
            options={{
                tabBarIcon: ({ focused, color, size }) => (
                    <CustomIcon
                        name="historique"
                        focused={focused}  
                        size={35}
                        style={{ tintColor: '#212121' }} 
                    /> 
                ),
                header:({ navigation, route, options }) => (
                    <CustomHeader />
                ),
            }}
          />

          <Tab.Screen
            name="Profil"
            component={Profil}
            options={{
                tabBarIcon: ({ focused, color, size }) => (
                    <CustomIcon
                        name="profile"
                        focused={focused}  
                        size={35}
                        style={{ tintColor: '#212121' }} 
                    /> 
                ),
                header:({ navigation, route, options }) => (
                    <CustomHeader />
                ),
            }}
          />
      
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
    tabBarStyle: {
        height: 70, 
        position: 'absolute',
        backgroundColor: "#FFFFFF",
        borderTopWidth: 0,
        borderRadius: 50,
        marginHorizontal: 15, 
        marginBottom:10,
        bottom: 20, 
        flexDirection: 'row',
        justifyContent: 'space-evenly', 
        alignItems: 'center',           
        elevation: 3,
        borderTopColor: 'transparent',
        overflow: 'hidden', 
    },
});
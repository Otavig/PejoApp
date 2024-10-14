import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { AppRegistry } from 'react-native';


import LoginScreen from './src/LoginScreen';
import RegisterScreen from './src/RegisterScreen';
import HomeScreen from './src/HomeScreen';
import ChallengeScreen from './src/ChallengeScreen';
import RecoveryScreen from './src/RecoveryScreen';
import ProfileScreen from './src/ProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      const savedUser = await AsyncStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    };

    checkUser();
  }, []);

  const handleLogout = async (navigation) => {
    await AsyncStorage.removeItem('user');
    setUser(null);
    navigation.navigate('Login');
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!user ? (
          <>
            <Stack.Screen
              name="Login"
              options={{ headerShown: false }}
            >
              {(props) => <LoginScreen {...props} setUser={setUser} />}
            </Stack.Screen>
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Recovery"
              component={RecoveryScreen}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="main" options={{ headerShown: false }}>
              {({ navigation }) => (
                <Tab.Navigator
                  screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                      let iconName;

                      if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                      } else if (route.name === 'Desafios') {
                        iconName = focused ? 'footsteps' : 'footsteps-outline';
                      } else if (route.name === 'Perfil') {
                        iconName = focused ? 'person' : 'person-outline';
                      }

                      return <Ionicons name={iconName} size={size} color={color} />;
                    },
                    tabBarLabelStyle: { fontSize: 12, marginBottom: 5, opacity: 0 },
                    tabBarShowLabel: false,
                    tabBarActiveTintColor: '#0088CC',
                    tabBarInactiveTintColor: 'gray',
                    tabBarStyle: {
                      borderTopWidth: 0,
                      position: 'absolute',
                      bottom: 20, // Define a barra 20px acima do final da tela
                      height: 60,
                      borderRadius: 200,
                      width: '90%',
                      elevation: 10,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.3,
                      shadowRadius: 4,
                      left: '5%', // Centraliza a barra horizontalmente
                      right: '5%'
                    },
                  })}
                >
                  <Tab.Screen
                    name="Home"
                    options={{ headerShown: false, tabBarLabel: 'Home' }}
                  >
                    {(props) => <HomeScreen {...props} setUser={setUser} user={user} />}
                  </Tab.Screen>
                  <Tab.Screen
                    name="Desafios"
                    component={ChallengeScreen}
                    options={{ headerShown: false, tabBarLabel: 'Desafios' }}
                  />
                  <Tab.Screen
                    name="Perfil"
                    component={ProfileScreen}
                    options={{ headerShown: false, tabBarLabel: 'Perfil' }}
                    initialParams={{ handleLogout }}
                  />
                </Tab.Navigator>
              )}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

AppRegistry.registerComponent('main', () => App); // Adicione isso se não estiver presente

export default App;

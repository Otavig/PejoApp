import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen from './src/LoginScreen';
import RegisterScreen from './src/RegisterScreen';
import HomeScreen from './src/HomeScreen';
import ChallengeScreen from './src/ChallengeScreen';
import RecoveryScreen from './src/RecoveryScreen';
import ProfileScreen from './src/ProfileScreen';
import ChosenScreen from './src/ChosenScreen';

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
    navigation.navigate('Chosen'); // Navega para a tela ChosenScreen
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!user ? (
          <>
            <Stack.Screen
              name="Chosen"
              component={ChosenScreen}
              options={{ headerShown: false }}
            />
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
            <Stack.Screen name="Main" options={{ headerShown: false }}>
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
                  })}
                  tabBarOptions={{
                    activeTintColor: '#0088CC',
                    inactiveTintColor: 'gray',
                    style: {
                      borderTopWidth: 0,
                      height: 65,
                      backgroundColor: '#ffffff',
                      elevation: 10,
                    },
                  }}
                >
                  <Tab.Screen
                    name="Home"
                    options={{ headerShown: false, tabBarLabel: 'Home' }}
                  >
                    {(props) => <HomeScreen {...props} setUser={setUser} />}
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

export default App;

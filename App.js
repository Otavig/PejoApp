import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import ChallengeScreen from './src/screens/ChallengeScreen';
import RecoveryScreen from './src/screens/RecoveryScreen';
import ProfileScreen from './src/screens/ProfileScreen';

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
    // Navega para a tela de Login
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
            <Stack.Screen name="Main" options={{ headerShown: false }}>
              {({ navigation }) => ( // Passa navigation como propriedade
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
                    tabBarLabelStyle: { fontSize: 12, marginBottom: 5, opacity: 0 }, // Oculta inicialmente o texto
                    tabBarShowLabel: false, // Esconde os rótulos por padrão
                  })}
                  tabBarOptions={{
                    activeTintColor: '#0088CC',
                    inactiveTintColor: 'gray',
                    style: {
                      borderTopWidth: 0, // Remove a linha de separação entre a barra de navegação e a tela
                      height: 65, // Aumenta a altura da barra de navegação inferior
                      backgroundColor: '#ffffff', // Cor de fundo da barra de navegação
                      elevation: 10, // Sombra para uma aparência elevada
                    },
                  }}
                >
                  <Tab.Screen 
                    name="Home" 
                    options={{ headerShown: false, tabBarLabel: 'Home' }} // Define o rótulo a ser mostrado
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
                    initialParams={{ handleLogout }} // Passa a função handleLogout como parâmetro inicial
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

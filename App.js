import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { View } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import { AuthScreen, CadastroScreen, RecuperarScreen } from './src/screens/AuthScreen';

const Stack = createNativeStackNavigator();

export default function MyStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Auth'>
        <Stack.Screen name="Auth" component={AuthScreen} options={{headerShown: false}} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Cadastro" component={CadastroScreen} />
        <Stack.Screen name="RecuperarSenha" component={RecuperarScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './src/screens/HomeScreen';
// import { View } from 'react-native-web';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import EventsScreen from './src/screens/EventsScreen'; 
import ProfileScreen from './src/screens/ProfileScreen';
import ChatScreen from './src/screens/subScreen/ChatScreen'; 
import ConversationScreen from './src/screens/subScreen/ConversationScreen'; 
import ListChallenge from './src/screens/subScreen/ListChallenges';
import EventDetailsScreen from './src/screens/subScreen/EventDetailsScreen';
import EditProfile from './src/screens/subScreen/EditProfile'
import EventList from './src/screens/subScreen/EventList'
import ContractScreen from './src/screens/subScreen/ContractScreen'
import LoginScreen from './src/screens/LoginScreen'; // Importando a tela de login
// import RegisterScreen from './src/screens/RegisterScreen'; // Importando a tela de registro
// import ForgotScreen from './src/screens/ForgotScreen'; // Adicionando a tela de esqueci a senha

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { 
          height: 60,
        },
        tabBarActiveTintColor: '#3641bf', // Cor para o ícone ativo
        tabBarInactiveTintColor: '#8E8E93', // Cor para o ícone inativo
        headerShown: false, // Esconde cabeçalho
    }}
  >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ 
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size * 1.1} color={color} />
          )
        }} 
      />
      <Tab.Screen 
        name="Perfil" 
        component={ProfileScreen} 
        options={{ 
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" size={size * 1.1} color={color} />
          )
        }} 
      />
      <Tab.Screen 
        name="Eventos" 
        component={EventsScreen} 
        options={{ 
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size * 1.1} color={color} />
          )
        }} 
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Login" // Adicionando a tela de login
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
        {/* <Stack.Screen 
          name="Register" 
          component={RegisterScreen} 
          options={{ title: 'Registrar', headerShown: false }} // Removendo o cabeçalho
        /> */}
        <Stack.Screen 
          name="HomeScreen" 
          component={TabNavigator} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="ChatScreen" 
          component={ChatScreen} 
          options={{ title: "Chat's" }} 
        />
        <Stack.Screen 
          name="ConversationScreen" // Adicionando a tela de conversa
          component={ConversationScreen} 
          options={{ title: 'Conversa' }} 
        />
        <Stack.Screen 
          name="EditProfile" // Adicionando a tela de edição
          component={EditProfile} 
          options={{ title: 'Editando perfil' }} 
        />
        <Stack.Screen 
          name="ListChallenges" // Adicionando a tela de listagem de desafios
          component={ListChallenge} 
          options={{ title: 'Listagem Desafios' }} 
        />
        <Stack.Screen 
          name="EventDetailsScreen" // Adicionando a tela de detalhes do evento
          component={EventDetailsScreen} 
          options={{ title: 'Detalhes do Evento' }} 
        />
        <Stack.Screen 
          name="EventList" // Adicionando a tela de conversa
          component={EventList} 
          options={{ title: 'Eventos anteriores' }} 
        />
        <Stack.Screen 
          name="ContractScreen" // Adicionando a tela de conversa
          component={ContractScreen} 
          options={{ title: 'Contrate um serviço' }} 
        />
        {/* <Stack.Screen 
          name="ForgotPassword" // Adicionando a tela de esqueci a senha
          component={ForgotScreen} 
          options={{ title: 'Esqueci a Senha', headerShown: false }} 
        /> */}
        <Stack.Screen 
          name="ProfileScreen" 
          component={ProfileScreen} 
          options={{ 
            title: 'Perfil', 
            headerShown: false 
          }} 
        />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
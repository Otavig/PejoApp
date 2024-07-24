import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const ChosenScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image 
        style={styles.topImage} 
        source={require('../../assets/imgs/initial.gif')} 
      />
      <View style={styles.card}>
        <Text style={styles.title}>PejoAPP</Text>
        <Text style={[styles.description, {marginBottom: 70}]}>Escolha uma opção para continuar:</Text>

        <TouchableOpacity style={[styles.linkButton, {marginTop: 10}]} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.linkText}>Crie sua conta simples e rápido</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.linkButton]} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.linkText}>Se não, clique aqui para entrar!</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChosenScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0088CC',
    position: 'relative',
  },
  card: {
    width: '100%',
    height: '50%',
    padding: 20,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center',
    position: 'absolute', 
    bottom: 0,  
  },
  topImage:{
    height: 500,
    width: 500,  
    position: 'absolute',
    top: 0,     
    alignSelf: 'center', 
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#023047',
    marginBottom: 20,
    marginTop: 50,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 25,
    textAlign: 'center',
  },
  linkButton: {
    margin: 10,
  },
  linkText: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
  }
});

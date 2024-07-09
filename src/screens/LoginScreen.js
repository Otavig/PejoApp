import React, { useState, useEffect } from 'react';
import { View, Image, TextInput, StyleSheet, Alert, Text, TouchableOpacity, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dimensions } from 'react-native';

const largura = Dimensions.get('screen').width;

const LoginScreen = ({ navigation, setUser }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isFocused, setIsFocused] = useState({
    identifier: false,
    password: false,
  });

  const handleFocus = (input) => {
    setIsFocused({ ...isFocused, [input]: true });
  };

  const handleBlur = (input) => {
    setIsFocused({ ...isFocused, [input]: false });
  };

  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, []);

  const renderAnimatedInput = (inputName, placeholder, value, onChangeText, secureTextEntry = false) => {
    const animatedLabel = new Animated.Value(isFocused[inputName] || value ? 1 : 0);
    const animatedBorderColor = new Animated.Value(isFocused[inputName] ? 1 : 0);

    if (isFocused[inputName]) {
      Animated.timing(animatedLabel, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
      Animated.timing(animatedBorderColor, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(animatedLabel, {
        toValue: value ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
      Animated.timing(animatedBorderColor, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }

    const labelStyle = {
      position: 'absolute',
      left: 15,
      top: animatedLabel.interpolate({
        inputRange: [0, 1],
        outputRange: [18, 3],
      }),
      fontSize: animatedLabel.interpolate({
        inputRange: [0, 1],
        outputRange: [14, 12],
      }),
      color: animatedLabel.interpolate({
        inputRange: [0, 1],
        outputRange: ['#aaa', '#0088CC'],
      }),
      opacity: animatedLabel.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0.9],
      }),
    };

    const borderColor = animatedBorderColor.interpolate({
      inputRange: [0, 1],
      outputRange: ['#ccc', '#0088CC'],
    });

    return (
      <View style={styles.inputContainer}>

        <Animated.Text style={labelStyle}>{placeholder}</Animated.Text>
        <Animated.View style={{ ...styles.inputWrapper, borderColor }}>
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={secureTextEntry}
            onFocus={() => handleFocus(inputName)}
            onBlur={() => handleBlur(inputName)}
          />
        </Animated.View>
      </View>
    );
  };

  const handleLogin = async () => {
    try {
      const response = await fetch('http://192.168.56.1:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      await AsyncStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user); // Certifique-se de que `setUser` está sendo chamado corretamente
      navigation.navigate('Home'); // Navegue para a tela Home ou Main
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login Failed', 'Invalid credentials');
    }
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.title}>Bem-vindo</Text>
      <Text style={styles.description}>Faça login para continuar</Text>
      {renderAnimatedInput('identifier', 'Email, Nome ou Telefone', identifier, setIdentifier)}
      {renderAnimatedInput('password', 'Senha', password, setPassword, true)}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('Register')}>
        <Text style={styles.linkText}>Não tem uma conta? Faça cadastro</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#023047',
    marginBottom: 20,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 25,
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  inputWrapper: {
    borderWidth: 1,
    borderRadius: 4,
    width: '100%',
  },
  input: {
    width: '100%',
    padding: 15,
    fontSize: 14,
  },
  button: {
    backgroundColor: '#0088CC',
    padding: 15,
    borderRadius: 4,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFFDFF',
    fontSize: 14,
    fontWeight: '600',
  },
  linkButton: {
    alignItems: 'center',
  },
  linkText: {
    color: '#555',
    fontSize: 13,
    transition: 'color linear 160ms',
  },
});

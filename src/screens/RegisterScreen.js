import React, { useState } from 'react';
import { View, Image, TextInput, StyleSheet, Alert, Text, TouchableOpacity, Dimensions, Animated } from 'react-native';

const largura = Dimensions.get('screen').width;

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const [isFocused, setIsFocused] = useState({
    name: false,
    email: false,
    phone: false,
    password: false,
  });

  const handleFocus = (input) => {
    setIsFocused({ ...isFocused, [input]: true });
  };

  const handleBlur = (input) => {
    setIsFocused({ ...isFocused, [input]: false });
  };

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

  const handleRegister = async () => {
    try {
      if (name && email && phone && password) {
        // Validar telefone
        const phoneRegex = /^[0-9]{10,12}$/; // Telefone com 10 a 12 dígitos
        if (!phoneRegex.test(phone)) {
          throw new Error('Número de telefone invalido');
        }

        // Limitar tamanho do nome (máximo de 50 caracteres)
        if (name.length > 50) {
          throw new Error('Nome passou do limite de 50 caracteres');
        }

        // Limitar tamanho da senha (mínimo de 6 caracteres)
        if (password.length < 6) {
          throw new Error('Senha precisa de mais do que 6 Caracteres');
        }

        const formData = {
          user_name: name,
          user_email: email,
          phone,
          user_password: password,
        };

        const response = await fetch('http://10.111.9.12:3006/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        navigation.replace('Login');
      } else {
        throw new Error('All fields are required');
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Registro falhou', `Error: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, {marginBottom: 30}]}>Cadastro</Text>
      {renderAnimatedInput('name', 'Nome', name, setName)}
      {renderAnimatedInput('email', 'Email', email, setEmail)}
      {renderAnimatedInput('phone', 'Telefone', phone, setPhone)}
      {renderAnimatedInput('password', 'Senha', password, setPassword, true)}
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Cadastrar-se</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('Login')}>
        <Text style={[styles.linkText, {marginBottom: 20}]}>Já possui uma conta?</Text>
      </TouchableOpacity>

      <View style={styles.separatorContainer}>
        <Text style={styles.separatorText}>OU</Text>
      </View>
        <View style={styles.separator} />

      <View style={styles.socialButtonsContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <Image style={styles.socialIcon} source={require('../../assets/imgs/options/google.png')} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Image style={styles.socialIcon} source={require('../../assets/imgs/options/facebook.png')} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RegisterScreen;

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
  inputContainer: {
    width: '80%',
    marginBottom: 20,
  },
  inputWrapper: {
    borderWidth: 1,
    borderRadius: 4,
  },
  input: {
    width: '100%',
    padding: 15,
    fontSize: 13,
  },
  button: {
    backgroundColor: '#0088CC',
    padding: 15,
    borderRadius: 4,
    width: '80%',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  linkButton: {
    alignItems: 'center',
  },
  linkText: {
    color: '#555',
    fontSize: 13,
  },linksContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '75%',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  linkButton: {
    marginTop: 10,
  },
  linkText: {
    color: 'black',
    fontSize: 12,
  },
  separatorContainer: {
    alignItems: 'center',
  },
  separatorText: {
    fontSize: 14,
    color: '#666',
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    width: '80%',
    marginVertical: 20,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '80%',
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    marginHorizontal: 10,
  },
  socialIcon: {
    width: 30,
    height: 30,
  },
});

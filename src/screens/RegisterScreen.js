import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Alert, Text, TouchableOpacity, Dimensions, Animated } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const largura = Dimensions.get('screen').width;

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const [isFocused, setIsFocused] = useState({
    name: false,
    email: false,
    dob: false,
    phone: false,
    password: false,
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());

  const handleFocus = (input) => {
    setIsFocused({ ...isFocused, [input]: true });
  };

  const handleBlur = (input) => {
    setIsFocused({ ...isFocused, [input]: false });
  };

  const handleDateConfirm = (selectedDate) => {
    setShowDatePicker(false);
    setDate(selectedDate);
    const formattedDate = selectedDate.toISOString().split('T')[0];
    setDob(formattedDate);
  };

  const handleDateCancel = () => {
    setShowDatePicker(false);
  };

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
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
      if (name && email && dob && phone && password) {
        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          throw new Error('Invalid email address');
        }

        // Validar telefone
        const phoneRegex = /^[0-9]{10,12}$/; // Telefone com 10 a 12 dígitos
        if (!phoneRegex.test(phone)) {
          throw new Error('Invalid phone number');
        }

        // Limitar tamanho do nome (máximo de 50 caracteres)
        if (name.length > 50) {
          throw new Error('Name exceeds maximum length of 50 characters');
        }

        // Limitar tamanho da senha (mínimo de 6 caracteres)
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters long');
        }

        const age = calculateAge(dob);
        if (age < 16) {
          throw new Error('You must be at least 16 years old to register.');
        }

        const response = await fetch('http://192.168.56.1:3000/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, dob, phone, password }),
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
      Alert.alert('Registration Failed', `Error: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>
      {renderAnimatedInput('name', 'Nome', name, setName)}
      {renderAnimatedInput('email', 'Email', email, setEmail)}
      <TouchableOpacity style={styles.inputContainer} onPress={() => setShowDatePicker(true)}>
        <Animated.Text style={{
          position: 'absolute',
          left: 15,
          top: isFocused.dob || dob ? 6 : 18, // Ajuste a posição vertical aqui
          fontSize: isFocused.dob || dob ? 12 : 14,
          color: isFocused.dob || dob ? '#0088CC' : '#aaa', // Mantendo a cor original do texto animado
        }}>
          Data de Nascimento
        </Animated.Text>
        <View style={{ ...styles.inputWrapper, borderColor: isFocused.dob ? '#0088CC' : '#ccc' }}>
          <TextInput
            style={{...styles.input, color: '#000'}} // Define a cor do texto dentro do campo para preto
            value={dob}
            editable={false}
            onFocus={() => handleFocus('dob')}
            onBlur={() => handleBlur('dob')}
          />
        </View>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={showDatePicker}
        mode="date"
        display="spinner"
        date={date}
        onConfirm={handleDateConfirm}
        onCancel={handleDateCancel}
      />
      {renderAnimatedInput('phone', 'Telefone', phone, setPhone)}
      {renderAnimatedInput('password', 'Senha', password, setPassword, true)}
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Cadastrar-se</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.linkText}>Já possui uma conta? Faça login</Text>
      </TouchableOpacity>
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
  },
});

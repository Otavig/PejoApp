import React, { useState, useEffect } from 'react';
import { View, Image, TextInput, StyleSheet, Alert, Text, TouchableOpacity, Animated, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { Dimensions } from 'react-native';

const largura = Dimensions.get('screen').width;

const LoginScreen = ({ navigation, setUser }) => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isFocused, setIsFocused] = useState({
        identifier: false,
        password: false,
    });

    const [fadeAnim] = useState(new Animated.Value(0));

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
        }).start();
    }, []);

    const handleFocus = (input) => {
        setIsFocused({ ...isFocused, [input]: true });
    };

    const handleBlur = (input) => {
        setIsFocused({ ...isFocused, [input]: false });
    };

    const renderAnimatedInput = (inputName, placeholder, value, onChangeText, secureTextEntry = false) => {
        const animatedBorderColor = new Animated.Value(isFocused[inputName] ? 1 : 0);

        Animated.timing(animatedBorderColor, {
            toValue: isFocused[inputName] ? 1 : 0,
            duration: 200,
            useNativeDriver: false,
        }).start();

        const borderColor = animatedBorderColor.interpolate({
            inputRange: [0, 1],
            outputRange: ['#ccc', '#0088CC'],
        });

        return (
            <View style={styles.inputContainer}>
                <Animated.View style={[styles.inputWrapper, { borderColor }]}>
                    <TextInput
                        style={styles.input}
                        value={value}
                        onChangeText={onChangeText}
                        secureTextEntry={secureTextEntry}
                        onFocus={() => handleFocus(inputName)}
                        onBlur={() => handleBlur(inputName)}
                        placeholder={placeholder}
                        placeholderTextColor="#aaa"
                    />
                    {inputName === 'password' && (
                        <TouchableOpacity
                            style={styles.eyeIcon}
                            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                        >
                            <Ionicons
                                name={isPasswordVisible ? 'eye-outline' : 'eye-off-outline'}
                                size={20}
                                color="#aaa"
                            />
                        </TouchableOpacity>
                    )}
                </Animated.View>
            </View>
        );
    };

    const isValidEmailOrPhone = (identifier) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{10,15}$/;
        return emailRegex.test(identifier) || phoneRegex.test(identifier);
    };

    const handleLogin = async () => {
        if (!isValidEmailOrPhone(identifier)) {
            Alert.alert('Login Falhou', 'Por favor, insira um email ou telefone válido');
            return;
        }

        try {
            console.log('Enviando requisição de login:', { identifier, password });
            const response = await fetch('http://10.111.9.44:3006/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ identifier, password }),
            });

            const data = await response.json();
            console.log('Resposta do servidor:', data);

            if (!response.ok) {
                throw new Error(data.error || 'Credenciais inválidas');
            }

            // Check if the user's role is "user" or "adm"
            if (data.user.cargo === 'user' || data.user.cargo === 'adm') {
                await AsyncStorage.setItem('user', JSON.stringify(data.user));
                setUser(data.user);
                navigation.navigate('Home');
            } else if (data.user.cargo === 'pendente') {
                Alert.alert(
                    'Conta não confirmada',
                    'Por favor, confirme seu email antes de fazer login.',
                    [
                        { text: 'OK' },
                        { text: 'Reenviar confirmação', onPress: () => navigation.navigate('ResendConfirmation', { email: data.user.email }) }
                    ]
                );
            } else {
                Alert.alert('Acesso Negado', 'Você não tem permissão para acessar o aplicativo. Por favor, entre em contato com o suporte.');
            }
        } catch (error) {
            console.error('Erro no login:', error);
            if (error.message === 'Credenciais inválidas') {
                Alert.alert(
                    'Login Falhou',
                    'Credenciais inválidas. Você gostaria de se cadastrar?',
                    [
                        { text: 'Não' },
                        { text: 'Sim', onPress: () => navigation.navigate('Register') }
                    ]
                );
            } else {
                Alert.alert('Erro', 'Ocorreu um erro ao tentar fazer login. Por favor, tente novamente mais tarde.');
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Animated.View style={{ flex: 1, opacity: fadeAnim, justifyContent: 'center', alignItems: 'center' }}>
                <Image style={styles.logo} source={require('../assets/imgs/icon.png')} />
                <Text style={styles.title}>Bem-vindo(a)</Text>
                <Text style={styles.description}>Faça login para continuar</Text>
                {renderAnimatedInput('identifier', 'Email ou Telefone', identifier, setIdentifier)}
                {renderAnimatedInput('password', 'Senha', password, setPassword, !isPasswordVisible)}
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Entrar</Text>
                </TouchableOpacity>

                <View style={styles.linksContainer}>
                    <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('Register')}>
                        <Text style={styles.linkText}>Não tem uma conta?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.linkButton, { marginLeft: 10 }]} onPress={() => navigation.navigate('Recovery')}>
                        <Text style={styles.linkText}>Recuperar senha</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        padding: 25, // Increased padding
    },
    title: {
        fontSize: 36, // Increased font size
        fontWeight: 'bold',
        color: '#023047',
        marginBottom: 15, // Increased margin
    },
    description: {
        fontSize: 16, // Increased font size
        color: '#666',
        marginBottom: 30, // Increased margin
    },
    inputContainer: {
        width: '90%', // Increased width
        marginBottom: 25, // Increased margin
    },
    logo: {
        width: 130, // Increased size
        height: 130, // Increased size
        marginBottom: 15, // Increased margin
        resizeMode: 'contain',
    },
    inputWrapper: {
        borderWidth: 1,
    },
    input: {
        width: '100%',
        padding: 18, // Increased padding
        fontSize: 15, // Increased font size
    },
    eyeIcon: {
        position: 'absolute',
        right: 18,
        top: 20,
    },
    button: {
        backgroundColor: '#0088CC',
        width: '90%', // Increased width
        paddingVertical: 12, // Increased padding
        alignItems: 'center',
        marginTop: 13, // Increased margin
    },
    buttonText: {
        color: '#FFF',
        fontSize: 20, // Increased font size
        fontWeight: 'bold',
    },
    linksContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '88%', // Increased width
        justifyContent: 'space-between',
    },
    linkButton: {
        marginTop: 15, // Increased margin
    },
    linkText: {
        color: 'black',
        fontSize: 14, // Increased font size
    },
});

export default LoginScreen;

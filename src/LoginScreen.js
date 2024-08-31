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
        const animatedLabel = new Animated.Value(isFocused[inputName] || value ? 1 : 0);
        const animatedBorderColor = new Animated.Value(isFocused[inputName] ? 1 : 0);

        Animated.timing(animatedLabel, {
            toValue: isFocused[inputName] || value ? 1 : 0,
            duration: 200,
            useNativeDriver: false,
        }).start();

        Animated.timing(animatedBorderColor, {
            toValue: isFocused[inputName] ? 1 : 0,
            duration: 200,
            useNativeDriver: false,
        }).start();

        const labelStyle = {
            position: 'absolute',
            left: 10,
            top: animatedLabel.interpolate({
                inputRange: [0, 1],
                outputRange: [15, 3],
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
                <Animated.View style={[styles.inputWrapper, { borderColor }]}>
                    <TextInput
                        style={styles.input}
                        value={value}
                        onChangeText={onChangeText}
                        secureTextEntry={secureTextEntry}
                        onFocus={() => handleFocus(inputName)}
                        onBlur={() => handleBlur(inputName)}
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
            const response = await fetch('http://10.111.9.24:3006/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ identifier, password }),
            });

            if (!response.ok) {
                throw new Error('Credenciais inválidas');
            }

            const data = await response.json();
            await AsyncStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
            navigation.navigate('Home'); // Navegue para a tela Home ou Main
        } catch (error) {
            console.error('Erro no login:', error);
            Alert.alert('Login Falhou', 'Credenciais inválidas');
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

                <View style={styles.separatorContainer}>
                </View>
                <View style={styles.separator} />

                <View style={styles.socialButtonsContainer}>
                    <TouchableOpacity style={styles.socialButton}>
                        <Image style={styles.socialIcon} source={require('../assets/imgs/options/google.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialButton}>
                        <Image style={styles.socialIcon} source={require('../assets/imgs/options/facebook.png')} />
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
        padding: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#023047',
        marginBottom: 10,
    },
    description: {
        fontSize: 14,
        color: '#666',
        marginBottom: 25,
    },
    inputContainer: {
        width: '80%',
        marginBottom: 20,
        position: 'relative',
    },
    logo: {
        width: 80,
        height: 80,
        marginBottom: 10,
        resizeMode: 'contain',
    },
    inputWrapper: {
        borderWidth: 1,
        borderRadius: 4,
    },
    input: {
        width: '100%',
        padding: 10,
        fontSize: 13,
    },
    eyeIcon: {
        position: 'absolute',
        right: 15,
        top: 15,
    },
    button: {
        backgroundColor: '#0088CC',
        borderRadius: 8,
        width: '80%',
        paddingVertical: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    linksContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '75%',
        justifyContent: 'space-between',
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
        marginBottom: 15,
        marginTop: 15,
    },
    separatorText: {
        fontSize: 14,
        color: '#666',
    },
    separator: {
        height: 1,
        backgroundColor: '#ccc',
        width: '80%',
    },
    socialButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '80%',
    },
    socialButton: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#ccc',
        marginHorizontal: 10,
        marginTop: 20,
    },
    socialIcon: {
        width: 30,
        height: 30,
    },
});

export default LoginScreen;

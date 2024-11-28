import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Função para verificar se o valor digitado é um telefone ou e-mail
    const handleInputChange = (inputValue) => {
        setEmail(inputValue); // Atualiza o estado com o valor digitado (sem formatação)
    };

    const handleLogin = async () => {
        if (!email || !password) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        try {
            const response = await axios.post('http://10.111.9.44:3000/login', {
                identificador: email,
                senha: password
            });

            if (response.status === 200) {
                const { tipo_usuario, nome, id } = response.data.usuario || {};
                console.log('Nome do usuário:', nome);

                if (tipo_usuario === 'confirmação') {
                    alert('Por favor, confirme seu e-mail antes de acessar o aplicativo.');
                    return;
                }

                const userToken = Math.random().toString(36).substring(2);
                await AsyncStorage.setItem('userToken', userToken);
                await AsyncStorage.setItem('userEmail', email);
                await AsyncStorage.setItem('userName', nome);
                await AsyncStorage.setItem('userId', id.toString());
                navigation.navigate('HomeScreen', { userName: nome });
            }
        } catch (error) {
            console.error('Erro no login:', error);
            alert(error.response?.data?.erro || 'Erro no login. Verifique suas credenciais.');
        }
    };

    const checkLoginStatus = async () => {
        const userToken = await AsyncStorage.getItem('userToken');
        if (userToken) {
            navigation.navigate('HomeScreen');
        }
    };

    useEffect(() => {
        checkLoginStatus();
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.loginSection}>
                <Image style={styles.logo} source={require('../assets/PEJOTITLE.png')} />
                <TextInput
                    style={styles.input}
                    placeholder="Email ou Telefone"
                    placeholderTextColor="#888"
                    value={email}
                    onChangeText={handleInputChange}
                />
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Senha"
                        placeholderTextColor="#888"
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={setPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                        <Icon name={showPassword ? 'eye' : 'eye-slash'} size={20} color="#3498db" />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    <Text style={styles.loginButtonText}>Acessar</Text>
                </TouchableOpacity>
                <View style={styles.footer}>
                    <View style={styles.footerButtonsContainer}>
                        <TouchableOpacity
                            style={styles.createAccountButton}
                            onPress={() => navigation.navigate('Register')}
                        >
                            <Text style={styles.createAccountText}>Não tem uma conta?</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.forgotPasswordButton}
                            onPress={() => navigation.navigate('ForgotPassword')}
                        >
                            <Text style={styles.forgotPasswordText}>Esqueci a Senha!</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    scrollViewContent: {
        flexGrow: 1,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        paddingHorizontal: 30,
        paddingBottom: 30,
    },
    logo: {
        height: height * 0.25,
        width: width * 0.5,
        marginBottom: 20,
    },
    loginSection: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        backgroundColor: '#fafafa',
        borderColor: '#ddd',
        borderWidth: 1,
        width: '100%',
        borderRadius: 5,
        paddingVertical: height * 0.014,
        paddingHorizontal: width * 0.05,
        fontSize: width * 0.04,
        marginBottom: 15,
        color: '#333',
    },
    passwordContainer: {
        position: 'relative',
        width: '100%',
    },
    eyeIcon: {
        position: 'absolute',
        right: 20,
        top: '35%',
        transform: [{ translateY: -10 }],
    },
    loginButton: {
        backgroundColor: '#3897f0',
        borderRadius: 10,
        paddingVertical: height * 0.015,
        width: '100%',
        alignItems: 'center',
        marginVertical: height * 0.015,
        shadowColor: '#3897f0',
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 4,
    },
    loginButtonText: {
        color: '#ffffff',
        fontSize: width * 0.050,
        fontWeight: 'bold',
    },
    footerButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginTop: 20,
    },
    createAccountButton: {
        paddingHorizontal: 10,
    },
    createAccountText: {
        color: '#0277BD',
        fontSize: width * 0.04,
    },
    forgotPasswordButton: {
        paddingHorizontal: 10,
    },
    forgotPasswordText: {
        color: '#0277BD',
        fontSize: width * 0.04,
    },    
});

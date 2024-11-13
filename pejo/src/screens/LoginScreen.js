import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function LoginScreen() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        try {
            const response = await axios.post('http://10.111.9.61:3000/login', {
                identificador: email,
                senha: password
            });

            if (response.status === 200) {
                const { tipo_usuario, nome } = response.data.usuario || {};
                console.log('Nome do usuário:', nome);

                if (tipo_usuario === 'confirmação') {
                    alert('Por favor, confirme seu e-mail antes de acessar o aplicativo.');
                    return;
                }

                // Armazenando o token de usuário, o email e o nome
                const userToken = Math.random().toString(36).substring(2); // Gera um token aleatório
                await AsyncStorage.setItem('userToken', userToken); // Armazena o token
                await AsyncStorage.setItem('userEmail', email);
                await AsyncStorage.setItem('userName', nome); // Armazena o nome
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
            navigation.navigate('HomeScreen', { userName: nome });
        }
    };

    useEffect(() => {
        checkLoginStatus();
    }, []);

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.loginSection}>
                    <Image style={styles.logo} source={require('../assets/PEJOTITLE.png')} />
                    <TextInput style={styles.input} placeholder="Email ou Telefone" placeholderTextColor="#888" value={email} onChangeText={setEmail} />
                    <TextInput style={styles.input} placeholder="Senha" placeholderTextColor="#888" secureTextEntry value={password} onChangeText={setPassword} />
                    <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                        <Text style={styles.loginButtonText}>Acessar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.forgotPasswordButton} onPress={() => navigation.navigate('ForgotPassword')}>
                        <Text style={styles.forgotPasswordText}>Esqueci a Senha</Text>
                    </TouchableOpacity>
                    <View style={styles.separator} />
                </View>

                <View style={styles.footer}>
                    <TouchableOpacity style={styles.createAccountButton} onPress={() => navigation.navigate('Register')}>
                        <Text style={styles.createAccountText}>Não tem uma conta? Crie uma</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center', // Mantém os itens centralizados
        paddingHorizontal: 30,
    },
    logo: {
        height: 200,
        width: 200,
        marginBottom: 0,
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
        paddingVertical: 10,
        paddingHorizontal: 20,
        fontSize: 16,
        marginBottom: 15,
        color: '#333',
    },
    loginButton: {
        backgroundColor: '#3897f0', // Azul vibrante
        borderRadius: 10,
        paddingVertical: 12,
        width: '100%',
        alignItems: 'center',
        marginVertical: 10,
        shadowColor: '#3897f0',
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 4,
    },
    loginButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    forgotPasswordButton: {
        marginTop: 15,
    },
    forgotPasswordText: {
        color: '#0277BD', 
        fontSize: 16,
        fontWeight: 'bold',
    },
    separator: {
        width: '100%',
        height: 1,
        backgroundColor: '#ddd',
        marginVertical: 20,
    },
    footer: {
        paddingHorizontal: 30,
        paddingBottom: 20, 
    },
    createAccountButton: {
        backgroundColor: '#ffffff',
        borderRadius: 5,
        paddingVertical: 12,
        width: '100%',
        alignItems: 'center',
        borderColor: '#ddd',
    },
    createAccountText: {
        color: '#0277BD', 
        fontSize: 14,
        fontWeight: 'bold',
    },
});

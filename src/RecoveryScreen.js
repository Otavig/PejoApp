import React, { useState, useEffect } from 'react';
import { View, Image, TextInput, StyleSheet, Alert, Text, TouchableOpacity, Animated } from 'react-native';
import axios from 'axios';
import { Linking } from 'react-native';

const RecoveryScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [fadeAnim] = useState(new Animated.Value(0));

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
        }).start();
    }, []);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handlePasswordReset = async () => {
        if (!validateEmail(email)) {
            Alert.alert('Email inválido', 'Por favor, insira um endereço de email válido.');
            return;
        }

        try {
            const response = await axios.post('http://10.111.9.44:3006/forgot-password', { email });
            Alert.alert(
                'Email Enviado',
                'Um link de recuperação de senha foi enviado para o seu email.',
                [
                    { text: 'OK', onPress: () => navigation.navigate('Login') }
                ]
            );
        } catch (error) {
            console.error('Error sending password reset email:', error);
            let errorMessage = 'Ocorreu um erro ao enviar o email de recuperação.';
            if (error.response) {
                errorMessage += ` Detalhes: ${error.response.data.message || error.response.data.error}`;
            }
            Alert.alert('Erro', errorMessage);
        }
    };

    const renderAnimatedInput = () => {
        const animatedBorderColor = new Animated.Value(isFocused ? 1 : 0);

        Animated.timing(animatedBorderColor, {
            toValue: isFocused ? 1 : 0,
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
                        value={email}
                        onChangeText={setEmail}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        placeholder="Email"
                        placeholderTextColor="#aaa"
                    />
                </Animated.View>
            </View>
        );
    };

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            <Image style={{ height: 110, width: 110, marginBottom: 20}} source={require('../assets/imgs/icon.png')} />
            <Text style={styles.title}>Recuperar Senha</Text>
            {renderAnimatedInput()}
            <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
                <Text style={styles.buttonText}>Enviar Link de Recuperação</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.linkText}>Voltar para o Login</Text>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#023047',
        marginBottom: 20,
    },
    inputContainer: {
        width: '90%',
        marginBottom: 20,
    },
    inputWrapper: {
        borderWidth: 1,
    },
    input: {
        width: '100%',
        padding: 15,
        fontSize: 15,
        color: '#000',
    },
    button: {
        backgroundColor: '#0088CC',
        width: '90%',
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 10,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    linkButton: {
        marginTop: 15,
    },
    linkText: {
        color: 'black',
        fontSize: 14,
    },
});

export default RecoveryScreen;

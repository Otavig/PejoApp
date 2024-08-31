import React, { useState, useEffect } from 'react';
import { View, Image, TextInput, StyleSheet, Alert, Text, TouchableOpacity, Animated } from 'react-native';
import { Dimensions } from 'react-native';

const largura = Dimensions.get('screen').width;

const ForgotPasswordScreen = ({ navigation }) => {
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

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    const validateEmail = (email) => {
        // Regex para validação de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handlePasswordReset = async () => {
        if (!validateEmail(email)) {
            Alert.alert('Email inválido', 'Por favor, insira um endereço de email válido.');
            return;
        }

        // Implementar lógica de envio de email para recuperação de senha aqui
        // incluir validações antes de enviar o email

        Alert.alert('Email enviado', 'Verifique seu email para instruções de recuperação de senha');
    };

    const renderAnimatedInput = (placeholder, value, onChangeText) => {
        const animatedLabel = new Animated.Value(isFocused || value ? 1 : 0);
        const animatedBorderColor = new Animated.Value(isFocused ? 1 : 0);

        if (isFocused) {
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
                <Animated.View style={{ ...styles.inputWrapper, borderColor }}>
                    <TextInput
                        style={styles.input}
                        value={value}
                        onChangeText={onChangeText}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                    />
                </Animated.View>
            </View>
        );
    };

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            <Image style={{ height: 110, width: 110, marginBottom: 20}} source={require('../assets/imgs/icon.png')} />
            <Text style={styles.title}>Recuperar Senha</Text>
            {renderAnimatedInput('Email', email, setEmail)}
            <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
                <Text style={styles.buttonText}>Enviar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.linkButton, { marginTop: 10 }]} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.linkText}>Lembrei a senha</Text>
            </TouchableOpacity>
        </Animated.View>
    );
};

export default ForgotPasswordScreen;

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
        fontSize: 12.5,
        color: '#666',
        marginBottom: 15,
        maxWidth: '80%'
    },
    inputContainer: {
        width: '80%',
        alignItems: 'center',
        marginBottom: 20,
    },
    inputWrapper: {
        borderWidth: 1,
        borderRadius: 4,
        width: '100%',
    },
    input: {
        width: '100%',
        padding: 10,
        fontSize: 13,
    },
    linkText: {
        color: 'black',
        fontSize: 12,
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
});

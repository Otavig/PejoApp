import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, ScrollView, Platform, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

export default function ForgotPasswordScreen() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const { width, height } = Dimensions.get('window');

    const handleSendEmail = async () => {
        setLoading(true);
        try {
            const response = await axios.post('http://192.168.0.100:3000/forgot-password', { email });
            setMessage(response.data.mensagem);
        } catch (error) {
            setMessage('Erro ao enviar e-mail. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.loginSection}>
                    <Image style={styles.logo} source={require('../assets/PEJOTITLE.png')} />
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor="#888"
                        value={email}
                        onChangeText={setEmail}
                    />
                    <TouchableOpacity 
                        style={styles.sendButton} 
                        onPress={handleSendEmail} 
                        disabled={loading}
                    >
                        <Text style={styles.sendButtonText}>
                            {loading ? 'Enviando...' : 'Enviar E-mail'}
                        </Text>
                    </TouchableOpacity>
                    {message ? <Text style={styles.message}>{message}</Text> : null}
                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.forgotPasswordButton} onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.forgotPasswordText}>Lembrou da senha?</Text>
                        </TouchableOpacity>
                    </View>
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
        justifyContent: 'center',
        paddingHorizontal: 30,
    },
    logo: {
        height: height * 0.25,
        width: width * 0.5,
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
        paddingVertical: height * 0.02,
        paddingHorizontal: width * 0.05,
        fontSize: width * 0.04,
        marginBottom: 15,
        color: '#333',
    },
    sendButton: {
        backgroundColor: '#3897f0',
        borderRadius: 10,
        paddingVertical: height * 0.02,
        width: '100%',
        alignItems: 'center',
        marginVertical: height * 0.02,
        shadowColor: '#3897f0',
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 4,
    },
    sendButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    message: {
        marginTop: 15,
        color: '#4CAF50',
        fontSize: 16,
        textAlign: 'center',
    },
    forgotPasswordButton: {
        marginTop: 15,
    },
    forgotPasswordText: {
        color: '#0277BD',
        fontSize: 16,
        // fontWeight: 'bold',
    },
});

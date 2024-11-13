import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';

export default function RegisterScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigation = useNavigation();

    // Função para formatar a data no formato 'DD/MM/YYYY'
    const handleDateChange = (text) => {
        // Filtra apenas números
        const formattedDate = text.replace(/\D/g, '');

        // Formata a data no formato 'DD/MM/YYYY'
        if (formattedDate.length <= 2) {
            setBirthDate(formattedDate);
        } else if (formattedDate.length <= 4) {
            setBirthDate(`${formattedDate.slice(0, 2)}/${formattedDate.slice(2, 4)}`);
        } else {
            setBirthDate(`${formattedDate.slice(0, 2)}/${formattedDate.slice(2, 4)}/${formattedDate.slice(4, 8)}`);
        }
    };

    // Função para verificar se a data de nascimento é válida
    const calculateAge = (birthDate) => {
        const [day, month, year] = birthDate.split('/');
        const birth = new Date(`${year}-${month}-${day}`);
        const today = new Date();
        const age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            return age - 1;
        }
        return age;
    };

    // Função para validar o email
    const isValidEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };

    // Função para verificar se a senha é forte o suficiente
const isStrongPassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;
    return passwordRegex.test(password);
};

// Função para registrar o usuário
const handleRegister = async () => {
    if (!isStrongPassword(password)) {
        Alert.alert('Erro', 'A senha deve ter no mínimo 6 caracteres, incluir pelo menos um número e uma letra maiúscula.');
        return;
    }

    if (password !== confirmPassword) {
        Alert.alert('Erro', 'As senhas não coincidem.');
        return;
    }

    if (!isValidEmail(email)) {
        Alert.alert('Erro', 'Por favor, insira um email válido.');
        return;
    }

    if (name === '' || email === '' || phone === '' || birthDate === '' || password === '' || confirmPassword === '') {
        Alert.alert('Erro', 'Todos os campos devem ser preenchidos.');
        return;
    }

    const age = calculateAge(birthDate);
    if (age < 16) {
        Alert.alert('Erro', 'Você deve ter no mínimo 16 anos para se registrar.');
        return;
    }

    const [day, month, year] = birthDate.split('/');
    const formattedBirthDate = `${year}-${month}-${day}`;

    const data = {
        nome: name,
        email: email,
        senha: password,
        telefone: phone,
        data_nascimento: formattedBirthDate,
        tipo_usuario: 'confirmação',
    };

    try {
        const response = await axios.post('http://10.111.9.61:3000/register', data);
        Alert.alert('Sucesso', response.data.mensagem);
        navigation.navigate('Login');
    } catch (error) {
        console.error('Erro ao registrar:', error);
        Alert.alert('Erro', 'Ocorreu um erro ao registrar, tente novamente.');
    }
};

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Top Section */}
            <View style={styles.topSection}>
                <Text style={styles.topText}>Crie sua conta</Text>
                <Text style={styles.subText}>Preencha os dados abaixo.</Text>
            </View>

            {/* Registration Section */}
            <View style={styles.registrationSection}>
                <TextInput
                    style={styles.input}
                    placeholder="Nome"
                    value={name}
                    onChangeText={setName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Telefone"
                    value={phone}
                    onChangeText={setPhone}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Data de Aniversário"
                    value={birthDate}
                    onChangeText={handleDateChange}
                    keyboardType="numeric"
                />
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={[styles.input, { width: '85%' }]}
                        placeholder="Senha"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.iconButton}>
                        <Icon name={showPassword ? 'eye' : 'eye-slash'} size={20} color="#3498db" />
                    </TouchableOpacity>
                </View>
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={[styles.input, { width: '85%' }]}
                        placeholder="Confirmar Senha"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.iconButton}>
                        <Icon name={showPassword ? 'eye' : 'eye-slash'} size={20} color="#3498db" />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={handleRegister} style={styles.registerButton}>
                    <Text style={styles.registerButtonText}>Registrar</Text>
                </TouchableOpacity>
            </View>

            {/* Footer Section */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.loginAccountButton} onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.loginAccountText}>Já tem uma conta? Entre</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#ffffff',
        paddingBottom: 20,
    },
    topSection: {
        backgroundColor: '#3498db',
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
        alignItems: 'center',
        paddingVertical: 40,
        marginBottom: 20
    },
    topText: {
        color: '#ffffff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    subText: {
        color: '#ffffff',
        fontSize: 16,
        marginTop: 5,
    },
    registrationSection: {
        paddingHorizontal: 30,
        marginTop: 20,
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
    passwordContainer: {
        position: 'relative',
        width: '100%',
        marginBottom: 15,
    },
    iconButton: {
        position: 'absolute',
        right: 20,
        top: 15,
    },
    registerButton: {
        backgroundColor: '#3897f0',
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
    registerButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    footer: {
        paddingHorizontal: 30,
        paddingBottom: 20,
    },
    loginAccountButton: {
        backgroundColor: '#ffffff',
        borderRadius: 5,
        paddingVertical: 12,
        width: '100%',
        alignItems: 'center',
        marginTop: 10,
    },
    loginAccountText: {
        color: '#3498db',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

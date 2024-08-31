import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Alert, Text, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Certifique-se de ter esta biblioteca instalada para o ícone de olho
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const largura = Dimensions.get('screen').width;

const RegisterScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [datePlaceholder, setDatePlaceholder] = useState('Data de Nascimento');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const [isFocused, setIsFocused] = useState({
        name: false,
        email: false,
        phone: false,
        password: false,
        confirmPassword: false,
    });
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
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

    const handlePhoneChange = (text) => {
        let formattedPhone = text.replace(/\D/g, '');
        if (formattedPhone.length > 11) {
            formattedPhone = formattedPhone.slice(0, 11);
        }
        if (formattedPhone.length > 2) {
            formattedPhone = `(${formattedPhone.slice(0, 2)}) ${formattedPhone.slice(2, 7)}-${formattedPhone.slice(7, 11)}`;
        } else if (formattedPhone.length > 0) {
            formattedPhone = `(${formattedPhone.slice(0, 2)}`;
        }
        setPhone(formattedPhone);
    };

    const handleDateChange = (date) => {
        const formattedDate = date.toISOString().split('T')[0].split('-').reverse().join('/');
        setBirthDate(formattedDate);
        setDatePlaceholder(formattedDate); // Atualiza o placeholder para a data selecionada
        setDatePickerVisibility(false);
    };

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const calculateAge = (dateString) => {
        const birthDate = new Date(dateString);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();

        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    };

    const renderAnimatedInput = (inputName, placeholder, value, onChangeText, secureTextEntry = false, isPasswordField = false) => {
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
                        secureTextEntry={secureTextEntry}
                        onFocus={() => handleFocus(inputName)}
                        onBlur={() => handleBlur(inputName)}
                        maxLength={inputName === 'phone' ? 15 : undefined}
                    />
                    {isPasswordField && (
                        <TouchableOpacity
                            style={styles.eyeIcon}
                            onPress={() => {
                                if (inputName === 'password') {
                                    setIsPasswordVisible(!isPasswordVisible);
                                } else if (inputName === 'confirmPassword') {
                                    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
                                }
                            }}
                        >
                            <Ionicons
                                name={secureTextEntry ? 'eye-off-outline' : 'eye-outline'}
                                size={20}
                                color="#aaa"
                            />
                        </TouchableOpacity>
                    )}
                </Animated.View>
            </View>
        );
    };
    
    const handleRegister = async () => {
        try {
            if (name && email && phone && password && confirmPassword && birthDate) {
                const phoneNumber = phone.replace(/\D/g, ''); // Remove formatação
    
                if (phoneNumber.length !== 11) {
                    throw new Error('Número de telefone inválido');
                }

                // Verifica a idade
                const birthDateISO = new Date(birthDate.split('/').reverse().join('-')).toISOString().split('T')[0];
                const age = calculateAge(birthDateISO);
                if (age < 13) {
                    throw new Error('Você deve ter pelo menos 13 anos para se registrar');
                }
    
                // Verifica se o telefone já está registrado
                const checkPhoneResponse = await fetch(`http://10.111.9.24:3006/check-phone/${phoneNumber}`);
                const checkPhoneData = await checkPhoneResponse.json();
    
                if (checkPhoneData.exists) {
                    throw new Error('Número de telefone já registrado');
                }
    
                if (name.length > 50) {
                    throw new Error('Nome passou do limite de 50 caracteres');
                }
    
                if (password !== confirmPassword) {
                    throw new Error('As senhas não coincidem');
                }
    
                if (password.length < 6) {
                    throw new Error('Senha precisa de mais do que 6 Caracteres');
                }
    
                const formData = {
                    nome: name,
                    email: email,
                    senha: password,
                    telefone: phoneNumber,
                    data_nascimento: birthDate,
                };
    
                const response = await fetch('http://10.111.9.24:3006/register', {
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
                throw new Error('Todos os campos são obrigatórios');
            }
        } catch (error) {
            console.error('Registration error:', error);
            Alert.alert('Registro falhou', `Error: ${error.message}`);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { marginBottom: 30 }]}>Cadastro</Text>
            {renderAnimatedInput('name', 'Nome', name, setName)}
            {renderAnimatedInput('email', 'Email', email, setEmail)}
            {renderAnimatedInput('phone', 'Telefone', phone, handlePhoneChange)}
            <TouchableOpacity onPress={showDatePicker} style={styles.datePickerContainer}>
                <TextInput
                    style={[styles.input, { color: birthDate ? '#000' : '#aaa' }]} // Atualiza a cor do texto
                    value={birthDate}
                    editable={false}
                    placeholder={datePlaceholder}
                    placeholderTextColor="#aaa"
                />
            </TouchableOpacity>
            {renderAnimatedInput('password', 'Senha', password, setPassword, !isPasswordVisible, true)}
            {renderAnimatedInput('confirmPassword', 'Confirmar Senha', confirmPassword, setConfirmPassword, !isConfirmPasswordVisible, true)}
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Cadastrar-se</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('Login')}>
                <Text style={[styles.linkText, { marginBottom: 20 }]}>Já tem uma conta? Entre</Text>
            </TouchableOpacity>
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleDateChange}
                onCancel={hideDatePicker}
            />
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
        fontSize: 30,
        fontWeight: 'bold',
        color: '#023047',
        marginBottom: 0,
    },
    inputContainer: {
        width: '80%',
        marginBottom: 14,
    },
    inputWrapper: {
        borderWidth: 1,
        borderRadius: 4,
        position: 'relative',
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
        marginBottom: 10
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    linkButton: {
        alignItems: 'center',
    },
    linkText: {
        color: 'black',
        fontSize: 12,
    },
    datePickerContainer: {
        width: '80%',
        marginBottom: 15,
        borderWidth: 1,
        borderRadius: 4,
        borderColor: '#ccc',
        justifyContent: 'center',
    },
});

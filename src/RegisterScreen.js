import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Alert, Text, TouchableOpacity, Dimensions, Animated, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Certifique-se de ter esta biblioteca instalada para o ícone de olho
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const largura = Dimensions.get('screen').width;

const RegisterScreen = ({ navigation }) => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [datePlaceholder, setDatePlaceholder] = useState('Data de Nascimento');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const [isFocused, setIsFocused] = useState({
        fullName: false,
        email: false,
        phone: false,
        password: false,
        confirmPassword: false,
    });
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [fadeAnim] = useState(new Animated.Value(0));
    const [isLoading, setIsLoading] = useState(false);

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
                    {(inputName === 'password' || inputName === 'confirmPassword') && (
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
        setIsLoading(true);
        try {
            if (fullName && email && phone && password && confirmPassword && birthDate) {
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
                const checkPhoneResponse = await fetch(`http://10.111.9.44:3006/check-phone/${phoneNumber}`);
                const checkPhoneData = await checkPhoneResponse.json();

                if (checkPhoneData.exists) {
                    throw new Error('Número de telefone já registrado');
                }

                if (fullName.trim().length > 50) {
                    throw new Error('Nome passou do limite de 50 caracteres');
                }

                if (password !== confirmPassword) {
                    throw new Error('As senhas não coincidem');
                }

                if (password.length < 6) {
                    throw new Error('Senha precisa de mais do que 6 Caracteres');
                }

                const formData = {
                    nome: fullName.trim(),
                    email: email,
                    senha: password,
                    telefone: phoneNumber,
                    data_nascimento: birthDate,
                };

                const response = await fetch('http://10.111.9.44:3006/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const result = await response.json();
                
                // Show success message
                Alert.alert(
                    'Cadastro realizado com sucesso',
                    'Por favor, verifique seu email para confirmar o cadastro.',
                    [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
                );
            } else {
                throw new Error('Todos os campos são obrigatórios');
            }
        } catch (error) {
            console.error('Registration error:', error);
            Alert.alert('Registro falhou', `Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const renderDateInput = () => {
        return (
            <View style={styles.inputContainer}>
                <TouchableOpacity onPress={showDatePicker} style={styles.datePickerContainer}>
                    <Text style={[styles.dateInput, { color: birthDate ? '#000' : '#aaa' }]}>
                        {birthDate || datePlaceholder}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#0088CC" />
                    </View>
                ) : (
                    <>
                        <Text style={styles.title}>Cadastro</Text>
                        {renderAnimatedInput('fullName', 'Nome e Sobrenome', fullName, setFullName)}
                        {renderAnimatedInput('email', 'Email', email, setEmail)}
                        {renderAnimatedInput('phone', 'Telefone', phone, handlePhoneChange)}
                        {renderDateInput()}
                        {renderAnimatedInput('password', 'Senha', password, setPassword, !isPasswordVisible)}
                        {renderAnimatedInput('confirmPassword', 'Confirmar Senha', confirmPassword, setConfirmPassword, !isConfirmPasswordVisible)}
                        <TouchableOpacity style={styles.button} onPress={handleRegister}>
                            <Text style={styles.buttonText}>Cadastrar-se</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.linkText}>Já tem uma conta? Entre</Text>
                        </TouchableOpacity>
                        <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            mode="date"
                            onConfirm={handleDateChange}
                            onCancel={hideDatePicker}
                        />
                    </>
                )}
            </View>
        </ScrollView>
    );
};

export default RegisterScreen;

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
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
    eyeIcon: {
        position: 'absolute',
        right: 18,
        top: 20,
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
        alignItems: 'center',
        marginTop: 5,
    },
    linkText: {
        color: 'black',
        fontSize: 14,
    },
    datePickerContainer: {
        width: '100%',
        height: 59,
        borderWidth: 1,
        borderColor: '#ccc',
        justifyContent: 'center',
        paddingHorizontal: 15,
    },
    dateLabel: {
        fontSize: 12,
        color: '#0088CC',
        marginBottom: 4,
    },
    dateInput: {
        fontSize: 15,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

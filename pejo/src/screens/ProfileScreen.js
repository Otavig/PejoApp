import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { ProgressBar } from 'react-native-paper'; 
import Icon from 'react-native-vector-icons/Ionicons'; 
import { useNavigation } from '@react-navigation/native'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import axios from 'axios';

export default function ProfileScreen() {
    const navigation = useNavigation(); 
    const [userData, setUserData] = useState(null);

    // Função para formatar o número de telefone
    const formatPhoneNumber = (phoneNumber) => {
        if (!phoneNumber) return phoneNumber;

        // Remove todos os caracteres não numéricos
        phoneNumber = phoneNumber.replace(/[^\d]/g, '');

        // Aplica a formatação (18) 99666-0212
        if (phoneNumber.length <= 2) {
            phoneNumber = phoneNumber.replace(/(\d{2})/, '($1) ');
        } else if (phoneNumber.length <= 7) {
            phoneNumber = phoneNumber.replace(/(\d{2})(\d{5})/, '($1) $2-');
        } else {
            phoneNumber = phoneNumber.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        }

        return phoneNumber;
    };

    const fetchUserData = async () => {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) {
            console.error('ID do usuário não encontrado. Redirecionando para a tela de login.');
            await AsyncStorage.clear();
            navigation.navigate('Login'); // Redireciona para a tela de login
            return; // Sai da função se o ID for nulo
        }
        try {
            const response = await axios.get(`http://10.111.9.44:3000/user/${userId}`);
            const level = response.data.nivel;
            // Calcula o nível real e o progresso
            const calculatedLevel = Math.floor(level / 100);  // Divide o nível por 100 para determinar o nível
            const progress = level % 100;  // O progresso será o resto da divisão por 100

            setUserData({
                id: response.data.id,
                level: calculatedLevel,  // Nível real
                progress: progress,  // Progresso
                name: response.data.nome,
                email: response.data.email,
                phone: response.data.telefone,
                birthDate: response.data.data_nascimento,
                profileImage: response.data.profileImage,
            });
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.error('Usuário não encontrado. Verifique o ID do usuário:', userId);
            } else {
                console.error('Erro ao buscar dados do usuário:', error);
            }
        }
    };

    const handleLogout = async () => {
        // Clear all user data from AsyncStorage
        await AsyncStorage.clear();
        // Navigate to the login screen
        navigation.navigate('Login');
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', options).replace(/\//g, '/');
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchUserData(); // Chama a função sempre que a tela é focada
        });

        return unsubscribe; 
    }, [navigation]);

    if (!userData) {
        return <Text>Carregando...</Text>;
    }

    return (
        <ScrollView style={styles.container}>
            <View style={[styles.profileContainer, {marginTop: 100}]} >
                <Image
                    style={styles.profileImage}
                    source={{ uri: `http://10.111.9.44:3000/imagesUsers/${userData.profileImage}`  || 'https://example.com/default-profile-picture.jpg' }}
                />
            </View>

            <View style={styles.buttonContainer}>
                <Icon name="create-outline" size={30} color="#0088CC" onPress={() => navigation.navigate('EditProfile', { userData })} />
                <Icon name="log-out-outline" size={30} color="#ff0000" onPress={handleLogout} />
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Level {userData.level}</Text>
                <ProgressBar progress={userData.progress / 100} color="#0088CC" style={styles.progressBar} />
                <Text style={styles.info}>{userData.progress}%</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Nome</Text>
                <Text style={styles.info}>{userData.name}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Data de nascimento</Text>  
                <Text style={styles.info}>{formatDate(userData.birthDate)}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Email</Text>
                <Text style={styles.info}>{userData.email}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Telefone</Text> 
                <Text style={styles.info}>{formatPhoneNumber(userData.phone)}</Text> 
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        backgroundColor: '#666',
        padding: 16,
        alignItems: 'center',
    },
    headerText: {
        color: '#fff',
        fontSize: 18,
    },
    profileContainer: {
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 16,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#ccc',
    },
    section: {
        backgroundColor: '#fff',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    label: {
        color: '#666',
        marginBottom: 8,
    },
    info: {
        color: '#000',
        fontSize: 16,
    },
    progressBar: {
        height: 10,
        borderRadius: 5,
        marginVertical: 8,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 16,
        paddingHorizontal: 20, // Adicionando um pouco de padding
    },
});

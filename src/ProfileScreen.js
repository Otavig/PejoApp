import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Modal, Dimensions, SafeAreaView, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';
import { API_URL } from '@env';

const { width, height } = Dimensions.get('window');

// Exemplo de dados para o carrossel
const CAROUSEL_DATA = [
    { id: '1', title: 'Desafio 1' },
    { id: '2', title: 'Desafio 2' },
    { id: '3', title: 'Desafio 3' },
    { id: '4', title: 'Desafio 4' },
    { id: '5', title: 'Desafio 5' },
];

const ProfileScreen = ({ navigation }) => {
    const [profilePicture, setProfilePicture] = useState(null);
    const [user, setUser] = useState(null);
    const [bio, setBio] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [email, setEmail] = useState('');
    const [nome, setNome] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [isLogoutVisible, setIsLogoutVisible] = useState(false);

    useEffect(() => {
        const loadUser = async () => {
            const userData = await AsyncStorage.getItem('user');
            if (userData) {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
                setBio(parsedUser.bio || '');
                setEmail(parsedUser.email || '');
                setNome(parsedUser.nome || '');
                setDataNascimento(parsedUser.dataNascimento || '');
            }
        };

        loadUser();
    }, []);

    const saveProfile = async () => {
        const updatedUser = { ...user, bio, email, nome, dataNascimento };
        setUser(updatedUser);
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        setIsEditing(false);
    };

    const handleLogout = async () => {
        await AsyncStorage.removeItem('user');
        navigation.replace('LoginScreen');  // Redireciona para a tela de login
    };

    const validateDate = (date) => {
        const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(\d{4})$/;
        return regex.test(date);
    };

    const handleDateChange = (date) => {
        // Permite qualquer entrada, mas mantém a data válida
        setDataNascimento(date);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.profileContainer}>
                <View style={styles.imageContainer}>
                    <Image
                        style={styles.profileImage}
                        source={profilePicture ? { uri: profilePicture } : require('../assets/imgs/defaultProfile.png')}
                    />
                    <Text style={styles.profileName}>{nome || 'Nome aqui'}</Text>
                </View>
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.logoutButton} onPress={() => setIsLogoutVisible(true)}>
                        <FontAwesome name="sign-out" size={20} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
                        <FontAwesome name="edit" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.infoContainer}>
                <Text style={styles.infoTitle}>Sobre Mim</Text>
                <Text style={styles.infoDescription}>{bio || 'Bio não disponível'}</Text>
                <Text style={[styles.infoTitle, { marginTop: 20 }]}>Informações</Text>
                <Text style={styles.infoDescription}>{email || 'E-mail não disponível'}</Text>
                <Text style={styles.infoDescription}>
                    Data de Nascimento: {dataNascimento || 'Data não disponível'}
                </Text>
            </View>

            <View style={styles.dasafiosFavContainer}>
                <Text style={styles.infoTitle}>Desafios Favoritos</Text>
                <FlatList
                    data={CAROUSEL_DATA} // Os dados para o carrossel
                    horizontal={true} // Permite o scroll horizontal
                    showsHorizontalScrollIndicator={false} // Oculta a barra de scroll
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>{item.title}</Text>
                        </View>
                    )}
                />
            </View>

            {/* Modal para Edição de Perfil */}
            <Modal visible={isEditing} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Editar Perfil</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Nome"
                            value={nome}
                            onChangeText={setNome}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Bio"
                            value={bio}
                            onChangeText={setBio}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="E-mail"
                            value={email}
                            onChangeText={setEmail}
                        />
                        {/* Campo de data de nascimento */}
                        <TextInput
                            style={styles.input}
                            placeholder="Data de Nascimento (DD/MM/YYYY)"
                            value={dataNascimento}
                            onChangeText={handleDateChange}
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
                                <Text style={styles.saveButtonText}>Salvar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.cancelButton} onPress={() => setIsEditing(false)}>
                                <Text style={styles.cancelButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Modal para confirmação de logout */}
            <Modal visible={isLogoutVisible} animationType="fade" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Tem certeza que deseja sair?</Text>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.saveButton} onPress={handleLogout}>
                                <Text style={styles.saveButtonText}>Sim</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.cancelButton} onPress={() => setIsLogoutVisible(false)}>
                                <Text style={styles.cancelButtonText}>Não</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#004060',
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 20,
        marginBottom: 10,
        borderWidth: 2,
        borderColor: '#80D4FF',
        borderRadius: 40,
        paddingHorizontal: 20,
    },
    imageContainer: {
        flex: 1,
        alignItems: 'center',
    },
    buttonsContainer: {
        flexDirection: 'column',
        alignItems: 'flex-end',
        marginLeft: 'auto',
    },
    profileImage: {
        width: 100,
        height: 100,
        marginTop: 20,
        borderRadius: 50,
    },
    profileName: {
        fontSize: 15,
        fontWeight: 'bold',
        marginTop: 10,
        textAlign: 'center',
    },
    editButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 20,
        marginTop: 10,
    },
    logoutButton: {
        backgroundColor: '#ff4d4d',
        padding: 10,
        borderRadius: 20,
    },
    infoContainer: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#fff',
        marginBottom: 10,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: '#80D4FF',
    },
    dasafiosFavContainer: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#fff',
        marginBottom: 10,
        borderWidth: 2,
        borderColor: '#80D4FF',
        borderRadius: 30,
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    infoDescription: {
        fontSize: 16,
        marginBottom: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: width * 0.8,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#80D4FF',
        borderRadius: 10,
        padding: 10,
        marginBottom: 15,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    saveButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 20,
        flex: 1,
        marginRight: 10,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    cancelButton: {
        backgroundColor: '#ff4d4d',
        padding: 10,
        borderRadius: 20,
        flex: 1,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    card: {
        backgroundColor: '#80D4FF',
        padding: 20,
        borderRadius: 10,
        marginRight: 10,
    },
    cardTitle: {
        fontSize: 16,
        color: '#fff',
    },
});

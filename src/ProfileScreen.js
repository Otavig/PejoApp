import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, TextInput, Modal, ScrollView, Dimensions, SafeAreaView, FlatList,  StyleSheeSafeAreaView,  StatusBar, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome'; // Importando a biblioteca de ícones
import { ImageBackground } from 'react-native'; // Adicione esta importação

const { width, height } = Dimensions.get('window');

const DATA = [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      title: 'First Item',
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      title: 'Second Item',
    },
    {
    
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      title: 'Third Item',
    },
  ];



const formatDateForDisplay = (dateString) => {
    if (!dateString) return 'Data de nascimento não disponível';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        // Se a data for inválida, tenta um parse manual
        const parts = dateString.split('-');
        if (parts.length === 3) {
            const newDate = new Date(parts[0], parts[1] - 1, parseInt(parts[2]) + 1);
            return `${newDate.getDate().toString().padStart(2, '0')}/${(newDate.getMonth() + 1).toString().padStart(2, '0')}/${newDate.getFullYear()}`;
        }
        return 'Data inválida';
    }
    date.setDate(date.getDate() + 1); // Adiciona 1 dia
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
};

const formatDateForDatabase = (dateString) => {
    if (!dateString) return '';
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
};

const ProfileScreen = ({ navigation, route }) => {
    const [profilePicture, setProfilePicture] = useState(null);
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState('');
    const [isEditMenuVisible, setIsEditMenuVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [bio, setBio] = useState(''); // Adicione esta linha para armazenar a bio
    const [desafio, setdesafio] = useState(''); // Adicione esta linha para armazenar os desafios
    const [descricao, setdescricao] = useState(''); // Adicione esta linha para armazenar os desafios
    const [editBio, setEditBio] = useState(''); // Adicione esta linha para armazenar a bio editada
    const [editedEmail, setEditedEmail] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');

    useEffect(() => {
        const loadUser = async () => {
            const userData = await AsyncStorage.getItem('user');
            if (userData) {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
                setEmail(parsedUser.email);
                setProfilePicture(parsedUser.imagem_url);
                setDataNascimento(parsedUser.data_nascimento || '');
                setBio(parsedUser.bio || ''); // Adicione esta linha
                setdesafio(parsedUser.desafio || ''); 
                setdescricao(parsedUser.descricao  || ''); 

                const response = await fetch(`http://10.111.9.50:3006/user/${parsedUser.id}`);
                const data = await response.json();
                if (response.ok) {
                    const updatedUser = { ...parsedUser, ...data.user };
                    setUser(updatedUser);
                    setEmail(updatedUser.email);
                    setDataNascimento(updatedUser.data_nascimento || '');
                    if (updatedUser.imagem_url) {
                        setProfilePicture(updatedUser.imagem_url);
                    }
                    // Atualizar o AsyncStorage com os dados mais recentes
                    await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
                } else {
                    console.error('Erro ao buscar detalhes do usuário:', data.error);
                }
            }
        };

        loadUser();
    }, []);

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permissão negada', 'Precisamos de permissão para acessar a galeria!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            setProfilePicture(result.uri);
            await uploadProfilePicture(result.uri);
        }
    };

    const uploadProfilePicture = async (uri) => {
        try {
            console.log('Starting upload process for uri:', uri);

            const formData = new FormData();
            formData.append('profile_picture', {
                uri: uri,
                type: 'image/jpeg',
                name: 'profile_picture.jpg'
            });

            console.log('Enviando requisição para:', `http://10.111.9.50:3006/user/${user.id}/profile-picture`);

            const response = await fetch(`http://10.111.9.50:3006/user/${user.id}/profile-picture`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Resposta recebida:', response.status);

            if (response.ok) {
                const data = await response.json();
                setProfilePicture(data.imagem_url);
                const updatedUser = { ...user, imagem_url: data.imagem_url };
                await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser);
                Alert.alert('Sucesso', 'Foto de perfil atualizada com sucesso!');
            } else {
                const errorData = await response.json();
                console.error('Erro na resposta do servidor:', errorData);
                Alert.alert('Erro', 'Não foi possível atualizar a foto de perfil.');
            }
        } catch (error) {
            console.error('Erro ao enviar foto de perfil:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao enviar a foto de perfil. Por favor, tente novamente.');
        }
    };

    const { handleLogout } = route.params;

    const handleLogoutPress = () => {
        Alert.alert(
            'Confirmar Logout',
            'Tem certeza que deseja sair?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Sair',
                    onPress: async () => {
                        await AsyncStorage.removeItem('user');
                        route.params.handleLogout(navigation); 
                    },
                },
            ],
            { cancelable: false }
        );
    };

    const handleEdit = () => {
        setEditBio(bio);
        setIsEditMenuVisible(true);
        setEditedName(user?.nome || '');
        setEditedEmail(user?.email || '');
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`http://10.111.9.50:3006/user/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nome: editedName,
                    email: editedEmail,
                    bio: editBio, 
                }),
            });

            if (response.ok) {
                const updatedUser = { ...user, nome: editedName, email: editedEmail, bio: editBio };
                setUser(updatedUser);
                setEmail(editedEmail);
                setBio(editBio);
                await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
                setIsEditMenuVisible(false);
                Alert.alert('Sucesso', 'Informações atualizadas com sucesso!');
            } else {
                Alert.alert('Erro', 'Não foi possível atualizar as informações.');
            }
        } catch (error) {
            console.error('Erro ao atualizar informações:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao atualizar as informações.');
        }
    };

    const handleCancel = () => {
        setIsEditMenuVisible(false);
        setEditBio(bio);
        setEditedName(user?.nome || '');
        setEditedEmail(user?.email || '');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.profileContainer}>
                <View style={styles.imageContainer}>
                    <Image
                        style={styles.profileImage}
                        source={profilePicture ? { uri: profilePicture } : require('../assets/imgs/defaultProfile.png')}
                    />
                    <Text style={styles.profileName}>{user?.nome || 'Nome aqui'}</Text>
                </View>
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogoutPress}>
                        <FontAwesome name="sign-out" size={20} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
                        <FontAwesome name="edit" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.infoTitle}>Sobre Mim</Text>
                <Text style={styles.infoDescription}>
                    {bio || 'Bio não disponível'}
                </Text>
                <Text style={[styles.infoTitle, { marginTop: 20 }]}>Informações</Text>
                <Text style={styles.infoDescription}>
                    {email || 'E-mail não disponível'}
                </Text>
                <Text style={styles.infoDescription}>
                    Data de Nascimento: {dataNascimento || 'Data não disponível'}
                </Text>
            </View>
            <View style={styles.dasafiosFavContainer}>
                <Text style={styles.infoTitle}>Desafios Favoritos</Text>
                <Text style={styles.infoDescription}>
                    {desafio || 'Desafio não disponível'}
                </Text>
                <Text style={[styles.infoTitle, { marginTop: 20 }]}>Descrição</Text>
                <Text style={styles.infoDescription}>
                    {descricao || 'Descrição não disponível'}
                </Text>
            </View>


            {/* Adicionando o Modal para edição */}

            

            <Modal
                visible={isEditMenuVisible}
                animationType="slide"
                transparent={true}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={{textAlign: 'center', fontWeight: 'bold', marginBottom: 20}}>Editar informações</Text>
                        <TextInput
                            placeholder="Bio"
                            value={editBio} 
                            onChangeText={setEditBio}
                            style={styles.input}
                        />
                        <TextInput
                            placeholder="Nome"
                            value={editedName}
                            onChangeText={setEditedName}
                            style={styles.input}
                        />
                        <TextInput
                            placeholder="E-mail"
                            value={editedEmail}
                            onChangeText={setEditedEmail}
                            style={styles.input}
                        />
                        <View style={styles.containerButtons}>
                            <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
                                <Icon name="close" size={20} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                                <Icon name="save" size={20} color="white" /> 
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default ProfileScreen;

// Estilos atualizados
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#004060',
    },
    profileContainer: {
        flexDirection: 'row', // Mantendo a direção do flex
        alignItems: 'center', // Centralizando verticalmente
        backgroundColor: '#fff',
        paddingVertical: 20,
        marginBottom: 10,
        borderWidth: 2,
        borderColor: '#80D4FF',
        borderRadius: 40,
        paddingHorizontal: 20, // Adicionando padding horizontal
    },
    imageContainer: {
        flex: 1, // Permitindo que a imagem e o nome ocupem o espaço necessário
        alignItems: 'center',
    },
    buttonsContainer: {
        flexDirection: 'column', // Alterado para coluna para empilhar os botões
        alignItems: 'flex-end', // Alinhando os botões à direita
        marginLeft: 'auto', // Alinhando à direita
    },
    profileImage: {
        width: 100,
        height: 100,
        start: -100,
        marginTop: 20,
        borderRadius: 50,
    },
    profileName: {
        fontSize: 15,
        start: -60,
        fontWeight: 'bold',
        marginTop: 10,
        textAlign: 'center', // Centralizando o texto
    },
    editButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 20,
        marginTop: 10, // Adicionando espaço entre os botões
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
        borderColor: "#80D4FF"
    },
    dasafiosFavContainer: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#fff',
        marginBottom: 10,
        borderWidth: 2,
        borderColor: "#80D4FF"
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    infoDescription: {
        fontSize: 16,
        color: '#777',
        marginTop: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    saveButton: {
        backgroundColor: '#007bff',
        padding: 10,
        alignItems: 'center',
        borderRadius: 5,
        marginBottom: 10,
        width: '45%',
        height: '80%'
    },
    cancelButton: {
        backgroundColor: '#ff4d4d',
        padding: 10,
        alignItems: 'center',
        borderRadius: 5,
        width: '45%',
        height: '80%'
    },
    containerButtons:{
        flexDirection: 'row',
        width: '100%',
        gap: 28,
        marginLeft: 'auto',
        marginRight: 'auto'
    }
});

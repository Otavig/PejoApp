import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, Switch, ScrollView, TouchableOpacity } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker'; // Adicionando importação
import axios from 'axios';
import { PermissionsAndroid } from 'react-native';

export default function EditProfile({ route, navigation }) {
    const { userData } = route.params; // Recebendo os dados do usuário

    const [name, setName] = useState(userData.name);
    const [email, setEmail] = useState(userData.email);
    const [phone, setPhone] = useState(userData.phone);
    const [bio, setBio] = useState(userData.bio); // Adicionando estado para a bio
    const [profileImage, setProfileImage] = useState(userData.profileImage); // Adicionando estado para a imagem do perfil

    const handleSave = async () => {
        const formData = new FormData(); // Cria um novo FormData para enviar a imagem
        formData.append('name', name);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('bio', bio);
        
        // Adiciona a imagem apenas se existir
        if (profileImage) {
            formData.append('profileImage', {
                uri: profileImage,
                type: 'image/jpeg', // ou o tipo correto da imagem
                name: `${userData.id}.jpg`, // Nome aleatório baseado no ID do usuário
            });
        }

        console.log('Enviando imagem:', profileImage); // Adicionando log para depuração

        try {
            const response = await axios.put(`http://192.168.0.100:3000/userEdit/${userData.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Define o tipo de conteúdo
                },
            });
            console.log(response.data);
            navigation.goBack(); // Volta para a tela anterior
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
        }
    };

    const requestStoragePermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                {
                    title: "Permissão de Acesso à Biblioteca de Imagens",
                    message: "Este aplicativo precisa acessar sua biblioteca de imagens.",
                    buttonNeutral: "Pergunte-me depois",
                    buttonNegative: "Cancelar",
                    buttonPositive: "OK"
                }
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
            console.warn(err);
            return false;
        }
    };

    const handleImagePick = async () => {
        const hasPermission = await requestStoragePermission();
        if (!hasPermission) {
            console.log('Permissão negada');
            return;
        }

        const options = {
            mediaType: 'photo',
            includeBase64: false,
            quality: 1,
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.assets) {
                console.log('Imagem selecionada:', response.assets[0].uri);
                setProfileImage(response.assets[0].uri);
            }
        });
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.profileContainer}> 
                <TouchableOpacity onPress={handleImagePick} style={styles.cameraIconContainer}>
                    <Image
                        style={styles.profileImage}
                        source={{ uri: profileImage }} // Substitua pela URL da sua imagem
                    />
                    <Text>📷</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.label}>Name</Text>
            <TextInput value={name} onChangeText={setName} style={styles.input} />
            <Text style={styles.label}>Email</Text>
            <TextInput value={email} onChangeText={setEmail} style={styles.input} />
            <Text style={styles.label}>Phone</Text>
            <TextInput value={phone} onChangeText={setPhone} style={styles.input} />
            <Text style={styles.label}>Bio</Text>
            <TextInput value={bio} onChangeText={setBio} style={styles.input} /> 
            <Button title="Alterar" onPress={handleSave} />
        
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, // Mantém o contêiner ocupando toda a tela
        padding: 20,
        backgroundColor: '#fff',
    },
    label: {
        marginBottom: 8,
        fontSize: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 20,
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
        paddingBottom: 20,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#ccc',
    },
    cameraIconContainer: {
        position: 'relative',
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 5,
    },
    section: {
        backgroundColor: '#fff',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});

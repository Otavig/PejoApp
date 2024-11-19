import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

export default function EditProfile({ route, navigation }) {
    const { userData } = route.params;

    const [name, setName] = useState(userData.name);
    const [email, setEmail] = useState(userData.email);
    const [phone, setPhone] = useState(userData.phone);
    const [bio, setBio] = useState(userData.bio);
    const [profileImage, setProfileImage] = useState(userData.profileImage || '');

    // UseEffect to ensure profileImage is correctly initialized
    useEffect(() => {
        if (!profileImage && userData.profileImage) {
            setProfileImage(`http://10.111.9.44:3000/imagesUsers/${userData.profileImage}`);
        }
    }, [userData.profileImage]);

    const handleSave = async () => {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('bio', bio);
    
        // Verifica se uma nova imagem foi selecionada
        if (profileImage !== userData.profileImage) {
            // Se o caminho da imagem foi alterado, anexa a nova imagem
            formData.append('profileImage', {
                uri: profileImage,
                type: 'image/jpeg',
                name: `profile_${userData.id}.jpg`,
            });
        } else {
            // Se a imagem não foi alterada, anexa o caminho atual
            formData.append('profileImage', userData.profileImage);
        }
    
        try {
            const response = await axios.put(`http://10.111.9.44:3000/userEdit/${userData.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response.data);
            navigation.goBack();
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
        }
    };    
    
    const handleImagePick = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Desculpe, precisamos de permissão para acessar suas imagens!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaType: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });
        
        console.log('Resultado do ImagePicker:', result);
        
        if (!result.canceled) {
            console.log('Imagem selecionada:', result.assets[0].uri); // Alterado para acessar o uri correto
            setProfileImage(result.assets[0].uri); // Atualize a imagem com o uri correto
        } else {
            console.log('Usuário cancelou a seleção de imagem');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.profileContainer}>
                <TouchableOpacity onPress={handleImagePick} style={styles.cameraIconContainer}>
                    <Image
                        style={styles.profileImage}
                        source={{
                            uri: profileImage 
                                ? profileImage 
                                : 'https://example.com/default-profile-picture.jpg'
                        }}
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
        flex: 1,
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
    cameraIconContainer: {
        position: 'relative',
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 5,
    },
});

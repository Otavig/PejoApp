import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

export default function EditProfile({ route, navigation }) {
    const { userData } = route.params;

    const [name, setName] = useState(userData.name);
    const [email, setEmail] = useState(userData.email);
    const [phone, setPhone] = useState(userData.phone);
    const [profileImage, setProfileImage] = useState(userData.profileImage || '');

    // Função para formatar o número de telefone
    const formatPhoneNumber = (text) => {
        // Remove todos os caracteres não numéricos
        let phoneNumber = text.replace(/[^\d]/g, '');

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

    // Função para limpar a formatação do número de telefone
    const cleanPhoneNumber = (text) => {
        return text.replace(/[^\d]/g, ''); // Remove qualquer caractere que não seja número
    };

    const handleSave = async () => {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('phone', cleanPhoneNumber(phone)); // Envia apenas os números

        if (profileImage && profileImage !== userData.profileImage) {
            formData.append('profileImage', {
                uri: profileImage,
                type: 'image/jpeg',
                name: `profile_${userData.id}.jpg`,
            });
        } else {
            formData.append('profileImage', userData.profileImage || null);
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
            console.log('Imagem selecionada:', result.assets[0].uri);
            setProfileImage(result.assets[0].uri);
        } else {
            console.log('Usuário cancelou a seleção de imagem');
        }
    };

    const validateName = (text) => {
        const nameRegex = /^[a-zA-ZÀ-ÿ\s]*$/; // Permite apenas letras e espaços
        if (text.length > 50) {
            return text.slice(0, 50); // Limita a 50 caracteres
        }
        return nameRegex.test(text) ? text : name; // Retorna o texto válido ou mantém o nome atual
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
            <TextInput
                value={name}
                onChangeText={(text) => setName(validateName(text))} // Aplica validação no nome
                style={styles.input}
            />
            <Text style={styles.label}>Email</Text>
            <TextInput
                value={email}
                onChangeText={setEmail}
                style={styles.input}
            />
            <Text style={styles.label}>Phone</Text>
            <TextInput
                value={formatPhoneNumber(phone)} // Formata o número de telefone ao ser exibido
                onChangeText={(text) => setPhone(formatPhoneNumber(text))} // Formata o número conforme o usuário digita
                style={styles.input}
                keyboardType="phone-pad"
            />
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

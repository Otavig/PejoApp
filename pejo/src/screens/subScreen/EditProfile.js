import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, Switch, ScrollView } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker'; // Adicionando importação

export default function EditProfile({ route, navigation }) {
    const { userData } = route.params; // Recebendo os dados do usuário

    const [name, setName] = useState(userData.name);
    const [email, setEmail] = useState(userData.email);
    const [phone, setPhone] = useState(userData.phone);
    const [bio, setBio] = useState(userData.bio); // Adicionando estado para a bio
    const [profileImage, setProfileImage] = useState(userData.profileImage); // Adicionando estado para a imagem do perfil

    const handleSave = () => {
        // Lógica para salvar as alterações
        navigation.goBack(); // Volta para a tela anterior
    };

    const handleImagePick = () => {
        const options = {
            mediaType: 'photo',
            includeBase64: false,
        };
    
        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                setProfileImage(response.assets[0].uri); // Atualiza a imagem
            }
        });
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.profileContainer}> 
                <Image
                    style={styles.profileImage}
                    source={{ uri: profileImage }} // Substitua pela URL da sua imagem
                />
                <View style={styles.cameraIconContainer} onTouchEnd={handleImagePick}>
                    <Text>📷</Text>
                </View>
            </View>
            <Text style={styles.label}>Name</Text>
            <TextInput value={name} onChangeText={setName} style={styles.input} />
            <Text style={styles.label}>Email</Text>
            <TextInput value={email} onChangeText={setEmail} style={styles.input} />
            <Text style={styles.label}>Phone</Text>
            <TextInput value={phone} onChangeText={setPhone} style={styles.input} />
            <Text style={styles.label}>Bio</Text>
            <TextInput value={bio} onChangeText={setBio} style={styles.input} /> 
            <Button title="Save" onPress={handleSave} />
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
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#ccc',
    },
    cameraIconContainer: {
        position: 'absolute',
        bottom: 0,
        right: 10,
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

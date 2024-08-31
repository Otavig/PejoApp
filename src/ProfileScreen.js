import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const ProfileScreen = ({ navigation, route }) => {
    const [profilePicture, setProfilePicture] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loadUser = async () => {
            const userData = await AsyncStorage.getItem('user');
            console.log(userData);
            if (userData) {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
                setProfilePicture(parsedUser.profile_picture_url);

                // Buscar nome do banco de dados usando o user_id
                const response = await fetch(`http://10.111.9.12:3006/user/${user.id_user}`);
                const data = await response.json();
                if (response.ok) {
                    setUser(data.user);
                    console.log(user)
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
                        handleLogout(); // Chama a função handleLogout passada como parâmetro
                    },
                },
            ],
            { cancelable: false }
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.additionalCard} />

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogoutPress}>
                <Text style={styles.logoutButtonText}>Sair</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.profileContainer} onPress={pickImage}>
                <Image
                    source={profilePicture ? { uri: profilePicture } : require('../assets/imgs/defaultProfile.png')}
                    style={styles.profileImage}
                />
            </TouchableOpacity>

            <View style={styles.nameContainer}>
                <Text style={styles.nameText}>{user?.user_name || 'Nome não disponível'}</Text>
            </View>
        </View>
    );
};

export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0080CC',
        alignItems: 'center',
        justifyContent: 'center',
    },
    additionalCard: {
        backgroundColor: '#FFFDFF',
        width: '100%',
        height: 800,
        position: 'absolute',
        top: 200,
        borderTopLeftRadius: 45,
        borderTopRightRadius: 45,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 5.25,
        shadowRadius: 3.84,
        elevation: 0,
    },
    profileContainer: {
        position: 'absolute',
        top: 0,
        alignItems: 'center',
        width: '100%',
        paddingTop: 100,
    },
    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
        borderWidth: 1,
        zIndex: 1,
    },
    nameContainer: {
        position: 'absolute',
        top: 260,
        alignItems: 'center',
        width: '100%',
        zIndex: 1,
    },
    nameText: {
        fontSize: 20,
        marginTop: 10,
        fontWeight: 'bold',
    },
    logoutButton: {
        borderWidth: 1,
        backgroundColor: '#FF0000',
        borderColor: '#FF0000',
        padding: 10,
        borderRadius: 8,
        position: 'absolute',
        top: 30,
        right: 20,
        width: 70,
        marginTop: 20,
        zIndex: 1,
    },
    logoutButtonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
});


import React from 'react';
import { View, Text, StyleSheet, Image, TextInput, Switch, ScrollView } from 'react-native';
import { ProgressBar } from 'react-native-paper'; 
import Icon from 'react-native-vector-icons/Ionicons'; // Importando a biblioteca de ícones
import { useNavigation } from '@react-navigation/native'; // Importando o hook de navegação
import AsyncStorage from '@react-native-async-storage/async-storage'; 

export default function ProfileScreen() {
    const navigation = useNavigation(); // Hook de navegação

    // Função para deslogar o usuário
    const handleLogout = async () => {
        await AsyncStorage.removeItem('userToken'); 
        await AsyncStorage.clear(); 
        navigation.navigate('Login'); 
    };

    // Exemplo de dados do usuário
    const userData = {
        name: "Blake Pham",
        birthDate: "01/01/1990",
        age: 33,
        email: "blake@example.com",
        phone: "123-456-7890",
        level: 60, 
        bio: "This is a bio", // Adicionando a bio
    };

    return (
        <ScrollView style={styles.container}>
            <View style={[styles.profileContainer, {marginTop: 100}]}>
                <Image
                    style={styles.profileImage}
                    source={{ uri: 'https://example.com/profile-picture.jpg' }} 
                />
            </View>

            <View style={styles.buttonContainer}>
                <Icon name="create-outline" size={30} color="#0088CC" onPress={() => navigation.navigate('EditProfile', { userData })} />
                <Icon name="log-out-outline" size={30} color="#ff0000" onPress={handleLogout} />
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Level 50</Text>
                <ProgressBar progress={userData.level / 100} color="#0088CC" style={styles.progressBar} />
                <Text style={styles.info}>{userData.level}%</Text>
            </View>
            
            <View style={styles.section}>
                <Text style={styles.label}>Nome</Text>
                <Text style={styles.info}>{userData.name}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Bio</Text>
                <Text style={styles.info}>{userData.bio}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Aniversário</Text>  
                <Text style={styles.info}>{userData.birthDate}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Email</Text>
                <Text style={styles.info}>{userData.email}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Telefone</Text> 
                <Text style={styles.info}>{userData.phone}</Text>
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#abd4ff',
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

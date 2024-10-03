import React from 'react';
import { View, Text, StyleSheet, Button, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Importando a biblioteca de ícones

const ChallengeScreen = () => {
    const [difficulty, setDifficulty] = React.useState(''); // Adicionando estado para dificuldade

    return (
        <View style={styles.container}>
            <View style={styles.challengeContainer}>
                <Text style={styles.challengeTitle}>Título do Desafio</Text>
                <Text style={styles.challengeDescription}>Descrição do desafio</Text>
                <Text style={styles.difficulty}>Nível de Dificuldade: {difficulty || 'Fácil'}</Text>
            </View>
            <View style={styles.buttonContainer}>
                <TextInput 
                    style={styles.searchInput} 
                    placeholder="Pesquisar desafios..." 
                />
                <TouchableOpacity 
                    style={styles.btn} 
                >
                    <Icon name="plane" size={20} color="white" />
                </TouchableOpacity>
            </View>
            <View style={styles.difficultyFilter}>
            </View>
        </View>
    );
};

export default ChallengeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#ffffff', // Mudando para branco para um visual mais limpo
    },
    title: {
        fontSize: 32, // Aumentando o tamanho da fonte
        fontWeight: 'bold',
        color: '#ffffff',
    },
    challengeContainer: {
        marginVertical: 20,
        width: '100%',
        alignItems: 'center',
        padding: 20, // Aumentando o padding
        backgroundColor: '#f9f9f9', // Fundo mais claro
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 }, // Aumentando a sombra
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 6,
    },
    challengeTitle: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    challengeDescription: {
        fontSize: 16,
    },
    difficulty: {
        fontSize: 14,
        color: 'gray',
    },
    searchInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginVertical: 10,
        width: '80%',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    difficultyFilter: {
        gap: 20,
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginVertical: 10,
    },
    filterLabel: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    minimalistButton: {
        backgroundColor: '#4A90E2', // Mudando para azul
        borderColor: 'transparent', // Removendo a borda
        borderWidth: 0,
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 15,
        color: 'white',
        fontWeight: 'bold',
    },
    btn: {
        backgroundColor: '#4A90E2', // Mudando para azul
        padding: 15, // Ajustando o padding
        height:45,
        alignItems: 'center',
        marginTop: 7,
        borderRadius: 25, // Aumentando o raio
    }
});

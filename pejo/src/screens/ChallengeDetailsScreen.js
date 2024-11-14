import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const ChallengeDetailsScreen = ({ route, navigation }) => {
    const { challenge } = route.params;

    const handleCompleteChallenge = () => {
        // Lógica para marcar o desafio como concluído (pode ser salvar no banco de dados ou atualizar o estado)
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{challenge.titulo}</Text>
            <Text style={styles.difficulty}>{challenge.dificuldade}</Text>
            <Text style={styles.description}>{challenge.descricao}</Text>
            <TouchableOpacity style={styles.completeButton} onPress={handleCompleteChallenge}>
                <Text style={styles.completeButtonText}>Marcar como concluído</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    difficulty: {
        fontSize: 18,
        color: '#888',
        marginBottom: 20,
    },
    description: {
        fontSize: 16,
        color: '#333',
        marginBottom: 40,
    },
    completeButton: {
        backgroundColor: '#1f1d85',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    completeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ChallengeDetailsScreen;

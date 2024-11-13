import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput } from 'react-native';

const challenges = [
    { id: '1', title: 'Desafio 1', difficulty: 'Fácil', description: 'Descrição do desafio 1...' },
    { id: '2', title: 'Desafio 2', difficulty: 'Médio', description: 'Descrição do desafio 2...' },
    { id: '3', title: 'Desafio 3', difficulty: 'Difícil', description: 'Descrição do desafio 3...' },
];

const ListChallenges = () => {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchInput}
                placeholder="Pesquisar desafios..."
                value={searchTerm}
                onChangeText={setSearchTerm}
            />
            <FlatList
                data={challenges.filter(challenge => challenge.title.toLowerCase().includes(searchTerm.toLowerCase()))}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.difficulty}>{item.difficulty}</Text>
                        <Text style={styles.description}>{item.description.substring(0, 50)}...</Text> 
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 3, // Ajuste para melhor espaçamento
    },
    difficulty: {
        fontSize: 14,
        color: 'orange', // Cor para destacar a dificuldade
        marginBottom: 3,
    },
    description: {
        fontSize: 12,
        color: '#666', // Cor mais suave para a descrição
    },
    item: {
        padding: 10,
        marginVertical: 8,
        marginHorizontal: 16,
        backgroundColor: '#f9f9f9', // Cor de fundo para o card
        borderRadius: 8, // Bordas arredondadas
        shadowColor: '#000', // Sombra para dar efeito de card
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3, // Sombra para Android
    },
    searchInput: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 20,
    },
});

export default ListChallenges;

import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Importando a biblioteca de ícones

const ChallengeScreen = () => {
    const [difficulty, setDifficulty] = React.useState(''); // Adicionando estado para dificuldade

    return (
        <View style={styles.container}>
            <View style={styles.challengeContainer}>
                <Image style={styles.image} source={require('../assets/imgs/icon.png')} />
                <View style={styles.textContainer}>
                    <Text style={styles.challengeTitle}>Título do Desafio</Text>
                    <Text style={styles.challengeDescription}>Descrição do desafio</Text>
                    <Text style={styles.difficulty}>Nível de Dificuldade: {difficulty || 'Fácil'}</Text>
                </View>
            </View>
            <View style={styles.buttonContainer}>
                <TextInput 
                    style={styles.searchInput} 
                    placeholder="Pesquisar desafios..." 
                />
                <TouchableOpacity style={styles.btn}>
                    <Icon name="paper-plane" size={20} color="white" />
                </TouchableOpacity>
            </View>
            <View style={styles. challengeDesafiosConcluidos}>
                <Image style={styles.imageCheck} source={require('../assets/imgs/niveis/certo.png')} />
                <View style={styles.textContainer}>
                    <Text style={styles.TitleDesafioConluido}>Título do Desafio</Text>
                    <Text style={styles.difficulty}>Nível de Dificuldade: {difficulty || 'Fácil'}</Text>
                </View>
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
        backgroundColor: '#ffffff', // Fundo branco
    },
    challengeContainer: {
        flexDirection: 'row', // Colocar a imagem à esquerda e o texto à direita
        marginVertical: 20,
        width: '90%',
        alignItems: 'center',
        padding: 20, // Aumentando o padding
        backgroundColor: '#f9f9f9', // Fundo mais claro
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 }, // Aumentando a sombra
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 6,
        borderRadius: 15,
        marginTop: 50,
    },
    textContainer: {
        flex: 1, // Para garantir que o texto ocupe o espaço restante
        marginLeft: 15, // Espaço entre a imagem e o texto
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
        paddingHorizontal: 5,
        width: '100%', // Ajustando a largura do input
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '90%', // Ajustando o tamanho do container
        marginTop: 10, // Adicionando um pequeno espaçamento acima
    },
    btn: {
        backgroundColor: '#4A90E2', // Mudando para azul
        padding: 10, // Ajustando o padding
        height: 40, // Ajustando a altura do botão
        width: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 120,
        marginLeft: 10, // Ajustando o espaçamento entre o botão e o input
    },
    image: {
        width: 100, 
        height: 100,
        marginRight: 15, // Adicionando espaçamento entre a imagem e o texto
    },
    imageCheck: {
        width: 70, 
        height: 70,
        marginRight: 15, // Adicionando espaçamento entre a imagem e o texto
        borderRadius: 15,
    },
    challengeDesafiosConcluidos: {
        flexDirection: 'row', // Colocar a imagem à esquerda e o texto à direita
        marginVertical: 20,
        width: '90%',
        alignItems: 'center',
        padding: 20, // Aumentando o padding
        backgroundColor: '#f9f9f9', // Fundo mais claro
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 }, // Aumentando a sombra
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 6,
        borderRadius: 15,
        marginTop: 50,
        height: 100
    },
    TitleDesafioConluido: {
        fontSize: 18,
        fontWeight: 'bold',
    },
  
});

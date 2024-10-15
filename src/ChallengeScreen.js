import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Dimensions, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const { width } = Dimensions.get('window'); // Obtendo a largura da tela

const challenges = [
    { id: '1', title: 'Desafio 1', description: 'Descrição do Desafio 1', difficulty: 'Fácil' },
    { id: '2', title: 'Desafio 2', description: 'Descrição do Desafio 2', difficulty: 'Médio' },
    { id: '3', title: 'Desafio 3', description: 'Descrição do Desafio 3', difficulty: 'Difícil' },
    { id: '4', title: 'Desafio 4', description: 'Descrição do Desafio 4', difficulty: 'Muito Difícil' },
    // Adicione mais itens conforme necessário
];

const ChallengeScreen = () => {
    const [difficulty, setDifficulty] = React.useState('');

    const renderItem = ({ item }) => (
        <View style={styles.challengeContainer}>
            <Image style={styles.image} source={require('../assets/imgs/icon.png')} />
            <View style={styles.textContainer}>
                <Text style={styles.challengeTitle}>{item.title}</Text>
                <Text style={styles.challengeDescription}>{item.description}</Text>
                <Text style={styles.difficulty}>Nível de Dificuldade: {item.difficulty}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Card do desafio no topo */}
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

            {/* FlatList para exibir a lista de desafios */}
            <FlatList
                data={challenges}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    );
};

export default ChallengeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        paddingTop: 40, // Adicionando um padding-top para evitar sobreposição no topo
    },
    challengeContainer: {
        flexDirection: 'row',
        marginVertical: 10,
        width: '90%', // Usando 90% da largura da tela
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f9f9f9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 6,
        borderRadius: 15,
        marginTop: 10, // Mantendo uma margem para o topo
    },
    textContainer: {
        flex: 1,
        marginLeft: 15,
    },
    challengeTitle: {
        fontSize: width * 0.05, // 5% da largura da tela
        fontWeight: 'bold',
    },
    challengeDescription: {
        fontSize: width * 0.04, // 4% da largura da tela
    },
    difficulty: {
        fontSize: width * 0.035, // 3.5% da largura da tela
        color: 'gray',
    },
    searchInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 5,
        width: '80%', // Ajustando para 80% da largura da tela
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '90%',
        marginVertical: 10,
    },
    btn: {
        backgroundColor: '#4A90E2',
        padding: 10,
        height: 40,
        width: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 120,
        marginLeft: 10,
    },
    image: {
        width: width * 0.25, // 25% da largura da tela
        height: width * 0.25, // Mantendo proporção
        marginRight: 15,
    },
});

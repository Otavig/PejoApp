import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Dimensions, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const { width, height } = Dimensions.get('screen');

const challenges = [
    { id: '1', title: 'Desafio 1', description: 'Descrição do Desafio 1', difficulty: 'Fácil' },
    { id: '2', title: 'Desafio 2', description: 'Descrição do Desafio 2', difficulty: 'Médio' },
    { id: '3', title: 'Desafio 3', description: 'Descrição do Desafio 3', difficulty: 'Difícil' },

];



// Mapeando dificuldades para imagens
const difficultyImages = {
    'Fácil': require('../assets/imgs/icon.png'), // Imagem para desafios fáceis
    'Médio': require('../assets/imgs/icon.png'), // Imagem para desafios médios
    'Difícil': require('../assets/imgs/icon.png'), // Imagem para desafios difíceis
};

const ChallengeScreen = () => {
    const [difficulty, setDifficulty] = React.useState('');

    const renderItem = ({ item }) => (
        <View style={styles.challengeContainer}>
            <Image style={styles.image} source={difficultyImages[item.difficulty]} />
            <View style={styles.textContainer}>
                <Text style={styles.challengeTitle}>{item.title}</Text>
                <Text style={styles.challengeDescription}>{item.description}</Text>
                <Text style={styles.difficulty}>Nível de Dificuldade: {item.difficulty}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.cardContainer}>
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
                    placeholderTextColor="#B0B0B0"
                />
                <TouchableOpacity style={styles.btn}>
                    <Icon name="paper-plane" size={20} color="white" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={challenges}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContainer} // Add a style for the list container
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
        backgroundColor: '#f0f4f8',
        paddingTop: height * 0.05,
        paddingHorizontal: width * 0.05, // Add horizontal padding to the main container
    },
    cardContainer: {
        flexDirection: 'row',
        marginVertical: height * 0.02,
        width: width/1.1, // Use full width of the container
        alignItems: 'center',
        padding: width * 0.05,
        backgroundColor: '#ffffff',
        borderRadius: 15,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        height: height * 0.18, // Increased height for the card
    },
    textContainer: {
        flex: 1,
        marginLeft: width * 0.03,
    },
    challengeTitle: {
        fontSize: width * 0.06,
        fontWeight: 'bold',
        color: '#333',
    },
    challengeDescription: {
        fontSize: width * 0.045,
        color: '#666',
    },
    difficulty: {
        fontSize: width * 0.04,
        color: '#999',
    },
    searchInput: {
        height: height * 0.05,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        width: '80%',
        backgroundColor: '#ffffff',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%', // Use full width for button container
        marginVertical: height * 0.02,
    },
    btn: {
        backgroundColor: '#4A90E2',
        padding: 10,
        height: height * 0.05,
        width: height * 0.05,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        marginLeft: width * 0.02,
    },
    image: {
        width: width * 0.25,
        height: width * 0.25,
        marginRight: width * 0.05,
        borderRadius: 10,
    },
    challengeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
        padding: 10,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        height: height * 0.15, // Ensure the challenge card has a fixed height
        width: width/1.1
    },
    listContainer: {
        paddingBottom: 20, // Space for the bottom of the list
    },
});

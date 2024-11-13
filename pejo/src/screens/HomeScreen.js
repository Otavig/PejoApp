import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, FlatList, PanResponder, Image, Modal, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Icon } from 'react-native-elements';
// import ImageSlider from '../components/ImageSlider'; // Importando o componente ImageSlider

const { width, height } = Dimensions.get('window');
const HomeScreen = ({ route }) => {
    const navigation = useNavigation();
    const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
    const [isChallengeCompleted, setIsChallengeCompleted] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentAdIndex, setCurrentAdIndex] = useState(0);
    const [welcomeVisible, setWelcomeVisible] = useState(true); // Estado para controlar a visibilidade da animação de boas-vindas
    const scrollViewRef = useRef(null);
    const animatedValue = useRef(new Animated.Value(0)).current;
    const [userName, setUserName] = useState(''); // Corrigido para usar setUserName
    
    useEffect(() => {
        const newUserName = route.params?.userName || '';
        console.log(newUserName, route.params)
        setUserName(newUserName); // Atualiza o nome do usuário a partir dos parâmetros da rota
        console.log('Home userName:', newUserName); // Verifique se o nome está sendo recebido corretamente
    }, [route.params]); // Adiciona route.params como dependência

    useEffect(() => {
        // Inicia a animação de boas-vindas
        Animated.timing(animatedValue, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start(() => {
            setTimeout(() => setWelcomeVisible(false), 3000);
        });

    }, []);

    // Adicionando o PanResponder para detectar o gesto de arrastar
    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (evt, gestureState) => {
                return gestureState.dx < -30;
            },
            onPanResponderRelease: () => {
                navigation.navigate('ChatScreen');
            },
        })
    ).current;

    const challenges = [ // Array de desafios
        { title: 'Desafio diário', difficulty: 'Fácil', description: 'Ao conversar com alguém, mantenha o contato visual por pelo menos 5 segundos.' },
        { title: 'Desafio semanal', difficulty: 'Médio', description: 'Cumprimente ou dê um sorriso para 5 pessoas desconhecidas durante o dia.' },
        { title: 'Desafio mensal', difficulty: 'Difícil', description: 'Participe ativamente de uma reunião ou aula dizendo algo ou fazendo uma pergunta.' },
    ];

    const handleNextAd = () => {
        Animated.timing(animatedValue, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start(() => {
            setCurrentChallengeIndex((prevIndex) => (prevIndex + 1) % challenges.length);
            animatedValue.setValue(0);
        });
    };

    const handleCompleteChallenge = () => {
        setIsChallengeCompleted(true); // Marca o desafio como concluído
        setIsModalVisible(true); // Abre o modal
    };

    return (
        <View style={styles.container}>
            {welcomeVisible && (
                <Animated.View style={[styles.welcomeOverlay, { opacity: animatedValue }]}>
                    <Text style={styles.welcomeText}>Bem-vindo, {userName || 'Usuário'}!</Text>
                </Animated.View>
            )}
            <ScrollView
                ref={scrollViewRef}
                {...panResponder.panHandlers}
            >
                {/* Header */}
                <View style={[styles.header, { marginTop: height * 0.05 }]}>
                    <Text style={styles.appName}>Pejo</Text>
                    <View style={styles.headerIcons}>
                        <TouchableOpacity onPress={() => navigation.navigate('ChatScreen')}>
                            <Ionicons name="chatbubble-outline" size={24} color="black" style={styles.icon} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Slider de Imagens */}
                {/* <ImageSlider images={adImages} /> */}

                {/* Daily Challenge Card */}
                <View style={styles.challengeCard}>
                    <Image source={require('../assets/imgs/iconApp.png')} style={styles.challengeImage} />
                    <View style={styles.challengeContent}>
                        <Text style={styles.challengeTitle}>{challenges[currentChallengeIndex].title}</Text>
                        <Text style={styles.challengeDifficulty}>{challenges[currentChallengeIndex].difficulty}</Text>
                        <Text style={styles.challengeDescription}>
                            {challenges[currentChallengeIndex].description}</Text>
                        <Text style={{ marginTop: 20, color: '#0088CC' }}></Text>

                        <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'flex-end' }}>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('ListChallenges')}
                                style={{ padding: 2 }}
                            >
                                <Icon
                                    reverse
                                    name='checklist'
                                    type='octicon'
                                    color='#1f1d85'
                                    size={15} // Tamanho do ícone reduzido
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleCompleteChallenge}
                                style={{ marginLeft: 10, padding: -5 }}
                            >
                                <Icon
                                    reverse
                                    name='check-circle-fill'
                                    type='octicon'
                                    color='#3681d1'
                                    size={15} // Tamanho do ícone reduzido
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                {/* Mover a seta para dentro do card de desafios */}
                <TouchableOpacity style={styles.nextChallengeButton} onPress={handleNextAd}>
                    <Ionicons name="arrow-forward" size={24} color="black" />
                </TouchableOpacity>
                {/* Comemoração se o desafio for concluído */}
                {isChallengeCompleted && (
                    <View style={styles.congratulationsContainer}>
                        <Text style={styles.congratulationsText}>🎉 Parabéns! Desafio concluído! 🎉</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('ChatScreen')}>
                            <Text style={{ marginTop: 20, color: '#0088CC' }}>Abrir chat do desafio</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* New Card for Hiring Services */}
                <View style={styles.serviceCard}>
                    <TouchableOpacity onPress={() => navigation.navigate('ContractScreen')}>
                        <Text style={styles.serviceTitle}>Contratar serviços</Text>
                    </TouchableOpacity>
                </View>


                {/* Categories */}
                {/* <View style={styles.categoryContainer}> 
                    <View style={styles.categoryCard}>
                        <Text style={styles.categoryTitle}>Exercícios</Text>
                    </View>
                    <View style={styles.categoryCard}>
                        <Text style={styles.categoryTitle}>Alimentaço</Text>
                    </View>
                </View> */}

                {/* Modal de Comemoração */}
                <Modal
                    transparent={true}
                    visible={isModalVisible}
                    animationType="slide"
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.congratulationsText}>🎉 Parabéns! Desafio concluído! 🎉</Text>
                            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                                <Text style={{ marginTop: 20, color: '#0088CC' }}>Fechar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#abd4ff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: width * 0.04, // Usando largura da tela para padding
    },
    appName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    headerIcons: {
        flexDirection: 'row',
    },
    icon: {
        marginRight: width * 0, // Usando largura da tela para margem
    },
    challengeCard: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        margin: width * 0.04, // Usando largura da tela para margem
        padding: width * 0.05, // Usando largura da tela para padding
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        marginTop: 10,
    },
    infoIcon: {
        marginRight: width * 0.04, // Usando largura da tela para margem
    },
    challengeContent: {
        flex: 1,
    },
    challengeTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 8,
    },
    challengeDescription: {
        fontSize: 16,
        color: '#555',
        marginTop: 4,
    },
    categoryCard: {
        backgroundColor: '#F7F7F7',
        borderRadius: 12,
        marginBottom: 16,
        width: '45%',
        padding: width * 0.05, // Usando largura da tela para padding
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    challengeImage: {
        width: 95, // largura
        height: 95, // altura
        marginRight: 12, // Espaço entre a imagem e o conteúdo do desafio
        borderRadius: 5, // Bordas levemente arredondadas
    },
    categoryTitle: {
        fontSize: 16,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    subhead: {
        fontSize: 14,
        color: '#555',
        marginTop: 4,
    },
    additionalContent: {
        marginHorizontal: width * 0.04, // Usando largura da tela para margem
        marginBottom: 16,
    },
    mockItem: {
        backgroundColor: '#DDD',
        borderRadius: 8,
        padding: 24,
        marginBottom: 16,
        alignItems: 'center',
    },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#FFF',
        paddingVertical: 8,
        borderTopWidth: 1,
        borderTopColor: '#EEE',
    },
    navItem: {
        alignItems: 'center',
    },
    previousChallengesButton: {
        backgroundColor: '#007BFF', // Cor de fundo do botão
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
        margin: width * 0.04, // Usando largura da tela para margem
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    simpleButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: 'transparent',
        padding: 8,
        alignItems: 'center',
        marginTop: -20,
    },
    nextChallengeButton: {
        borderRadius: 50,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute', // Para posicionar fora do card
        right: width * 0.04, // Ajuste a posição conforme necessário
        top: height * 0.192, // Ajuste a posição conforme necessário
    },
    challengeDifficulty: {
        fontSize: 14,
        color: '#888', // Cor para a dificuldade
        marginTop: 2,
    },
    categoryContainer: {
        flexDirection: 'row', // Para alinhar os cards lado a lado
        justifyContent: 'space-between', // Para espaçar os cards
        marginHorizontal: width * 0.04, // Usando largura da tela para margem
        marginBottom: 16,
    },
    welcomeOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo escuro semi-transparente
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    welcomeContainer: {
        position: 'absolute',
        top: height * 0.4,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 1,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#33fcff',
    },
    sliderItem: {
        width: width * 0.9, // Ajuste a largura conforme necessário
        height: 200, // Ajuste a altura conforme necessário
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center', // Centraliza o item
    },
    sliderImage: {
        width: width * 0.9, // Ajuste a largura conforme necessário
        height: '100%',
        marginHorizontal: 5, // Espaçamento entre os itens
    },
    congratulationsContainer: {
        backgroundColor: '#E0FFE0',
        borderRadius: 12,
        padding: 20,
        margin: width * 0.04,
        alignItems: 'center',
    },
    congratulationsText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo semi-transparente
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    adSlider: {
        marginTop: 20,
        height: 200, // Ajuste a altura conforme necessário
    },
    serviceCard: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        margin: width * 0.04, // Usando largura da tela para margem
        padding: width * 0.05, // Usando largura da tela para padding
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    serviceTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default HomeScreen;

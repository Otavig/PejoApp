import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Modal, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Icon } from 'react-native-elements';
import axios from 'axios';  // Usando o axios para requisições HTTP

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ route }) => {
    const navigation = useNavigation();
    const [challenges, setChallenges] = useState([]);
    const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
    const [isChallengeCompleted, setIsChallengeCompleted] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [userName, setUserName] = useState('');
    const scrollViewRef = useRef(null);
    const animatedValue = useRef(new Animated.Value(0)).current;
    const [welcomeVisible, setWelcomeVisible] = useState(true); 

    useEffect(() => {
        const newUserName = route.params?.userName || '';
        setUserName(newUserName);
    }, [route.params]);

    useEffect(() => {
        // Inicia a animação de boas-vindas
        Animated.timing(animatedValue, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start(() => {
            setTimeout(() => setWelcomeVisible(false), 3000);
        });

        // Buscar os desafios do servidor
        fetchChallenges();
    }, []);

    const fetchChallenges = async () => {
        const userId = await AsyncStorage.getItem('userId'); // Supondo que você armazene o userId no AsyncStorage
        try {
            const response = await axios.get(`http://localhost:3000/desafios?userId=${userId}`);
            setChallenges(response.data);  // Armazena os desafios no estado
        } catch (error) {
            console.error('Erro ao buscar desafios', error);
        }
    };
    
    
    const handleNextChallenge = () => {
        setCurrentChallengeIndex((prevIndex) => (prevIndex + 1) % challenges.length);
    };

    const handleCompleteChallenge = () => {
        setIsChallengeCompleted(true);
        setIsModalVisible(true);
    };

    return (
        <View style={styles.container}>
            {welcomeVisible && (
                <Animated.View style={[styles.welcomeOverlay, { opacity: animatedValue }]}>
                    <Text style={styles.welcomeText}>Bem-vindo, {userName || 'Usuário'}!</Text>
                </Animated.View>
            )}
            <ScrollView ref={scrollViewRef}>
                {/* Header */}
                <View style={[styles.header, { marginTop: height * 0.05 }]}>
                    <Text style={styles.appName}>Pejo</Text>
                    <View style={styles.headerIcons}>
                        <TouchableOpacity onPress={() => navigation.navigate('ChatScreen')}>
                            <Ionicons name="chatbubble-outline" size={24} color="black" style={styles.icon} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Daily Challenge Card */}
                {challenges.length > 0 && (
                    <View style={styles.challengeCard}>
                        <View style={styles.challengeContent}>
                            <Text style={styles.challengeTitle}>{challenges[currentChallengeIndex].titulo}</Text>
                            <Text style={styles.challengeDifficulty}>{challenges[currentChallengeIndex].dificuldade}</Text>
                            <Text style={styles.challengeDescription}>
                                {challenges[currentChallengeIndex].descricao}
                            </Text>

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
                                        size={15}
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
                                        size={15}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}

                {/* Next Challenge Button */}
                <TouchableOpacity style={styles.nextChallengeButton} onPress={handleNextChallenge}>
                    <Ionicons name="arrow-forward" size={24} color="black" />
                </TouchableOpacity>

                {/* Challenge Completion Modal */}
                <Modal transparent={true} visible={isModalVisible} animationType="slide">
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
        padding: width * 0.04,
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
        marginRight: width * 0,
    },
    challengeCard: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        margin: width * 0.04,
        padding: width * 0.05,
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
    challengeDifficulty: {
        fontSize: 14,
        color: '#888',
        marginTop: 2,
    },
    nextChallengeButton: {
        borderRadius: 50,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        right: width * 0.04,
        top: height * 0.192,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
    },
    congratulationsText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
});

export default HomeScreen;

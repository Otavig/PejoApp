import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Modal, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Icon } from 'react-native-elements';
import axios from 'axios'; 
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ route }) => {
    const navigation = useNavigation();
    const [challenges, setChallenges] = useState([]);
    const [currentChallenge, setCurrentChallenge] = useState(null);
    const [completedChallenges, setCompletedChallenges] = useState([]); // IDs dos desafios completados
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [userName, setUserName] = useState('');
    const [userLevel, setUserLevel] = useState(0); // Novo estado para o nível do usuário
    const [isCompleteButtonVisible, setIsCompleteButtonVisible] = useState(true);  // Novo estado
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

        // Carregar o nível do usuário do AsyncStorage
        loadUserLevel();
    }, []);

    const loadUserLevel = async () => {
        const storedLevel = await AsyncStorage.getItem('userLevel');
        if (storedLevel) {
            setUserLevel(parseInt(storedLevel));
        } else {
            // Se não existir nível armazenado, define como 0
            setUserLevel(0);
        }
    };

    const fetchChallenges = async () => {
        const userId = await AsyncStorage.getItem('userId'); 
        try {
            const response = await axios.get(`http://192.168.0.102:3000/desafios?userId=${userId}`);
            setChallenges(response.data); 
            await AsyncStorage.setItem('userId', userId);
            assignDailyChallenge(response.data);
        } catch (error) {
            console.error('Erro ao buscar desafios', error);
        }
    };

    const assignDailyChallenge = async (allChallenges) => {
        const today = new Date().toDateString();
        const storedDate = await AsyncStorage.getItem('dailyChallengeDate');

        if (storedDate === today) {
            // Se já tiver um desafio atribuído para hoje, apenas carrega ele
            const savedChallenge = await AsyncStorage.getItem('dailyChallenge');
            if (savedChallenge) {
                setCurrentChallenge(JSON.parse(savedChallenge));
            }
        } else {
            // Atribui um novo desafio para o dia
            const randomChallenge = getRandomChallenge(allChallenges);
            setCurrentChallenge(randomChallenge);
            await AsyncStorage.setItem('dailyChallenge', JSON.stringify(randomChallenge));
            await AsyncStorage.setItem('dailyChallengeDate', today);
        }

        // Verificar se o desafio já foi concluído
        const completed = await AsyncStorage.getItem('completedChallenges');
        if (completed) {
            setCompletedChallenges(JSON.parse(completed));
        }
    };

    const getRandomChallenge = (allChallenges) => {
        const easyChallenges = allChallenges.filter(challenge => challenge.dificuldade === 'facil');
        const mediumChallenges = allChallenges.filter(challenge => challenge.dificuldade === 'medio');
        const hardChallenges = allChallenges.filter(challenge => challenge.dificuldade === 'dificil');

        // Mistura os desafios para dar uma chance igual para todos
        const allAvailableChallenges = [...easyChallenges, ...mediumChallenges, ...hardChallenges];
        return allAvailableChallenges[Math.floor(Math.random() * allAvailableChallenges.length)];
    };

    const handleCompleteChallenge = async () => {
        const completedChallengesList = [...completedChallenges, currentChallenge.id];
        setCompletedChallenges(completedChallengesList);
        AsyncStorage.setItem('completedChallenges', JSON.stringify(completedChallengesList));
    
        // Atualizar o nível do usuário localmente
        let newUserLevel = userLevel + 10;  // Adiciona 10 de nível imediatamente
        setUserLevel(newUserLevel);
        await AsyncStorage.setItem('userLevel', newUserLevel.toString());
    
        // Atualizar o nível no backend (chamando a API)
        const userId = await AsyncStorage.getItem('userId');
        try {
            await axios.put(`http://192.168.0.102:3000/upUser/${userId}`, {
                nivelNovo: 10 // Envia a quantidade de nível a ser somado
            });
        } catch (error) {
            console.error('Erro ao atualizar o nível no servidor:', error);
        }
    
        // Iniciar contagem para adicionar mais 20 após 2 horas
        setTimeout(async () => {
            const newLevelAfterTwoHours = newUserLevel + 20;  // Após 2 horas, adiciona mais 20 de nível
            setUserLevel(newLevelAfterTwoHours);
            await AsyncStorage.setItem('userLevel', newLevelAfterTwoHours.toString());
    
            // Atualiza o nível novamente no backend
            try {
                await axios.put(`http://192.168.0.102:3000/upUser/${userId}`, {
                    nivelNovo: 20 // Envia a quantidade de nível a ser somado após 2 horas
                });
            } catch (error) {
                console.error('Erro ao atualizar o nível no servidor após 2 horas:', error);
            }
        }, 2 * 60 * 60 * 1000);  // 2 horas em milissegundos
    
        // Remove o desafio concluído do "desafio do dia"
        setIsModalVisible(true);
        AsyncStorage.removeItem('dailyChallenge');  // Limpa o desafio atual
        setCurrentChallenge(null); // Reseta o desafio atual após a conclusão
        setIsCompleteButtonVisible(false); // Esconde o botão de completar
    };    

    return (
        <LinearGradient colors={["#FFFDFF", "#FFFDFF"]} style={[styles.projectCardGradient, { flex: 1 }]}>
            <View style={styles.container}>
                {welcomeVisible && (
                    <Animated.View style={[styles.welcomeOverlay, { opacity: animatedValue }]} >
                        <Text style={styles.welcomeText}>Bem-vindo, {userName || 'Usuário'}!</Text>
                    </Animated.View>
                )}
                <ScrollView ref={scrollViewRef}>
                    <View style={styles.header}>
                        <Text style={styles.greeting}>Pejo</Text>
                        <TouchableOpacity style={styles.icon} onPress={() => navigation.navigate('ChatScreen')}>
                            <Ionicons name="chatbubble-outline" size={28} color="white" />
                        </TouchableOpacity>
                    </View>

                    {/* Challenge Card */}
                    {currentChallenge && (
                        <View style={styles.challengeCard}>
                            <View style={styles.challengeContent}>
                                <Text style={styles.challengeTitle}>{currentChallenge.titulo}</Text>
                                <Text style={styles.challengeDifficulty}>{currentChallenge.dificuldade}</Text>
                                <Text style={styles.challengeDescription}>
                                    {currentChallenge.descricao}
                                </Text>
                                {/* Condicional para exibir ou não o botão de "Concluir" */}
                                {isCompleteButtonVisible && (
                                    <TouchableOpacity onPress={handleCompleteChallenge} style={styles.completeButton}>
                                        <Icon reverse name="check-circle-fill" type="octicon" color="#3681d1" size={15} />
                                        <Text style={{ marginLeft: 8, fontSize: 16, color: '#3681d1' }}>Concluir</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    )}

                    {/* Task Section */}
                    <View style={styles.tasks}>
                        <Text style={styles.sectionTitle}>Concluídos 🤠</Text>
                        {completedChallenges.length > 0 ? (
                            completedChallenges.map((challengeId) => {
                                const completedChallenge = challenges.find(challenge => challenge.id === challengeId);
                                return (
                                    <View style={styles.taskItem} key={challengeId}>
                                        <Text style={styles.taskText}>{completedChallenge.titulo}</Text>
                                        <Ionicons name="checkmark-circle-outline" size={24} color="#4CAF50" />
                                    </View>
                                );
                            })
                        ) : (
                            <Text style={styles.noTasks}>Nenhum desafio concluído ainda.</Text>
                        )}
                    </View>

                    <Modal transparent={true} visible={isModalVisible} animationType="slide">
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text style={styles.congratulationsText}>🎉 Parabéns! Você completou um desafio!</Text>
                                <Text style={styles.levelText}>Seu nível: {userLevel}</Text>
                                <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.closeModalButton}>
                                    <Text style={styles.closeModalButtonText}>Fechar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </ScrollView>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    projectCardGradient: {
        flex: 1, // Garante que o gradiente ocupe toda a tela
    },
    header: {
        backgroundColor: '#3681d1',
        padding: 40,
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
    },
    greeting: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "bold",
    },
    subtitle: {
        color: "#b0b0b0",
        marginTop: 5,
        fontSize: 16,
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
        position: "absolute",
        top: 25,
        right: 30,
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
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    tasks: {
        padding: 20,
    },
    taskItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        elevation: 3,
    },
    taskText: {
        fontSize: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    projectCardGradient: {
        padding: 0,
    },
    customServicesButton: {
        backgroundColor: '#3681d1',
        padding: 15,
        borderRadius: 50,
        margin: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    buttonImage: {
        width: 30,
        height: 30,
        marginRight: 10,
    },
    buttonText: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
    },
});

export default HomeScreen;

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Modal, Animated, Image, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Icon } from 'react-native-elements';
import axios from 'axios';  // Usando o axios para requisições HTTP
import { LinearGradient } from "expo-linear-gradient";
import ChallengeSlider from '../components/DesafioSlider';

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
            const response = await axios.get(`http://192.168.0.102:3000/desafios?userId=${userId}`);
            setChallenges(response.data);  // Armazena os desafios no estado
        } catch (error) {
            console.error('Erro ao buscar desafios', error);
        }
        await AsyncStorage.setItem('userId', userId); // Salva o userId no AsyncStorage
    };


    const handleNextChallenge = () => {
        setCurrentChallengeIndex((prevIndex) => (prevIndex + 1) % challenges.length);
    };

    const handleCompleteChallenge = () => {
        setIsChallengeCompleted(true);
        setIsModalVisible(true);
    };

    return (
        <LinearGradient colors={["#FFFDFF", "#FFFDFF"]} style={[styles.projectCardGradient, { flex: 1 }]}>

            <View style={styles.container}>
                {welcomeVisible && (
                    <Animated.View style={[styles.welcomeOverlay, { opacity: animatedValue }]}>
                        <Text style={styles.welcomeText}>Bem-vindo, {userName || 'Usuário'}!</Text>
                    </Animated.View>
                )}
                <ScrollView ref={scrollViewRef}>
                    {/* Header */}
                    <View style={[styles.header, { marginBottom: "5%" }]}>
                        <Text style={styles.greeting}>Pejo</Text>
                        <TouchableOpacity style={styles.icon} onPress={() => navigation.navigate('ChatScreen')}>
                            <Ionicons style={{ position: "relative", marginTop: "55%" }} name="chatbubble-outline" size={30} color="white" />
                        </TouchableOpacity>
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
                                        onPress={handleCompleteChallenge}
                                        style={{ marginLeft: 10, padding: -5, flexDirection: 'row', alignItems: 'center' }} // Flex para alinhar ícone e texto
                                    >
                                        <Icon
                                            reverse
                                            name='check-circle-fill'
                                            type='octicon'
                                            color='#3681d1'
                                            size={15}
                                        />
                                        <Text style={{ marginLeft: 8, fontSize: 16, color: '#3681d1' }}>Concluir</Text> 
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </View>
                    )}

                    {/* Custom Services Button */}
                    <TouchableOpacity
                        style={styles.customServicesButton}
                        onPress={() => console.log("Contratar serviços personalizados")}
                    >
                        <Text style={styles.buttonText}>Contratar serviços personalizados</Text>
                    </TouchableOpacity>


                    {/* Task Section */}
                    <View style={styles.tasks}>
                        <Text style={styles.sectionTitle}>Concluidos 🤠</Text>
                        <View style={styles.taskItem}>
                            <Text style={styles.taskText}>Create menu in dashboard</Text>
                            <Ionicons name="checkmark-circle-outline" size={24} color="#4CAF50" />
                        </View>
                        <View style={styles.taskItem}>
                            <Text style={styles.taskText}>Make & send prototype to the client</Text>
                            <Ionicons name="ellipse-outline" size={24} color="#b0b0b0" />
                        </View>
                    </View>

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

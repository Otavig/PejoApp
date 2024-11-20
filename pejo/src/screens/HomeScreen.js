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
    const [challenges, setChallenges] = useState([]); // Todos os desafios
    const [currentChallenge, setCurrentChallenge] = useState(null); // Desafio do dia
    const [completedChallenges, setCompletedChallenges] = useState([]); // Desafios completados (detalhados)
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [userName, setUserName] = useState('');
    const [userLevel, setUserLevel] = useState(0);
    const [isCompleteButtonVisible, setIsCompleteButtonVisible] = useState(true); // Para controlar visibilidade
    const scrollViewRef = useRef(null);
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const newUserName = route.params?.userName || '';
        setUserName(newUserName);
    }, [route.params]);

    useEffect(() => {
        listDesafiosFeitos(); // Buscar os desafios concluídos quando a tela for carregada
        fetchChallenges(); // Carregar os desafios ao montar a tela
        // checkAllChallengesCompleted(); // Verificar se todos os desafios foram completados
    }, []); // Use uma dependência vazia para garantir que execute uma única vez na montagem do componente    


    // Função que verifica se todos os desafios foram completados
    const checkAllChallengesCompleted = async () => {
        const completedChallengesList = await AsyncStorage.getItem('completedChallenges');
        const completedChallengesArray = completedChallengesList ? JSON.parse(completedChallengesList) : [];

        // Verificar se todos os desafios foram completados
        if (completedChallengesArray.length === challenges.length) {
            resetChallenges(); // Resetar tudo se todos os desafios foram completados
        }
    };

    // Função listar os desafios
    const listDesafiosFeitos = async () => {
        try {
            const userId = await AsyncStorage.getItem('userId');

            // Obter os desafios completados do backend
            const responseFeitos = await axios.get(`http://192.168.0.102:3000/desafios/feitos?userId=${userId}`);

            // Obter todos os desafios disponíveis
            const responseDesafios = await axios.get(`http://192.168.0.102:3000/desafios`);

            // Filtrar os desafios completados com base nos IDs retornados
            const completedChallengeIds = responseFeitos.data.completedChallenges;  // Ex: [2, 3]

            // Filtrar os desafios que estão concluídos
            const completedChallengesData = responseDesafios.data.filter(challenge =>
                completedChallengeIds.includes(challenge.id)
            );

            // Atualizar o estado de completedChallenges com os desafios completados
            setCompletedChallenges(completedChallengesData);

        } catch (error) {
            console.error('Erro ao listar desafios feitos', error);
        }
    };

    // Função que verifica se o usuário pode pegar um novo desafio
    const checkIfCanTakeNewChallenge = async () => {
        const userId = await AsyncStorage.getItem('userId');
    
        try {
            // Requisição para pegar a última data
            const response = await axios.get(`http://192.168.0.102:3000/ultimaData?userId=${userId}`);
            // console.log(response.data);
    
            // Pega a data que foi retornada pela API
            const lastChallengeDate = new Date(response.data.date);
    
            // Pega a data atual
            const currentDate = new Date();
    
            // Zera as horas, minutos, segundos e milissegundos para comparar apenas as datas
            lastChallengeDate.setHours(0, 0, 0, 0);
            currentDate.setHours(0, 0, 0, 0);
    
            // Calcula a diferença em dias
            const timeDifference = currentDate - lastChallengeDate;
            const daysDifference = timeDifference / (1000 * 3600 * 24); // Converte de milissegundos para dias
            console.log(timeDifference, daysDifference)
    
            // Verifica se passou mais de 1 dia
            if (daysDifference > 1) {
                return true; // Pode pegar um novo desafio
            } else {
                return false; // Não pode pegar um novo desafio
            }
        } catch (error) {
            console.error('Erro ao verificar se o usuário pode pegar um novo desafio', error);
            return false; // Caso ocorra um erro, assume que não pode pegar novos desafios
        }
    };    

    // Função que reseta os desafios
    const resetChallenges = async () => {
        try {
            // Recuperar o userId do AsyncStorage
            const userId = await AsyncStorage.getItem('userId');
    
            // Buscar todos os desafios disponíveis na rota /desafios
            const response = await axios.get('http://192.168.0.102:3000/desafios');
            const allChallenges = response.data; // Todos os desafios disponíveis
            const completedChallenges = JSON.parse(await AsyncStorage.getItem('completedChallenges')) || []; // Desafios completados
    
            // Verificar se todos os desafios foram completados
            const allCompleted = allChallenges.every(challenge => completedChallenges.includes(challenge.id));
    
            if (allCompleted) {
                // Caso todos os desafios tenham sido completados, resetar os dados
    
                // Deletar os desafios completados no backend (resetar os dados)
                await axios.post(`http://192.168.0.102:3000/reset-desafios-feitos?userId=${userId}`);
    
                // Resetar os dados no AsyncStorage
                await AsyncStorage.setItem('completedChallenges', JSON.stringify([])); // Limpar lista de desafios concluídos
                await AsyncStorage.setItem('lastCompletionDate', ''); // Resetar data de conclusão
    
                // Limpar o nível do usuário ou resetar se necessário
                setUserLevel(0); // ou defina como quiser, dependendo da lógica do seu app
                await AsyncStorage.setItem('userLevel', '0'); // Resetando o nível
    
                // Resetar os desafios diários
                AsyncStorage.removeItem('dailyChallenge');
    
                // Atualizar os desafios no estado
                setCompletedChallenges([]);
                setCurrentChallenge(null);
    
                // Após resetar, chamar a função que carrega novos desafios
                fetchChallenges(); // Recarregar os desafios para o estado
            } else {
                console.log("Nem todos os desafios foram concluídos. Não é possível reiniciar.");
            }
        } catch (error) {
            console.error('Erro ao resetar desafios', error);
        }
    };    

    // Carregar o nível do usuário
    const loadUserLevel = async () => {
        const storedLevel = await AsyncStorage.getItem('userLevel');
        if (storedLevel) {
            setUserLevel(parseInt(storedLevel));
        } else {
            setUserLevel(0);
        }
    };

    // Carregar a visibilidade do botão
    const checkButtonVisibility = async () => {
        const completedChallengesString = await AsyncStorage.getItem('completedChallenges');
        const completedChallengesList = completedChallengesString ? JSON.parse(completedChallengesString) : [];

        // Atualiza a lista de desafios concluídos
        setCompletedChallenges(completedChallengesList);

        // Verificar se o desafio de hoje foi completado
        const today = new Date().toDateString();
        const lastCompletionDate = await AsyncStorage.getItem('lastCompletionDate');

        if (lastCompletionDate === today) {
            setIsCompleteButtonVisible(false); // Esconde o botão se o desafio já foi completado
        } else {
            setIsCompleteButtonVisible(true); // Mostra o botão se não foi completado
        }
    };

    // Buscar os desafios
    const fetchChallenges = async () => {
        try {
            const response = await axios.get('http://192.168.0.102:3000/desafios');
            setChallenges(response.data);
            assignDailyChallenge(); // Atribui o desafio do dia
        } catch (error) {
            console.error('Erro ao buscar desafios', error);
        }
    };

    const assignDailyChallenge = async () => {
        const dailyChallenge = await AsyncStorage.getItem('dailyChallenge');

        if (dailyChallenge) {
            setCurrentChallenge(JSON.parse(dailyChallenge)); // Se já existe um desafio diário salvo, atribuí-lo
        } else {
            const completedChallengesList = completedChallenges.map(challenge => challenge.id);
            const uncompletedChallenges = challenges.filter(challenge =>
                !completedChallengesList.includes(challenge.id)
            );

            if (uncompletedChallenges.length > 0) {
                const selectedChallenge = uncompletedChallenges[Math.floor(Math.random() * uncompletedChallenges.length)];
                setCurrentChallenge(selectedChallenge);
                AsyncStorage.setItem('dailyChallenge', JSON.stringify(selectedChallenge)); // Armazene o desafio diário
            }
        }
    };

    // Finalizar o desafio
    const handleCompleteChallenge = async () => {
        const completedChallengesList = [...completedChallenges, currentChallenge.id];
        setCompletedChallenges(completedChallengesList);
        AsyncStorage.setItem('completedChallenges', JSON.stringify(completedChallengesList));

        // Atualizar o nível do usuário
        let newUserLevel = userLevel + 10; // Adiciona 10 de nível
        setUserLevel(newUserLevel);
        await AsyncStorage.setItem('userLevel', newUserLevel.toString());

        // Registrar a conclusão do desafio
        const userId = await AsyncStorage.getItem('userId');
        const today = new Date().toDateString();
        try {
            await axios.post('http://192.168.0.102:3000/desafios/concluir', {
                userId,
                challengeId: currentChallenge.id,
                completionDate: today
            });
        } catch (error) {
            console.error('Erro ao registrar a conclusão do desafio', error);
        }

        // Atualizar a data de conclusão no AsyncStorage
        await AsyncStorage.setItem('lastCompletionDate', today);

        // Exibir o modal de conclusão
        setIsModalVisible(true);

        // Limpar o desafio do dia
        AsyncStorage.removeItem('dailyChallenge');
        setIsCompleteButtonVisible(false); // Esconde o botão após completar o desafio

        // Atualizar a lista de desafios concluídos para refletir os dados completos
        fetchCompletedChallenges();  // Recarrega os desafios concluídos com detalhes completos
    };

    // Buscar os desafios completados
    const fetchCompletedChallenges = async () => {
        const userId = await AsyncStorage.getItem('userId');
        try {
            const response = await axios.get(`http://192.168.0.102:3000/desafios/feitos/?userId=${userId}`);
            const completedChallengeIds = Array.isArray(response.data.completedChallenges) ? response.data.completedChallenges : JSON.parse(response.data.completedChallenges || '[]');
            const completedChallengesData = challenges.filter(challenge =>
                completedChallengeIds.includes(challenge.id)
            );
            setCompletedChallenges(completedChallengesData); // Atualiza com os dados dos desafios concluídos
        } catch (error) {
            console.error('Erro ao buscar desafios concluídos', error);
        }
    };

    useEffect(() => {
        fetchChallenges(); // Buscar os desafios quando a tela for carregada
        // checkAllChallengesCompleted(); // Verificar se todos os desafios foram concluídos
    }, [challenges]); // Adicione 'challenges' como dependência para verificar se novos desafios foram carregados

    // Chamada dessa função no useEffect para verificar na carga da tela
useEffect(() => {
    checkIfCanTakeNewChallenge().then(canTakeNewChallenge => {
        if (canTakeNewChallenge) {
            fetchChallenges(); // Carregar novos desafios
        } else {
            // Mostrar mensagem ou lógica de que não pode pegar novos desafios
            setIsCompleteButtonVisible(false)
            alert('Você precisa esperar 1 dia para pegar um novo desafio.');
        }
    });
}, []);

    return (
        <LinearGradient colors={["#FFFDFF", "#FFFDFF"]} style={[styles.projectCardGradient, { flex: 1 }]} >
            <View style={styles.container}>
                <ScrollView ref={scrollViewRef}>
                    <View style={styles.header}>
                        <Text style={styles.greeting}>Pejo</Text>
                        <TouchableOpacity style={styles.icon} onPress={() => navigation.navigate('ChatScreen')}>
                            <Ionicons name="chatbubble-outline" size={28} color="white" />
                        </TouchableOpacity>
                    </View>

                    {/* Card do Desafio */}
                    {currentChallenge && (
                        <View style={styles.challengeCard}>
                            <View style={styles.challengeContent}>
                                <Text style={styles.challengeTitle}>{currentChallenge.titulo}</Text>
                                <Text style={styles.challengeDifficulty}>{currentChallenge.dificuldade}</Text>
                                <Text style={styles.challengeDescription}>
                                    {currentChallenge.descricao}
                                </Text>
                                {/* Exibe o botão de "Concluir" se não for completado */}
                                {isCompleteButtonVisible && (
                                    <TouchableOpacity onPress={handleCompleteChallenge} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', width: '100%' }}>
                                        <Icon reverse name="check-circle-fill" type="octicon" color="#3681d1" size={15} />
                                        <Text style={{ fontSize: 16, color: '#3681d1' }}>Concluir</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    )}

                    <View style={styles.buttonContainerMid}>
                        <TouchableOpacity style={styles.buttonMid} onPress={() => navigation.navigate('OpportunityScreen')}>
                            <Text style={styles.buttonTextMid}>Contratar Serviços</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Lista de Desafios Concluídos */}
                    <View style={styles.tasks}>
                        <Text style={styles.sectionTitle}>Concluídos 🤠</Text>
                        {completedChallenges.length > 0 ? (
                            completedChallenges.map((completedChallenge, index) => {
                                return (
                                    <View style={styles.taskItem} key={completedChallenge.id || index}>
                                        <Text style={styles.taskText}>{completedChallenge.titulo}</Text>
                                        <Ionicons name="checkmark-circle-outline" size={24} color="#4CAF50" />
                                    </View>
                                );
                            })
                        ) : (
                            <Text style={styles.noTasks}>Nenhum desafio concluído ainda.</Text>
                        )}
                    </View>

                    {/* Modal de Conclusão */}
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
        marginBottom: '10%'
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
        top: height / 18,  // Ajuste com base no tamanho do ícone (25 é um exemplo)
        left: width / 1.18,  // Ajuste com base no tamanho do ícone (25 é um exemplo)
        // Caso queira o ícone no canto superior direito
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
        textTransform: "uppercase"
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
    closeModalButtonText: {
        fontSize: 16,
        marginTop: 20
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
    buttonContainerMid: {
        alignItems: 'center',
        marginVertical: 20,
    },
    buttonMid: {
        width: "80%",
        backgroundColor: '#3681d1', // Cor de fundo do botão
        paddingVertical: 15,        // Espaçamento vertical
        paddingHorizontal: 30,      // Espaçamento horizontal
        borderRadius: 25,           // Bordas arredondadas
        elevation: 5,               // Sombra para Android
        shadowColor: '#000',        // Cor da sombra para iOS
        shadowOffset: { width: 0, height: 2 }, // Offset da sombra
        shadowOpacity: 0.2,         // Opacidade da sombra
        shadowRadius: 2.5,          // Raio da sombra
    },
    buttonTextMid: {
        color: '#FFFFFF',           // Cor do texto
        fontSize: 16,               // Tamanho da fonte
        textAlign: 'center',        // Centraliza o texto
        fontWeight: 'bold',         // Texto em negrito
    },
});

export default HomeScreen;

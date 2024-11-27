import React, { useState, useEffect, useRef } from 'react';
import { ActivityIndicator } from 'react-native';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Modal, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Icon } from 'react-native-elements';
import axios from 'axios';
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ route }) => {
    const [idUser, setIdUser] = useState(null);
    const navigation = useNavigation();
    const scrollViewRef = useRef(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [desafioAtual, setDesafioAtual] = useState(null); // Desafio do dia
    const [botaoCompletarVisibilidade, setBotaoCompletarVisibilidade] = useState(false); // Visibilidade do botão de concluir
    const [loading, setLoading] = useState(true); // Inicializa como true para indicar que está carregando
    const [desafiosCompletos, setDesafiosCompletos] = useState([])

    // Buscar desafios
    const buscarDesafios = async () => {
        try {
            const resposta = await axios.get('http://192.168.0.102:3000/getDesafios');
            return resposta.data;
        } catch (error) {
            console.error('Erro ao buscar desafios', error);
            return [];
        }
    };

    // Buscar última data
    const buscarUltimaData = async () => {
        try {
            if (idUser) {
                const respostaUltimaData = await axios.get(`http://192.168.0.102:3000/ultimaData/${idUser}`);
                return respostaUltimaData;
            }
        } catch (error) {
            console.error('Erro ao buscar última data', error);
        }
    };

    const verificarData = async () => {
        const ultimaDataRegistrada = await buscarUltimaData();
        const hoje = new Date();
        const dataHojeFormatada = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());

        if (ultimaDataRegistrada) {
            const ultimaData = new Date(ultimaDataRegistrada.date); // Converte para o formato de data
            const ultimaDataFormatada = new Date(ultimaData.getFullYear(), ultimaData.getMonth(), ultimaData.getDate());

            // console.log('Hoje:', dataHojeFormatada);
            // console.log('Última Data:', ultimaDataFormatada);

            if (dataHojeFormatada.getTime() === ultimaDataFormatada.getTime()) {
                return true;
            }
        }
        return false;
    };

    // Buscar desafios realizados pelo usuário
    const buscarDesafiosFeitos = async () => {
        try {
            const respostaFeitos = await axios.get(`http://192.168.0.102:3000/desafios/feitos?userId=${idUser}`);
            const desafiosFeitosIds = JSON.parse(respostaFeitos.data.desafiosConcluidos || '[]'); // Parse IDs

            // Busque detalhes dos desafios concluídos
            const desafiosDetalhesPromises = desafiosFeitosIds.map(id =>
                axios.get(`http://192.168.0.102:3000/intra/getDesafio/${id}`)
            );

            const desafiosDetalhes = await Promise.all(desafiosDetalhesPromises);

            // Mapeie os dados dos desafios concluídos
            const desafiosConcluidosDetalhes = desafiosDetalhes.map(res => res.data);

            setDesafiosCompletos(desafiosConcluidosDetalhes);
            return respostaFeitos.data.desafiosConcluidos;
        } catch (error) {
            console.error('Erro ao buscar desafios feitos:', error);
            setDesafiosCompletos([]); // Reseta caso haja erro
        }
    };

    // Verifica e retorna os desafios não realizados
    const verificarDesafiosDisponiveis = async () => {
        try {
            // Buscando todos os desafios e os desafios já feitos
            const respostaDeTodosOsDesafios = await buscarDesafios();
            const respostaDesafiosFeitos = await buscarDesafiosFeitos();


            // Suponha que respostaDesafiosFeitos seja uma string, então convertemos ela para um array de números
            const desafiosFeitos = respostaDesafiosFeitos; // [7, 8]

            // Filtramos os desafios que ainda não foram feitos
            const desafiosNaoFeitos = respostaDeTodosOsDesafios.filter(desafio => !desafiosFeitos.includes(desafio.id));

            // Caso todos os desafios tenham sido feitos, resetamos os desafios feitos
            if (desafiosNaoFeitos.length === 0) {
                await resetarDesafiosFeitos(idUser); // Função para resetar os desafios no backend
                return 'Todos os desafios foram feitos. Desafios resetados.';
            }

            // Retornamos um array com os ids dos desafios não feitos
            const idsDesafiosNaoFeitos = desafiosNaoFeitos.map(desafio => desafio.id);
            return idsDesafiosNaoFeitos;
        } catch (error) {
            console.error('Erro ao verificar desafios disponíveis:', error);
            throw new Error('Falha ao verificar desafios disponíveis.');
        }
    };

    const salvarUltimoDesafioMontado = async (desafioMontado) => {
        try {
            const hoje = new Date();
            const dataHoje = hoje.toISOString().split('T')[0]; // Formato "YYYY-MM-DD"

            // Salvar o desafio montado e a data no AsyncStorage
            await AsyncStorage.setItem('desafioMontado', JSON.stringify({ desafioId: desafioMontado, data: dataHoje }));

            await axios.put(`http://192.168.0.102:3000/user/${idUser}/desafio/${desafioMontado.id}`)

            console.log('Desafio montado salvo com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar o último desafio montado', error);
        }
    };

    const pegarUltimoDesafioMontado = async (idUsuario) => {
        try {
            const respostaBuscaMontado = await axios.get(`http://192.168.0.102:3000/ultimoDesafioMontado/${idUsuario}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // A resposta já será tratada como JSON
            const resultado = await axios.get(`http://192.168.0.102:3000/intra/getDesafio/${respostaBuscaMontado.data.ultimoDesafioRealizado}`);

            // Atualiza o estado com o desafio anterior
            setDesafioAtual(resultado.data);
            return resultado.data
        } catch (error) {
            console.error('Erro ao buscar o último desafio montado', error);
        }
    }

    const concluirDesafio = async (idDesafio) => {
        try {
            // Exibir botão
            setBotaoCompletarVisibilidade(false);
            setIsModalVisible(true);
            const hoje = new Date().toISOString().split('T')[0]; // Converte para o formato 'YYYY-MM-DD'.

            const marcarDataResponse = await axios.put(`http://192.168.0.102:3000/ultimaData/marcar/${idUser}/${hoje}`);

            console.log("Marcar data response:", marcarDataResponse.data);

            // Segundo PUT
            const concluirResponse = await axios.put(`http://192.168.0.102:3000/desafios/concluir/${idUser}/${idDesafio}`);
            console.log("Concluir desafio response:", concluirResponse.data);

            await novoLevelConcluido(20);

        } catch (error) {
            console.error("Erro ao concluir desafio:", error.message, error.response?.data);
            throw error; // Repassa o erro para tratamento adicional
        }
    };

    // Função para resetar os desafios feitos no backend
    const resetarDesafiosFeitos = async (usuarioID) => {
        try {
            // Lógica para resetar os desafios no backend
            await axios.post(`http://192.168.0.102:3000/reset-desafios-feitos/${usuarioID}}`)
        } catch (error) {
            console.error('Erro ao resetar os desafios:', error);
            throw new Error('Falha ao resetar os desafios.');
        }
    };

    const novoLevelConcluido = async (quantia) => {
        try {
            // Envia a requisição para atualizar o nível do usuário
            const response = await axios.put(`http://192.168.0.102:3000/upUser/${idUser}/${quantia}`);

            console.log('Resposta do servidor (Nível atualizado):', response.data);
        } catch (error) {
            console.error('Erro ao concluir desafio:', error);
        }
    };


    // Sortear um desafio a pessoa
    const sortearDesafios = async () => {
        const desafiosDisponiveis = await verificarDesafiosDisponiveis();
        // Exemplo: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, ...]

        // Sorteando um número aleatório entre os índices do array
        const indiceSorteado = Math.floor(Math.random() * desafiosDisponiveis.length);

        // Obtendo o número sorteado
        const desafioSorteado = desafiosDisponiveis[indiceSorteado];

        return desafioSorteado;
    }

    const buscarDesafioUnico = async (desafioSelecionado) => {
        try {
            const desafioResposta = await axios.get(`http://192.168.0.102:3000/intra/getDesafio/${desafioSelecionado}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return desafioResposta.data;
        } catch (error) {
            console.error('Erro ao buscar desafio', error);
            return [];
        }
    }

    // Recuperar o ID do usuário
    const recuperarUserID = async () => {
        try {
            const storedUserId = await AsyncStorage.getItem('userId');
            if (storedUserId) {
                setIdUser(storedUserId);
            } else {
                Alert.alert(
                    'Erro',
                    'Falha ao recuperar o ID do usuário. O aplicativo será encerrado.',
                    [
                        { text: 'OK', onPress: () => BackHandler.exitApp() }
                    ]
                );
            }
        } catch (error) {
            console.error('Erro ao recuperar o ID do usuário:', error);
        }
    };

    const dataUltimoDesafioEntregueParaUser = async () => {
        const resultado = await axios.get(`http://192.168.0.102:3000/data-ultimo-desafio-entregue/${idUser}`);
        return resultado.data.utlimoDataDesafio.data_ultimo_desafio_entregue;

    }

    const montarNovoCardDesafioDeHoje = async () => {
        try {
            const hoje = new Date();
            const dataHoje = hoje.toISOString().split('T')[0]; // Formato "YYYY-MM-DD"
            const dadosDesafioRaw = await AsyncStorage.getItem('desafioMontado');
            // const {data} = JSON.parse(dadosDesafioRaw);
            const dataDeAgora = await buscarUltimaData();
            const dataDeAgoraFormatada = dataDeAgora.data.date.split('T')[0];
            const fazerVarredura = await buscarDesafiosFeitos();
            const fazerVarreduraJson = JSON.parse(fazerVarredura);
            let dataUltimoFormatado;
    
            const dataUltimo = await dataUltimoDesafioEntregueParaUser();
            if (dataUltimo != null) {
                dataUltimoFormatado = dataUltimo.split('T')[0];
            }
    
            if (dataUltimoFormatado === dataHoje) {
                // await pegarUltimoDesafioMontado(idUser);  // || await buscarDesafioUnico(dadosDesafios.desafioId.id);
                let desafio = await pegarUltimoDesafioMontado(idUser);  
                const feito = fazerVarreduraJson.includes(desafio.id)
                
                if (feito) {
                    setBotaoCompletarVisibilidade(false);
                } else {
                    setBotaoCompletarVisibilidade(true);
                } 

                return;
            }
            
            if (dataHoje != dataDeAgoraFormatada) {
                const desafiosParaFazer = await sortearDesafios();
                const infoCard = await buscarDesafioUnico(desafiosParaFazer);
    
                // Salva o desafio atual
                setDesafioAtual(infoCard);
    
                // Salva o ultimo desafio montado
                salvarUltimoDesafioMontado(infoCard);
    
                // Ativa o botão para concluir
                setBotaoCompletarVisibilidade(true);
            } else {
                // Converte a string JSON em um objeto JavaScript
                const dadosDesafio = JSON.parse(dadosDesafioRaw);
                let desafio = await pegarUltimoDesafioMontado(idUser);  
        
                // Verifica se o desafio já foi feito
                const jaFeito = fazerVarreduraJson.includes(desafio.id);
                const DesafioExistenteDeHoje = await pegarUltimoDesafioMontado(idUser) || await buscarDesafioUnico(dadosDesafio.desafioId.id);
    
                // Salva o desafio atual
                setDesafioAtual(DesafioExistenteDeHoje);
    
                if (jaFeito) {
                    setBotaoCompletarVisibilidade(false);
                } else {
                    // Ativa o botão para concluir
                    setBotaoCompletarVisibilidade(true);
                }
            }
        } catch (error) {
            console.log("Erro aqui", error)
        }
    };

    const montarCardAnterior = async () => {
        const dados = await pegarUltimoDesafioMontado(idUser);
        const dadosDesafioRaw = await AsyncStorage.getItem('desafioMontado');

        // Converte a string JSON em um objeto JavaScript
        const dadosDesafio = JSON.parse(dadosDesafioRaw);

        // Verifica se o desafio já foi feito
        const jaFeito = fazerVarredura.includes(dados.desafioId.id) || fazerVarredura.includes(dadosDesafioRaw.desafioId.id);
        const DesafioExistenteDeHoje = await pegarUltimoDesafioMontado(idUser) || await buscarDesafioUnico(dadosDesafio.desafioId.id);

        // Salva o desafio atual
        setDesafioAtual(DesafioExistenteDeHoje);

        if (jaFeito) {
            setBotaoCompletarVisibilidade(false);
        } else {
            // Ativa o botão para concluir
            setBotaoCompletarVisibilidade(true);
        }
    }

    // Usar de debug
    useEffect(() => {
        const fetchData = async () => {
            await recuperarUserID();
        };

        fetchData();
    }, []); // Apenas ao carregar o componente

    // Verificar desafios quando o idUser for atualizado
    useFocusEffect(
        React.useCallback(() => {
        
        const fetchDesafios = async () => {
            if (idUser) {
                setLoading(true); // Começa a carregar
                const liberacao = await verificarData();
                    if (!liberacao) {
                        // Se não for o mesmo dia, monta o desafio de hoje
                        await montarNovoCardDesafioDeHoje();
                    } else {
                        // Caso contrário, busca o último desafio montado
                        await montarCardAnterior();
                    }

                    // Busque os desafios concluídos
                    await buscarDesafiosFeitos();

                    setLoading(false); // Termina o carregamento
            }
        };

        fetchDesafios();
    }, [idUser]) 
    );
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


                    {/* Mostrar carregando até o desafio ser encontrado */}
                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#3498db" />
                            <Text style={styles.loadingText}>Carregando desafio...</Text>
                        </View>
                    ) : (
                        desafioAtual && (
                            <View style={styles.challengeCard}>
                                <View style={styles.challengeContent}>
                                    <Text style={styles.challengeTitle}>{desafioAtual.titulo}</Text>
                                    <Text style={styles.challengeDifficulty}>Dificuldade: {desafioAtual.dificuldade}</Text>
                                    <Text style={styles.challengeDescription}>
                                        {desafioAtual.descricao}
                                    </Text>
                                    {/* Exibe o botão de "Concluir" se não for completado */}
                                    {botaoCompletarVisibilidade && (
                                        <TouchableOpacity onPress={() => concluirDesafio(desafioAtual.id)} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', width: '100%' }}>
                                            <Icon reverse name="check-circle-fill" type="octicon" color="#3681d1" size={15} />
                                            <Text style={{ fontSize: 16, color: '#3681d1' }}>Concluir</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        )
                    )}

                    <View style={styles.buttonContainerMid}>
                        <TouchableOpacity style={styles.buttonMid} onPress={() => navigation.navigate('OpportunityScreen')}>
                            <Text style={styles.buttonTextMid}>Contratar Serviços</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Lista de Desafios Concluídos */}
                    <View style={styles.tasks}>
                        <Text style={styles.sectionTitle}>Concluídos 🤠</Text>
                        {desafiosCompletos.length > 0 ? (
                            desafiosCompletos.map((desafioCompleto, index) => {
                                return (
                                    <View style={styles.taskItem} key={desafioCompleto.id || index}>
                                        <Text 
                                            style={styles.taskText} 
                                            numberOfLines={1} 
                                            ellipsizeMode="tail"
                                        >
                                            {desafioCompleto.titulo}
                                        </Text>
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
                                <Text style={styles.levelText}>Você ganhou 20 de XP!!</Text>
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
    levelText: {
        color: "green"
    },
    loadingContainer: {
        flex: 1, // Faz com que o container ocupe toda a tela
        justifyContent: 'center', // Alinha o conteúdo no centro verticalmente
        alignItems: 'center', // Alinha o conteúdo no centro horizontalmente
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Fundo semi-transparente
        zIndex: 999, // Garante que o loading fique acima de outros componentes
    },
    loadingText: {
        fontSize: 18, // Tamanho da fonte
        fontWeight: 'bold', // Deixa o texto em negrito
        color: '#333', // Cor do texto
        marginTop: 10, // Espaçamento entre o texto e o indicador de carregamento
    },
    loadingSpinner: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 5,
        borderColor: '#3498db', // Cor do spinner
        borderTopColor: 'transparent',
        animation: 'spin 1s linear infinite', // Adiciona a animação de rotação
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
        marginBottom: 10
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
        flex: 1, // Permite que o texto ocupe o espaço disponível antes do ícone
        marginRight: 10, // Dá espaço entre o texto e o ícone
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

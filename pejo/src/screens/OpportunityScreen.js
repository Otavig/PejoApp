import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    Image,
    Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const OpportunityScreen = () => {
    const navigation = useNavigation();
    const [idUsuario, setIdUsuario] = useState({});
    const [opportunities, setOpportunities] = useState([]);
    const [filteredOpportunities, setFilteredOpportunities] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [isTopRated, setIsTopRated] = useState(false);
    const [isOpportunityCreated, setIsOpportunityCreated] = useState(false); // New state to store opportunity creation status
    const [opportunityId, setOpportunityId] = useState(null); // Store opportunity ID for verification

    const capturarNome = async (idpasse) => {
        try {
            const responseNome = await axios.get(`http://10.111.9.44:3000/buscar-nome-usuario-unico/${idpasse}`);
            return responseNome.data.nome;
        } catch (error) {
            console.error(`Erro ao buscar nome para user_id ${idpasse}:`, error);
            return 'Nome não encontrado';
        }
    };

    const capturarImagem = async (idpasse) => {
        const response = await axios.get(`http://10.111.9.44:3000/user/${idpasse}`);
        return response.data.profileImage;
    };

    const capturarAvaliacao = async (idpasse) => {
        try {
            const response = await axios.get(`http://10.111.9.44:3000/buscar-avaliacoes/${idpasse}`);
            return response.data.avaliacao; // Retorna os dados capturados
        } catch (error) {
            console.error("Erro ao capturar avaliação:", error);
            throw error; // Propaga o erro para ser tratado externamente
        }
    };
    
    

    useEffect(() => {
        const fetchOpportunities = async () => {
            try {
                const response = await axios.get('http://10.111.9.44:3000/buscar-oportunidades');
                // console.log(response.data)
                if (!response.data || !Array.isArray(response.data)) {
                    throw new Error('Dados inválidos retornados pela API');
                }

                const adaptedData = await Promise.all(
                    response.data.map(async (item) => {
                        if (!item.user_id) {
                            console.warn('user_id ausente:', item);
                            return null;
                        }
                        const name = await capturarNome(item.user_id);
                        const img = await capturarImagem(item.user_id);
                        const pegarAvaliacao = await capturarAvaliacao(item.user_id);
                        const avaliacao = pegarAvaliacao ? pegarAvaliacao : 0;
                        return {
                            id: item.id,
                            name: name,
                            rating: avaliacao,
                            photo: img ? `http://10.111.9.44:3000/imagesUsers/${img}` : 'https://via.placeholder.com/150',
                            location: item.cidade,
                            times: item.horarios,
                            cpf: item.cpf,
                            cfp: item.cfp,
                            userIdContract: item.user_id
                        };
                    })
                );

                const filteredData = adaptedData.filter((item) => item !== null);
                setOpportunities(filteredData);
                setFilteredOpportunities(filteredData);
            } catch (error) {
                console.error('Erro ao buscar oportunidades:', error);
            }
        };  

        checkUserAndOpportunity();
        fetchOpportunities();
    }, []);

    const checkUserAndOpportunity = async () => {
        try {
            // Obter o ID do usuário do AsyncStorage
            const storedUserId = await AsyncStorage.getItem('userId');
            if (!storedUserId) {
                console.warn('ID do usuário não encontrado');
                return;
            }
            setIdUsuario(storedUserId);
            // Verificar se a oportunidade foi criada
            const response = await axios.post(`http://10.111.9.44:3000/verificar-oportunidade-foi-criada/${idUsuario}`);
            setIsOpportunityCreated(response.data.existe); // Supondo que `response.data` seja um booleano
        } catch (error) {
            console.error('Erro ao verificar usuário ou oportunidade:', error);
        }
    };


    useEffect(() => {
        const filtered = opportunities.filter(opportunity =>
            opportunity.name && opportunity.name.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredOpportunities(filtered);
    }, [searchText, opportunities]);

    const toggleTopRatedFilter = () => {
        if (isTopRated) {
            setFilteredOpportunities(opportunities); // Exibe todos
        } else {
            const topRated = opportunities.filter(opportunity => opportunity.rating >= 4.5);
            setFilteredOpportunities(topRated); // Exibe os bem avaliados
        }
        setIsTopRated(!isTopRated);
    };

    const renderOpportunityCard = ({ item }) => {
        const ratingStyle = item.rating < 4 ? styles.lowRating : styles.highRating;
        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('OpportunityDetailScreen', { opportunity: item })}
            >
                <Image source={{ uri: item.photo }} style={styles.image} />
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.location}>{item.location}</Text>
                <Text style={[styles.rating, ratingStyle]}>Avaliação: {item.rating}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => {
                        if (isOpportunityCreated) {
                            // Exibe um alerta informando que a funcionalidade está em breve
                            alert('A funcionalidade de edição estará disponível em breve!');
                        } else {
                            // Navega para a tela de criação de oportunidade
                            navigation.navigate('NewOpportunityScreen');
                        }
                    }}
                    style={[styles.newOpportunityButton, isOpportunityCreated ? styles.editButton : null]}
                >
                    <Text style={styles.newOpportunityText}>
                        {isOpportunityCreated ? 'Editar Oportunidade' : 'Criar Oportunidade'}
                    </Text>
                </TouchableOpacity>

            </View>


            <View style={styles.filterContainer}>
                <Text style={styles.filterTitle}>Filtrar:</Text>
                <TouchableOpacity
                    style={[styles.filterButton, isTopRated && styles.activeFilterButton]}
                    onPress={toggleTopRatedFilter}
                >
                    <Ionicons name="star" size={18} color="#fff" />
                    <Text style={styles.filterText}>{isTopRated ? 'Ver Todos' : 'Mais Bem Avaliados'}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#777" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Pesquisar oportunidades..."
                    value={searchText}
                    onChangeText={setSearchText}
                />
            </View>

            <FlatList
                data={filteredOpportunities}
                keyExtractor={item => item.id.toString()}
                renderItem={renderOpportunityCard}
                contentContainerStyle={styles.flatList}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    header: {
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    newOpportunityButton: {
        backgroundColor: '#3681d1',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    newOpportunityText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    filterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 10,
    },
    filterTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginRight: 10,
    },
    filterButton: {
        backgroundColor: '#4caf50',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    activeFilterButton: {
        backgroundColor: '#2e7d32',
    },
    filterText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 5,
        fontWeight: 'bold',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        margin: 20,
        elevation: 2,
    },
    searchInput: {
        flex: 1,
        height: 50,
        paddingHorizontal: 10,
        fontSize: 16,
        color: '#333',
    },
    searchIcon: {
        marginLeft: 15,
        marginRight: 10,
    },
    flatList: {
        paddingHorizontal: 10,
        paddingBottom: 20,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        flex: 0.48,
        elevation: 3,
        alignItems: 'center',
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 10,
        borderWidth: 2,
        borderColor: '#ddd',
    },
    name: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    location: {
        fontSize: 14,
        color: '#777',
        marginBottom: 5,
    },
    rating: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    highRating: {
        color: '#4caf50',
    },
    lowRating: {
        color: '#e53935',
    },
});

export default OpportunityScreen;

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const OpportunityDetailScreen = ({ route, navigation }) => {
    const { opportunity } = route.params;
    const [userId, setUserId] = useState(null);
    const [canHire, setCanHire] = useState(true);

    useEffect(() => {
        const fetchUserId = async () => {
            const storedUserId = await AsyncStorage.getItem('userId');
            setUserId(storedUserId);

            if (storedUserId) {
                try {
                    const response = await axios.get(
                        `http://10.111.9.44:3000/buscar-contratado-por-id`, 
                        {
                            params: {
                                idUser: storedUserId,
                                idContratado: opportunity.userIdContract
                            }
                        }
                    );
                    
                    if (response.status === 200) {
                        setCanHire(response.data.canHire); // Atualiza a visibilidade do botão
                    } else {
                        console.warn('Erro ao verificar contratação:', response.data);
                    }
                } catch (error) {
                    console.error('Erro ao verificar contratação:', error);
                }
            }
        };

        fetchUserId();
    }, [opportunity.id]);

    const handleHire = async () => {
        if (userId && opportunity.id) {
            try {
                const response = await axios.post(
                    'http://10.111.9.44:3000/contratar',
                    {
                        id: userId,
                        contratadoId: opportunity.userIdContract,
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );

                if (response.status === 200) {
                    console.log('Contratado com sucesso!', response.data);
                    setCanHire(false); // Esconde o botão após contratação
                } else {
                    console.error('Erro ao contratar:', response.data);
                }
            } catch (error) {
                console.error('Erro ao se comunicar com o backend:', error);
            }
        } else {
            console.log('ID do usuário ou oportunidade não encontrado.');
        }
    };

    return (
        <View style={styles.container}>
            <Image source={{ uri: opportunity.photo }} style={styles.image} />
            <Text style={styles.name}>{opportunity.name}</Text>
            <Text style={styles.rating}>Avaliação: {opportunity.rating}</Text>
            <Text style={styles.location}>Localização: {opportunity.location}</Text>

            <Text style={styles.sectionTitle}>Horários Disponíveis:</Text>
            <Text style={styles.availableHours}>{opportunity.times}</Text>

            <Text style={styles.sectionTitle}>CFP:</Text>
            <Text style={styles.text}>{opportunity.cfp}</Text>

            <View style={styles.buttonsContainer}>
                <TouchableOpacity onPress={() => console.log('Denunciar')} style={styles.reportButton}>
                    <Text style={styles.buttonText}>Denunciar</Text>
                </TouchableOpacity>
                {canHire && (
                    <TouchableOpacity onPress={handleHire} style={styles.hireButton}>
                        <Text style={styles.buttonText}>Contratar</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingBottom: 80, // Evita que o conteúdo fique sobre os botões
        backgroundColor: '#fff',
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 10,
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    rating: {
        fontSize: 18,
        color: '#3681d1',
        marginBottom: 10,
    },
    location: {
        fontSize: 16,
        color: '#777',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    availableHours: {
        fontSize: 16,
        color: '#555',
        marginBottom: 20,
    },
    text: {
        fontSize: 16,
        color: '#555',
        marginBottom: 20,
    },
    buttonsContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        borderTopWidth: 1,
        gap: 60,
        borderTopColor: '#ccc',
    },
    reportButton: {
        backgroundColor: '#d9534f',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginRight: 10,
    },
    hireButton: {
        backgroundColor: '#5bc0de',
        padding: 10,
        borderRadius: 5,
        flex: 1,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default OpportunityDetailScreen;

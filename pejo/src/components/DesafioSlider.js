import React, { useState } from 'react';
import { ScrollView, FlatList, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';

const ChallengeSlider = ({ challenges }) => {
    const [currentPeriod, setCurrentPeriod] = useState('diario'); // Valor inicial: diário
    const periods = ['diario', 'semanal', 'mensal'];

    // Função para mudar o período
    const handlePeriodChange = (period) => {
        setCurrentPeriod(period);
    };

    // Função para renderizar os desafios baseado no período
    const renderChallenge = ({ item }) => {
        return (
            <View style={styles.challengeCard}>
                <View style={styles.challengeContent}>
                    <Text style={styles.challengeTitle}>{item.titulo}</Text>
                    <Text style={styles.challengeDifficulty}>{item.dificuldade}</Text>
                    <Text style={styles.challengeDescription}>{item.descricao}</Text>

                    <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'flex-end' }}>
                        <TouchableOpacity
                            onPress={() => handleCompleteChallenge(item.id)}
                            style={{ marginLeft: 10, padding: -5, flexDirection: 'row', alignItems: 'center' }}
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
        );
    };

    return (
        <View>
            {/* Controles para escolher o período */}
            <View style={styles.periodControls}>
                {periods.map((period) => (
                    <TouchableOpacity
                        key={period}
                        onPress={() => handlePeriodChange(period)}
                        style={[styles.periodButton, currentPeriod === period && styles.activePeriod]}
                    >
                        <Text style={styles.periodButtonText}>{period}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Renderiza os desafios */}
            <FlatList
                data={challenges}
                renderItem={renderChallenge}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    periodControls: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 20,
    },
    periodButton: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 20,
        backgroundColor: '#3681d1',
    },
    activePeriod: {
        backgroundColor: '#FF5722',
    },
    periodButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    challengeCard: {
        padding: 20,
        marginVertical: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        elevation: 3,
    },
    challengeContent: {
        marginLeft: 20,
        marginTop: 10,
    },
    challengeTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    challengeDifficulty: {
        marginTop: 5,
        fontSize: 14,
        color: '#888',
    },
    challengeDescription: {
        marginTop: 5,
        fontSize: 14,
        color: '#555',
    },
});

export default ChallengeSlider;

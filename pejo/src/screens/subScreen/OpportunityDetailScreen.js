import React from 'react';
import { View, Text, StyleSheet, Image, Button, TouchableOpacity } from 'react-native';

const OpportunityDetailScreen = ({ route, navigation }) => {
    const { opportunity } = route.params;

    const handleHire = () => {
        // Lógica para contratação (ex: abrir um chat, agendar consulta)
        console.log('Contratando...', opportunity.name);
    };

    const handleReport = () => {
        // Lógica para denunciar o profissional
        console.log('Denunciando...', opportunity.name);
    };

    return (
        <View style={styles.container}>
            <Image source={{ uri: opportunity.photo }} style={styles.image} />
            <Text style={styles.name}>{opportunity.name}</Text>
            <Text style={styles.rating}>Avaliação: {opportunity.rating}</Text>
            <Text style={styles.location}>Localização: {opportunity.location}</Text>

            {/* Horários Disponíveis */}
            <Text style={styles.sectionTitle}>Horários Disponíveis:</Text>
            <Text style={styles.availableHours}>Segunda a Sexta: 09:00 - 18:00</Text>

            {/* Foto do Certificado */}
            <Text style={styles.sectionTitle}>Certificado:</Text>
            <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.certificateImage} />

            {/* Botões */}
            <View style={styles.buttonsContainer}>
                <TouchableOpacity onPress={handleReport} style={styles.reportButton}>
                    <Text style={styles.buttonText}>Denunciar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleHire} style={styles.hireButton}>
                    <Text style={styles.buttonText}>Contratar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
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
    certificateImage: {
        width: 150,
        height: 150,
        marginBottom: 20,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    reportButton: {
        backgroundColor: '#d9534f',
        padding: 10,
        borderRadius: 5,
    },
    hireButton: {
        backgroundColor: '#5bc0de',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default OpportunityDetailScreen;

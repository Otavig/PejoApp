import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Linking } from 'react-native';

const EventDetailsScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { event } = route.params;

    if (!event) {
        return <Text style={styles.errorText}>Evento não encontrado</Text>;
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // O mês começa do zero, então adicionamos 1
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
    
        return `${day}/${month}/${year} às ${hours}:${minutes}`;
    };
    

    let imagensArray = [];
    try {
        // Transforma o item.imagens em um array real, se for uma string no formato JSON
        imagensArray = JSON.parse(event.imagens);
    } catch (error) {
        console.error("Erro ao processar imagens: ", error);
    }

    return (
        <ScrollView style={styles.container}>
            {/* Image at the top */}
            <View style={styles.imageContainer}>
                <Image source={{  uri: `http://192.168.0.102:3000/imagesEventos/${imagensArray.length > 0 ? imagensArray[0] : 'default.png'}`, }} style={styles.eventImage} />
            </View>

            {/* Event Info */}
            <View style={styles.infoContainer}>

                <Text style={styles.eventTitle}>{event.nome }</Text>
                <Text style={styles.eventDate}>📅 {formatDate(event.data_evento)}</Text>
                <Text style={styles.detailText}>🚗 Local: {event.local}</Text>

                {/* Location Button */}
                <TouchableOpacity onPress={() => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.coordenadas)}`)}>
                    <Text style={styles.eventLocation}>📍 Ver localização no mapa</Text>
                </TouchableOpacity>
            </View>

            {/* Event Details */}
            <View style={styles.detailsContainer}>
                <Text style={styles.detailText}>{event.descricao || "Venha curtir o melhor festival de verão com grandes atrações!"}</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB', // Light background for the whole screen
    },
    imageContainer: {
        height: 250, // Image container takes a large portion at the top
        width: '100%',
        overflow: 'hidden',
    },
    eventImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover', // Ensures the image covers the space fully
    },
    infoContainer: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        backgroundColor: '#FFFFFF',
        elevation: 5, // Shadow for the container
    },
    backButton: {
        marginBottom: 15,
    },
    backButtonText: {
        fontSize: 18,
        color: '#1E40AF',
    },
    eventTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1E3A8A',
        marginBottom: 6,
    },
    eventDate: {
        fontSize: 16,
        color: '#6B7280',
        marginBottom: 12,
    },
    eventLocation: {
        fontSize: 16,
        color: '#1D4ED8',
        textDecorationLine: 'underline',
    },
    detailsContainer: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        backgroundColor: '#FFFFFF',
    },
    detailText: {
        fontSize: 16,
        color: '#374151',
        marginBottom: 10,
    },
    errorText: {
        fontSize: 18,
        color: '#FF5A5F',
        marginTop: 20,
        textAlign: 'center',
    },
});

export default EventDetailsScreen;

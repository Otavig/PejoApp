import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Linking } from 'react-native';

const EventDetailsScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { event } = route.params || {};

    if (!event) {
        return <Text style={styles.errorText}>Evento não encontrado</Text>;
    }

    return (
        <LinearGradient colors={['#1E3A8A', '#1E40AF']} style={styles.container}>
            {/* Header with Back Button */}
            <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.backButtonText}>⬅</Text>
                </TouchableOpacity>
            </View>

            {/* Image Placeholder */}
            <View style={styles.imageContainer}>
                <Text style={styles.imageText}>Imagem aqui</Text>
            </View>

            {/* Event Info */}
            <View style={styles.infoContainer}>
                <Text style={styles.eventTitle}>{event.title || "Summer Festival 2024"}</Text>
                <Text style={styles.eventDate}>📅 {event.date || "24/10/2024"}</Text>
                <TouchableOpacity onPress={() => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location || "Localização do evento")}`)}>
                    <Text style={styles.eventLocation}>📍 Ver localização no mapa</Text>
                </TouchableOpacity>
            </View>

            {/* Event Details */}
            <View style={styles.detailsContainer}>
                <Text style={styles.detailText}>Tema: {event.theme || "Música e diversão"}</Text>
                <Text style={styles.detailText}>Cidade: {event.city || "São Paulo"}</Text>
                <Text style={styles.detailText}>{event.details || "Venha curtir o melhor festival de verão com grandes atrações!"}</Text>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
    },
    headerContainer: {
        paddingTop: 20,
        alignItems: 'flex-start',
    },
    backButton: {
        padding: 10,
    },
    backButtonText: {
        fontSize: 18,
        color: '#FFFFFF',
    },
    imageContainer: {
        height: 150,
        backgroundColor: '#3B82F6',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
    },
    imageText: {
        fontSize: 18,
        color: '#E0E7FF',
    },
    infoContainer: {
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    eventTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 6,
    },
    eventDate: {
        fontSize: 16,
        color: '#93C5FD',
        marginBottom: 6,
    },
    eventLocation: {
        fontSize: 16,
        color: '#93C5FD',
        textDecorationLine: 'underline',
    },
    detailsContainer: {
        backgroundColor: '#1E40AF',
        padding: 16,
        borderRadius: 10,
        marginTop: 20,
    },
    detailText: {
        fontSize: 16,
        color: '#E0E7FF',
        marginBottom: 6,
    },
    errorText: {
        fontSize: 18,
        color: '#FF5A5F',
        marginTop: 20,
        textAlign: 'center',
    },
});

export default EventDetailsScreen;

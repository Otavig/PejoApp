import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    FlatList,
    TextInput,
    ImageBackground,
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const EventsScreen = () => {
    const navigation = useNavigation();
    const [searchTerm, setSearchTerm] = useState('');
    const [futureEvents, setFutureEvents] = useState([]);
    const [pastEvents, setPastEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    // Função para buscar os eventos da API
    const fetchEvents = async () => {
        try {
            const response = await fetch('http://10.111.9.44:3000/getEventos');
            const data = await response.json();
            const today = new Date();
    
            // Separar eventos futuros e passados
            const future = data
                .filter(event => new Date(event.data_evento) >= today)
                .sort((a, b) => new Date(a.data_evento) - new Date(b.data_evento)); // Ordena eventos futuros
    
            const past = data
                .filter(event => new Date(event.data_evento) < today)
                .sort((a, b) => new Date(b.data_evento) - new Date(a.data_evento)); // Ordena eventos passados do mais recente para o mais antigo
    
            setFutureEvents(future);
            setPastEvents(past);
            setLoading(false);
        } catch (error) {
            console.error("Erro ao buscar eventos: ", error);
            setLoading(false);
        }
    };
    
    // UseFocusEffect para recarregar eventos toda vez que a tela for reaberta
    useFocusEffect(
        React.useCallback(() => {
            fetchEvents();
        }, [])
    );

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // O mês começa do zero, então adicionamos 1
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
    
        return `${day}/${month}/${year} às ${hours}:${minutes}`;
    };
    
    const renderEventItem = ({ item }) => {
        let imagensArray = [];
        try {
            imagensArray = JSON.parse(item.imagens);
        } catch (error) {
            console.error("Erro ao processar imagens: ", error);
        }

        return (
            <TouchableOpacity
                style={styles.eventCard}
                onPress={() => navigation.navigate('EventDetailsScreen', { event: item })}
            >
                <ImageBackground
                    source={{
                        uri: `http://10.111.9.44:3000/imagesEventos/${imagensArray.length > 0 ? imagensArray[0] : 'default.png'}`,
                    }}
                    style={styles.eventImage}
                    imageStyle={{ borderRadius: 10 }}
                >
                    <View style={styles.eventDetails}>
                        <Text style={styles.eventTitle}>{item.nome}</Text>
                        <Text style={styles.eventDate}>{formatDate(item.data_evento)}</Text>
                        <Text style={styles.eventLocation}>{item.local}</Text>
                    </View>
                </ImageBackground>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.greeting}>Pejo</Text>
                <TouchableOpacity style={styles.icon} onPress={() => navigation.navigate('ChatScreen')}>
                    <Ionicons name="chatbubble-outline" size={28} color="white" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                {/* Eventos Futuros */}
                <View style={styles.eventsSection}>
                    <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Próximos Eventos</Text>
                    <FlatList
                        data={futureEvents}
                        renderItem={renderEventItem}
                        keyExtractor={(item) => item.id.toString()}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.eventsList}
                        ListEmptyComponent={
                            loading ? <Text>Carregando eventos...</Text> : <Text>Nenhum evento futuro encontrado</Text>
                        }
                    />
                </View>

                {/* Eventos Passados */}
                <View style={styles.pastEventsSection}>
                    <Text style={styles.sectionTitle}>Eventos Passados</Text>
                    <FlatList
                        data={pastEvents}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.eventCardOld}
                                onPress={() => navigation.navigate('EventDetailsScreen', { event: item })}
                            >
                                <Image
                                    source={{
                                        uri: `http://10.111.9.44:3000/imagesEventos/${JSON.parse(item.imagens)[0] || 'default.png'}`,
                                    }}
                                    style={styles.eventImageOld}
                                />
                                <View style={styles.eventDetailsOld}>
                                    <Text style={styles.eventTitleOld}>{item.nome}</Text>
                                    <Text style={styles.eventDateOld}>{formatDate(item.data_evento)}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item) => item.id.toString()}
                        style={styles.pastEventsList}
                        ListEmptyComponent={<Text>Nenhum evento passado encontrado</Text>}
                    />
                </View>

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFDFF',
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
    icon: {
        position: "absolute",
        top: height / 18,  // Ajuste com base no tamanho do ícone (25 é um exemplo)
        left: width / 1.18,  // Ajuste com base no tamanho do ícone (25 é um exemplo)
        // Caso queira o ícone no canto superior direito
    },
    searchContainer: {
        padding: 20,
    },
    searchInput: {
        padding: 10,
        width: "100%",
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 0,
    },
    eventsSection: {
        marginTop: 10,
        marginLeft: 16,
    },
    eventsList: {
        paddingBottom: 20,
    },
    eventCard: {
        width: width * 0.8,
        marginRight: 16,
    },
    eventImage: {
        height: 200,
        justifyContent: 'flex-end',
        borderRadius: 10,
        overflow: 'hidden',
    },
    eventDetails: {
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        padding: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    eventTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    eventDate: {
        fontSize: 14,
        color: '#ddd',
    },
    eventLocation: {
        fontSize: 14,
        color: '#ddd',
    },
    eventCardOld: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    eventImageOld: {
        width: 50,
        height: 50,
        borderRadius: 5,
        marginRight: 10,
    },
    eventDetailsOld: {
        flex: 1,
    },
    eventTitleOld: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    eventDateOld: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    pastEventsSection: {
        marginTop: 20,
        paddingHorizontal: 16,
    },
    pastEventsList: {
        marginTop: 10,
    },
});

export default EventsScreen;

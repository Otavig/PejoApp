import React, { useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    PanResponder,
    FlatList,
    ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const mockEvents = [
    {
        id: '1',
        title: 'Summer Festival 2024',
        date: '24th October 2024',
        location: 'Beachside Park',
        image: 'https://via.placeholder.com/350',
    },
    {
        id: '2',
        title: 'Tech Expo 2024',
        date: '15th November 2024',
        location: 'Downtown Convention Center',
        image: 'https://via.placeholder.com/350',
    },
    {
        id: '3',
        title: 'Music Concert',
        date: '1st December 2024',
        location: 'Stadium Arena',
        image: 'https://via.placeholder.com/350',
    },
    // Add more mock events as needed
];

const EventsScreen = () => {
    const navigation = useNavigation();

    // Function to open the chat
    const openChat = () => {
        navigation.navigate('ChatScreen');
    };

    // Adding PanResponder to detect swipe gesture
    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (evt, gestureState) => {
                return gestureState.dx < -30;
            },
            onPanResponderRelease: () => {
                navigation.navigate('ChatScreen');
            },
        })
    ).current;

    // Function to render each event card
    const renderEventItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.eventCard} 
            onPress={() => navigation.navigate('EventDetailsScreen', { event: item })} // Navegando para a tela de detalhes
        >
            <ImageBackground source={{ uri: item.image }} style={styles.eventImage} imageStyle={{ borderRadius: 10 }}>
                <View style={styles.eventDetails}>
                    <Text style={styles.eventTitle}>{item.title}</Text>
                    <Text style={styles.eventDate}>{item.date}</Text>
                    <Text style={styles.eventLocation}>{item.location}</Text>
                </View>
            </ImageBackground>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={[styles.header, { marginTop: height * 0.05 }]}>
                <Text style={styles.appName}>Pejo</Text>
                <TouchableOpacity onPress={openChat} onLongPress={openChat}>
                    <Ionicons name="chatbubble-outline" size={24} color="black" style={styles.icon} />
                </TouchableOpacity>
            </View>

            {/* Screen content */}
            <ScrollView 
                contentContainerStyle={{ flexGrow: 1 }} 
                {...panResponder.panHandlers}
            >
                
                {/* Events list */}
                <View style={styles.eventsSection}>
                    <Text style={styles.sectionTitle}>Eventos Futuros</Text>
                    <FlatList
                        data={mockEvents}
                        renderItem={renderEventItem}
                        keyExtractor={(item) => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.eventsList}
                    />
                </View>

                {/* Past Events Section */}
                <View style={styles.pastEventsSection}>
                    <TouchableOpacity 
                        style={styles.pastEventsButton} 
                        onPress={() => { 
                            navigation.navigate('EventList'); 
                        }}
                    >
                        <Text style={styles.pastEventsButtonText}>Ver Todos os Eventos Passados</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#abd4ff',
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: width * 0.04,
    },
    appName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    icon: {
        marginLeft: width * 0, // Verifique se isso é intencional
    },
    advertisementContainer: {
        backgroundColor: '#FFF8E1',
        padding: 16,
        borderRadius: 8,
        margin: 16,
        alignItems: 'center',
    },
    advertisementText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FF9800',
    },
    eventsSection: {
        marginTop: 10,
        marginLeft: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
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
    pastEventsSection: {
        margin: 16,
        alignItems: 'center',
    },
    pastEventsButton: {
        padding: 12,
        width: '100%',
        borderRadius: 2,
    },
    pastEventsButtonText: {
        color: 'black',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default EventsScreen;

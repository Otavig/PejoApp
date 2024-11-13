import React, { useState } from 'react';
import { StyleSheet, View, TextInput, FlatList, Text } from 'react-native';

const EventList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [events, setEvents] = useState([
        { id: 1, title: 'Evento 1', date: '2023-10-01', description: 'Descrição do Evento 1' },
        { id: 2, title: 'Evento 2', date: '2023-10-05', description: 'Descrição do Evento 2' },
        { id: 3, title: 'Evento 3', date: '2023-10-10', description: 'Descrição do Evento 3' },
    ]);

    return (
        <FlatList
            data={events.filter(event => event.title.toLowerCase().includes(searchTerm.toLowerCase()))}
            keyExtractor={event => event.id.toString()}
            renderItem={({ item }) => {
                const isPastEvent = new Date(item.date) < new Date();
                return (
                    <View style={[styles.eventCard, isPastEvent && { opacity: 0.5 }]}>
                        <Text>{item.title}</Text>
                        <Text>{item.date}</Text>
                        <Text>{item.description}</Text>
                    </View>
                );
            }}
            ListHeaderComponent={
                <View style={styles.container}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Pesquisar eventos..."
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                    />
                </View>
            }
        />
    );
};

// Adicione os estilos abaixo
const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    searchInput: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 20,
    },
    eventList: {
        listStyleType: 'none',
        padding: 0,
    },
    eventCard: {
        padding: 15,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        backgroundColor: '#fff',
    },
});

export default EventList;

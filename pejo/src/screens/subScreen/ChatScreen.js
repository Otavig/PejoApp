import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, Image, TouchableOpacity, Button } from 'react-native';

const mockData = [
    { id: '1', name: 'Jane Doe', details: 'Additional details 1', avatar: null },
    { id: '2', name: 'Jane Smith', details: 'Additional details 2', avatar: null },
    { id: '3', name: 'Jane Johnson', details: 'Additional details 3', avatar: 'https://via.placeholder.com/50' },
    { id: '4', name: 'Jane Williams', details: 'Additional details 4', avatar: null },

];

const ChatScreen = ({ navigation }) => {
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState(search);
    const [isFocused, setIsFocused] = useState(false); // Novo estado para foco

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [search]);

    const filteredData = mockData.filter(person =>
        person.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    );

    const handleChatPress = (person) => {
        console.log('Navigating to ConversationScreen with:', person); // Adicionado para depuração
        navigation.navigate('ConversationScreen', { person });
    };

    const handleAddFriend = (person) => {
        console.log('Adding friend:', person); // Adicionado para depuração
        // Aqui você pode implementar a lógica para adicionar amigos
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchBar}
                placeholder="Search"
                value={search}
                onChangeText={setSearch}
            />
            <FlatList
                data={filteredData}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleChatPress(item)}>
                        <View style={styles.card}>
                            <Image
                                source={item.avatar ? { uri: item.avatar } : require('../../assets/icon.png')}
                                style={styles.avatar}
                            />
                            <View style={styles.textContainer}>
                                <Text style={styles.cardName}>{item.name}</Text>
                                <Text style={styles.cardMessage}>{item.details}</Text>
                                <Button 
                                    title="Add Friend" 
                                    onPress={() => handleAddFriend(item)} // Adicionando a funcionalidade de adicionar amigo
                                />
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#F0F2F5',
    },
    searchBar: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 16,
        paddingHorizontal: 8,
        backgroundColor: '#fff',
    },
    card: {
        flexDirection: 'row',
        padding: 15,
        backgroundColor: '#FFFFFF',
        marginVertical: 5,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
        alignItems: 'center',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
        backgroundColor: '#ddd',
    },
    textContainer: {
        flex: 1,
    },
    cardName: {
        fontWeight: 'bold',
    },
    cardMessage: {
        color: '#666',
    },
    searchBarFocused: { // Estilo adicional para foco
        borderColor: '#3641bf', // Borda azul ao focar
    },
});

export default ChatScreen;

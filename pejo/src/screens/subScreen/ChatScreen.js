import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';

const mockData = [
    { id: '1', name: 'Jane Doe', details: 'Hey, how’s it going?', avatar: null },
    { id: '2', name: 'Jane Smith', details: 'Let’s grab lunch!', avatar: null },
    { id: '3', name: 'Jane Johnson', details: 'See you there!', avatar: 'https://via.placeholder.com/50' },
    { id: '4', name: 'Jane Williams', details: 'Sounds good!', avatar: null },
];

const ChatScreen = ({ navigation }) => {
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState(search);

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
        console.log('Navigating to ConversationScreen with:', person);
        navigation.navigate('ConversationScreen', { person });
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
        backgroundColor: '#FFFFFF',
    },
    searchBar: {
        height: 45,
        borderColor: '#E0E0E0',
        borderWidth: 1,
        borderRadius: 20,
        margin: 10,
        paddingHorizontal: 15,
        backgroundColor: '#F5F5F5',
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 80,
        marginRight: 15,
        backgroundColor: '#E0E0E0',
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    cardName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#222',
    },
    cardMessage: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
});

export default ChatScreen;

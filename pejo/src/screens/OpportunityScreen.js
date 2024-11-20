import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const OpportunityScreen = () => {
    const navigation = useNavigation();

    const [opportunities, setOpportunities] = useState([]);
    const [filteredOpportunities, setFilteredOpportunities] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [isTopRated, setIsTopRated] = useState(false);

    useEffect(() => {
        const fetchedOpportunities = [
            { id: 1, name: 'João Silva', rating: 4.5, photo: 'https://via.placeholder.com/150', location: 'São Paulo' },
            { id: 2, name: 'Maria Oliveira', rating: 5.0, photo: 'https://via.placeholder.com/150', location: 'Rio de Janeiro' },
            { id: 3, name: 'Carlos Souza', rating: 3.7, photo: 'https://via.placeholder.com/150', location: 'Belo Horizonte' },
            { id: 4, name: 'Ana Costa', rating: 4.9, photo: 'https://via.placeholder.com/150', location: 'Curitiba' },
            { id: 5, name: 'João Costa', rating: 4.9, photo: 'https://via.placeholder.com/150', location: 'Curitiba' },
            { id: 6, name: 'Livia Costa', rating: 4.9, photo: 'https://via.placeholder.com/150', location: 'Curitiba' },
        ];

        setOpportunities(fetchedOpportunities);
        setFilteredOpportunities(fetchedOpportunities);
    }, []);

    useEffect(() => {
        const filtered = opportunities.filter(opportunity =>
            opportunity.name.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredOpportunities(filtered);
    }, [searchText, opportunities]);

    const toggleTopRatedFilter = () => {
        const sortedOpportunities = [...filteredOpportunities];
        sortedOpportunities.sort((a, b) => (isTopRated ? a.rating - b.rating : b.rating - a.rating));
        setFilteredOpportunities(sortedOpportunities);
        setIsTopRated(!isTopRated);
    };

    const renderOpportunityCard = ({ item }) => (
        <TouchableOpacity 
            style={styles.card}
            onPress={() => navigation.navigate('OpportunityDetailScreen', { opportunity: item })}>
            <Image source={{ uri: item.photo }} style={styles.image} />
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.location}>{item.location}</Text>
            <Text style={styles.rating}>Avaliação: {item.rating}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('NewOpportunityScreen')} style={styles.newOpportunityButton}>
                    <Text style={styles.newOpportunityText}>Criar Oportunidade</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.filterButton, isTopRated && styles.activeFilterButton]}
                    onPress={toggleTopRatedFilter}>
                    <Ionicons name="star" size={16} color="#fff" />
                    <Text style={styles.filterText}>{isTopRated ? 'Mostrar Todos' : '+ Bem Avaliados'}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Pesquisar oportunidades"
                    value={searchText}
                    onChangeText={setSearchText}
                />
            </View>

            <FlatList
                data={filteredOpportunities}
                keyExtractor={item => item.id.toString()}
                renderItem={renderOpportunityCard}
                contentContainerStyle={styles.flatList}
                numColumns={filteredOpportunities.length === 1 ? 1 : 2}
                columnWrapperStyle={styles.columnWrapper}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFDFF',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        backgroundColor: '#fff',
        elevation: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    newOpportunityButton: {
        backgroundColor: '#3681d1',
        padding: 12,
        borderRadius: 8,
    },
    newOpportunityText: {
        color: '#fff',
        fontSize: 16,
    },
    filterButton: {
        backgroundColor: '#3901d1',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        justifyContent: 'center',
    },
    activeFilterButton: {
        backgroundColor: '#2 109e9',
    },
    filterText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 5,
    },
    searchContainer: {
        padding: 15,
        backgroundColor: '#FFFDFF',
    },
    searchInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingLeft: 10,
    },
    flatList: {
        padding: 10,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    card: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 12,
        elevation: 5,
        marginBottom: 15,
        alignItems: 'center',
        flex: 0.48,
        minWidth: width * 0.45,
        marginLeft: width * 0.02,
    },
    image: {
        width: '85%',
        height: 120,
        borderRadius: 120,
        marginBottom: 10,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    location: {
        fontSize: 14,
        color: '#777',
    },
    rating: {
        fontSize: 16,
        color: '#3681d1',
    },
});

export default OpportunityScreen;

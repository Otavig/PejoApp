import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    Image,
    Dimensions,
} from 'react-native';
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
        if (isTopRated) {
            setFilteredOpportunities(opportunities); // Show all
        } else {
            const topRated = opportunities.filter(opportunity => opportunity.rating >= 4.5);
            setFilteredOpportunities(topRated); // Show top-rated
        }
        setIsTopRated(!isTopRated);
    };

    const renderOpportunityCard = ({ item }) => {
        const ratingStyle = item.rating < 4 ? styles.lowRating : styles.highRating;
        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('OpportunityDetailScreen', { opportunity: item })}
            >
                <Image source={{ uri: item.photo }} style={styles.image} />
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.location}>{item.location}</Text>
                <Text style={[styles.rating, ratingStyle]}>Avaliação: {item.rating}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('NewOpportunityScreen')}
                    style={styles.newOpportunityButton}
                >
                    <Text style={styles.newOpportunityText}>Criar Oportunidade</Text>
                </TouchableOpacity>
            </View>

            {/* Filter Section */}
            <View style={styles.filterContainer}>
                <Text style={styles.filterTitle}>Filtrar:</Text>
                <TouchableOpacity
                    style={[styles.filterButton, isTopRated && styles.activeFilterButton]}
                    onPress={toggleTopRatedFilter}
                >
                    <Ionicons name="star" size={18} color="#fff" />
                    <Text style={styles.filterText}>{isTopRated ? 'Ver Todos' : 'Mais Bem Avaliados'}</Text>
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#777" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Pesquisar oportunidades..."
                    value={searchText}
                    onChangeText={setSearchText}
                />
            </View>

            {/* Card List */}
            <FlatList
                data={filteredOpportunities}
                keyExtractor={item => item.id.toString()}
                renderItem={renderOpportunityCard}
                contentContainerStyle={styles.flatList}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    header: {
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    newOpportunityButton: {
        backgroundColor: '#3681d1',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    newOpportunityText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    filterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 10,
    },
    filterTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginRight: 10,
    },
    filterButton: {
        backgroundColor: '#4caf50',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    activeFilterButton: {
        backgroundColor: '#2e7d32',
    },
    filterText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 5,
        fontWeight: 'bold',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        margin: 20,
        elevation: 2,
    },
    searchInput: {
        flex: 1,
        height: 50,
        paddingHorizontal: 10,
        fontSize: 16,
        color: '#333',
    },
    searchIcon: {
        marginLeft: 15,
        marginRight: 10,
    },
    flatList: {
        paddingHorizontal: 10,
        paddingBottom: 20,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        flex: 0.48,
        elevation: 3,
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: 120,
        borderRadius: 12,
        marginBottom: 10,
    },
    name: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    location: {
        fontSize: 14,
        color: '#777',
        marginBottom: 5,
    },
    rating: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    highRating: {
        color: '#4caf50',
    },
    lowRating: {
        color: '#e53935',
    },
});

export default OpportunityScreen;

import React, { useState } from 'react'; // Adicionado useState
import { View, Text, StyleSheet, FlatList } from 'react-native'; // Alterado ScrollView para FlatList
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars'; // Adicione esta importação

const HomeScreen = () => {
    const [markedDates, setMarkedDates] = useState({}); // Estado para datas marcadas
    const [currentMonth, setCurrentMonth] = useState('SET'); // Estado para o mês atual

    const data = [
        { key: 'header' },
        { key: 'calendar' },
        { key: 'eventsTitle', title: 'Eventos do mês:' },
        { key: 'event1', date: '18 de set.', time: '15:25', title: 'Palestra de fobia social' },
    ];

    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ]; 

    const handleDayPress = (day) => {
        const dateString = day.dateString;
        const hasEvent = data.some(event => event.date === dateString); // Verifica se há evento
        setMarkedDates({
            [dateString]: { selected: true, marked: hasEvent, selectedColor: hasEvent ? 'green' : 'blue' },
        });
        const monthIndex = parseInt(day.dateString.split('-')[1], 10) - 1; // Obtém o índice do mês
        setCurrentMonth(months[monthIndex]); // Atualiza o mês atual baseado no índice
        
    };

    const renderItem = ({ item }) => {
        switch (item.key) {
            case 'header':
                return <View style={styles.header}></View>;
            case 'calendar':
                return (
                    <View style={styles.calendarContainer}>
                        <Text style={styles.monthText}>{currentMonth}</Text> 
                        <View style={styles.calendar}>
                            <Calendar 
                                onDayPress={handleDayPress} // Atualizado para usar a nova função
                                markedDates={markedDates} // Usando o estado para marcar datas
                                theme={{
                                    textDayFontFamily: 'sans-serif',
                                    textMonthFontFamily: 'sans-serif-bold',
                                    todayTextColor: 'red',
                                    monthTextColor: '#006064',
                                }}
                            />
                        </View>
                    </View>
                );
            case 'eventsTitle':
                return <Text style={[styles.eventsTitle, {marginBottom: 10}]}>{item.title}</Text>;
            case 'event1':
                return (
                    <View style={[styles.event]}>
                        <Text>{item.date}</Text>
                        <Text>{item.time}</Text>
                        <MaterialCommunityIcons name="calendar" size={20} color="red" />
                        <Text>{item.title}</Text>
                    </View>
                );
            default:
                return null;
        }
    };

    return (
        <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={item => item.key}
            contentContainerStyle={styles.container}
        />
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#f0f4f8', // Cor de fundo mais clara e suave
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
        // Removendo sombra para um visual mais limpo
    },
    calendarContainer: {
        marginVertical: 20,
        padding: 20,
        borderRadius: 15,
        backgroundColor: '#ffffff', // Fundo branco para um visual mais limpo
        alignItems: 'center',
        elevation: 3, // Sombra mais sutil
        borderWidth: 1, // Adicionando borda sutil
        borderColor: '#e0e0e0', // Cor da borda
    },
    monthText: {
        fontSize: 32, // Aumentando o tamanho da fonte
        fontWeight: 'bold',
        color: '#00796b',
        marginBottom: 10,
    },
    event: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#ffffff',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1, // Sombra mais leve
        shadowRadius: 2,
        borderWidth: 1, // Adicionando borda sutil
        borderColor: '#e0e0e0', // Cor da borda
    },
    closeButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#00796b',
        borderRadius: 5,
        // Removendo animação de transição para simplicidade
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: 'bold', // Aumentando a legibilidade
    },
    challenge: {
        padding: 15,
        backgroundColor: '#e0f7fa',
        borderRadius: 10,
        marginBottom: 10,
    },
    challengeTitle: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    tipsTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        marginTop: 20,
    },
    tip: {
        padding: 10,
        backgroundColor: '#f1f8e9',
        borderRadius: 5,
        marginBottom: 5,
    },
    tipsContainer: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#e0f7fa',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    tipsSubtitle: {
        fontSize: 16,
        color: '#00796b',
        marginBottom: 10,
    },
});
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import MyCarousel from './Carrossel/MyCarousel'; // Importe o componente do carrossel

const HomeScreen = () => {
    const [markedDates, setMarkedDates] = useState({});
    const [currentMonth, setCurrentMonth] = useState('SET');
    const width = Dimensions.get('window').width;

    const data = [
        { key: 'header' },
        { key: 'carousel' }, // Adicionando uma chave para o carrossel
        { key: 'calendar' },
        { key: 'eventsTitle', title: 'Eventos do mês:' },
        { key: 'event1', date: '18 de set.', time: '15:25', title: 'Palestra de fobia social' },
    ];

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const handleDayPress = (day) => {
        const dateString = day.dateString;
        const hasEvent = data.some(event => event.date === dateString);
        setMarkedDates({
            [dateString]: { selected: true, marked: hasEvent, selectedColor: hasEvent ? 'green' : 'blue' },
        });
        const monthIndex = parseInt(day.dateString.split('-')[1], 10) - 1;
        setCurrentMonth(months[monthIndex]);
    };

    const renderItem = ({ item }) => {
        switch (item.key) {
            case 'header':
                return <View style={styles.header}></View>;
            case 'carousel':
                return <MyCarousel />; // Renderizando o carrossel
            case 'calendar':
                return (
                    <View style={styles.calendarContainer}>
                        <Text style={styles.monthText}>{currentMonth}</Text>
                        <Calendar 
                            onDayPress={handleDayPress}
                            markedDates={markedDates}
                            theme={{
                                textDayFontFamily: 'sans-serif',
                                textMonthFontFamily: 'sans-serif-bold',
                                todayTextColor: 'red',
                                monthTextColor: '#006064',
                            }}
                        />
                    </View>
                );
            case 'eventsTitle':
                return <Text style={[styles.eventsTitle, { marginBottom: 10 }]}>{item.title}</Text>;
            case 'event1':
                return (
                    <View style={styles.event}>
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
        backgroundColor: '#f0f4f8',
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    calendarContainer: {
        marginVertical: 20,
        padding: 20,
        borderRadius: 15,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        elevation: 3,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    monthText: {
        fontSize: 32,
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
        shadowOpacity: 0.1,
        shadowRadius: 2,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
});

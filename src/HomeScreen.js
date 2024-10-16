import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import { API_URL } from '@env';

const MyCarousel = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef(null);
    const width = Dimensions.get('window').width;

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [images.length]);

    useEffect(() => {
        console.log('Current Index:', currentIndex);
        if (flatListRef.current && currentIndex < images.length) {
            flatListRef.current.scrollToIndex({ index: currentIndex, animated: true });
        }
    }, [currentIndex]);

    const renderItem = ({ item }) => (
        <View style={styles.imageContainer}>
            <Image source={item} style={styles.image} />
        </View>
    );

    return (
        <View style={styles.carouselContainer}>
            <FlatList
                ref={flatListRef}
                data={images}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                scrollEnabled={false}
                style={{ width }}
                getItemLayout={(data, index) => (
                    { length: width, offset: width * index, index }
                )}
                onScrollToIndexFailed={() => {}}
            />
        </View>
    );
};

const HomeScreen = () => {
    const [markedDates, setMarkedDates] = useState({});
    const [currentMonth, setCurrentMonth] = useState('SET');

    const data = [
        { key: 'header' },
        { key: 'carousel' },
        { key: 'calendar' },
        { key: 'eventsTitle', title: 'Eventos do mês:' },
        { key: 'event1', date: '18 de set.', time: '15:25', title: 'Palestra de fobia social' },
    ];

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const images = [
        require('../assets/imgs/propagandas/1.jpeg'),
        require('../assets/imgs/propagandas/2.jpeg'),
        require('../assets/imgs/propagandas/3.jpeg'),
        // Adicione mais imagens se necessário
    ];
    

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
                return <MyCarousel images={images} />;
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

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#f0f4f8',
    },
    carouselContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        borderColor: 'red', // Temporário para verificar
        borderWidth: 1, // Temporário para verificar
    },    
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    calendarContainer: {
        marginVertical: 20,
        borderRadius: 15,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        elevation: 3,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        width: '90%', // Definindo uma largura simétrica
        alignSelf: 'center', // Centraliza o calendário na tela
        padding: 10, // Padding interno para melhor visualização
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
        width: '100%',
        marginBottom: '50%'
    },
    imageContainer: {
        width: Dimensions.get('window').width,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: 200, // ajuste conforme necessário
    },
});


export default HomeScreen;

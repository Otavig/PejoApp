import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

const width = Dimensions.get('window').width;

const MyCarousel = () => {
    const data = [...Array(6).keys()]; // Criando um array de 0 a 5

    return (
        <View style={{ flex: 1 }}>
            <Carousel
                loop
                width={width}
                height={width / 2}
                autoPlay={true}
                data={data}
                scrollAnimationDuration={1000}
                onSnapToItem={(index) => console.log('current index:', index)}
                renderItem={({ index }) => (
                    <View style={styles.carouselItem}>
                        <Text style={styles.carouselText}>{index}</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    carouselItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        backgroundColor: '#fff',
    },
    carouselText: {
        fontSize: 30,
        textAlign: 'center',
    },
});

export default MyCarousel;

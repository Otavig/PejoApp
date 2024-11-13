import React, { useState, useRef } from 'react';
import { View, Dimensions, Image, StyleSheet } from 'react-native';
import Carousel from 'react-native-snap-carousel';

const { width: screenWidth } = Dimensions.get('window');

const ImageSlider = ({ images }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const carouselRef = useRef(null);

    // const renderItem = ({ item }) => {
    //     return (
    //         <View style={styles.slide}>
    //             {/* <Image source={{ uri: item }} style={styles.image} /> */}
    //         </View>
    //     );
    // };

    return (
        <View style={styles.container}>
            {/* <Carousel
                ref={carouselRef}
                data={images}
                renderItem={renderItem}
                sliderWidth={screenWidth}
                itemWidth={screenWidth * 0.8}
                onSnapToItem={(index) => setActiveIndex(index)}
                loop={true}
                autoplay={true}
                autoplayInterval={3000}
            /> */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    slide: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 6.27,
        elevation: 10,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 12,
    },
});

export default ImageSlider;

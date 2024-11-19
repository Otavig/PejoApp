import React, { useEffect } from 'react';
import { View, Image } from 'react-native';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Home'); // Navegar para a página inicial ou principal
    }, 3000); // Duração do splash em milissegundos

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {/* <Image source={require('../assets/imgs/splash.gif')} /> */}
    </View>
  );
};

export default SplashScreen;

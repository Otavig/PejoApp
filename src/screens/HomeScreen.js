import {React} from 'react'
import {View, StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native'

// const largura = Dimensions.get('screen').width
// const altura = Dimensions.get('screen').height

const HomeScreen = () => {
    return (
      <View style={styles.container}>
        <Text>Tela inicial</Text>
        
      </View>
    );
  }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default HomeScreen
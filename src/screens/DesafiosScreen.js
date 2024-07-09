import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DesafiosScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Desafios Screen</Text>
    </View>
  );
};

export default DesafiosScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

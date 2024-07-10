import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ChallengeScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Desafios Screen</Text>
    </View>
  );
};

export default ChallengeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

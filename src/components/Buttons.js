import React from "react";
import { TouchableOpacity, Dimensions, StyleSheet, Text } from "react-native";
const largura = Dimensions.get("screen").width;

const Botao = ({ textoBotao }) => {
  return (
    <TouchableOpacity>
      <Text style={styles.texto}>{textoBotao}</Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  botao: {
    width: largura / 2,
    borderRadius: 20,
    borderWidth: 2,
    backgroundColor: "blue",
  },
  texto: {
    fontSize: 20,
    textAlign: "center",
  },
});

export default Botao;

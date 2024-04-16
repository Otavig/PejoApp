import React from "react";
import { Dimensions, StyleSheet, Text } from "react-native";

const largura = Dimensions.get("screen").width;

const TextoPadrao = ({ texto, tamanhoFonte, color: corTexto }) => {
  return (
    <Text style={[styles.texto, { fontSize: tamanhoFonte, color: corTexto }]}>
      {texto}
    </Text>
  );
};

const TextoP = ({ texto, tamanhoFonte, color: corTexto }) => {
    return (
      <Text style={[styles.texto, { fontSize: tamanhoFonte, color: corTexto }]}>
        {texto}
      </Text>
    );
  };


const styles = StyleSheet.create({
  texto: {
    textAlign: "center",
  },
});
export {tex};

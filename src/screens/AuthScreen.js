import { React } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  TextInput,
} from "react-native";

const largura = Dimensions.get('screen').width
const altura = Dimensions.get('screen').height

const AuthScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Seja Bem vindo ao Pejo!</Text>

      <TextInput style={styles.input} placeholder="Seu gmail"></TextInput>
      <TextInput
        style={styles.input}
        placeholder="Sua senha"
        keyboardType="numeric"
      ></TextInput>

      <TouchableOpacity
        style={styles.botoes}
        onPress={() => navigation.navigate("AuthScreen")}
      >
        <Text
          style={{ fontSize: 30, textAlign: "center", alignItems: "center" }}
        >
          Entrar
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffb48a",
  },
  input: {
    backgroundColor: "white",
    borderWidth: 2,
    width: largura / 1.5,
    height: 40,
    borderRadius: 10,
    fontSize: 20,
    padding: 10,
    margin: 10
  },
});

export default AuthScreen;

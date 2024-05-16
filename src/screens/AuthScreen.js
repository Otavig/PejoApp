// AuthScreen.js
import { React } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Dimensions, TextInput, Image } from "react-native";
import { BtnLogin , InputLogin } from "../components/LoginComponents";
import { useNavigation } from '@react-navigation/native';

const largura = Dimensions.get('screen').width
const altura = Dimensions.get('screen').height

const logo = require('../assets/imgs/PEJO.semfundo.png')

const AuthScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Image style={styles.imageLogo} source={logo}/>
      <Text style={{fontSize: 26, marginBottom: 30}}>Bem vindo-a!</Text>

      <InputLogin
        keyboardType="text"
        place={'Email ou Telefone'}
      />

      <InputLogin
        keyboardType="numeric"
        place={'Senha'}
        seguro={true}
      />

      <BtnLogin
        TextLogin={'Entrar'}
        onClick={() => navigation.navigate("HomeScreen")}
      />

      <View style={{flexDirection: "row"}}>
        <TouchableOpacity style={{marginRight:'20%', marginTop: 10}} onPress={() => navigation.navigate("RecuperarSenha")}><Text>Esqueceu a senha ?</Text></TouchableOpacity>
        <TouchableOpacity style={{marginTop: 10}} onPress={() => navigation.navigate("Cadastro")}><Text>Crie uma conta!</Text></TouchableOpacity>
      </View>
    </View>
  );
};

const RecuperarScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Image style={styles.imageLogo} source={logo}/>
      <Text style={{fontSize: 26, marginBottom: 30}}>Recuperação</Text>

      <InputLogin
        keyboardType="text"
        place={'Email ou Telefone'}
      />

      <BtnLogin
        TextLogin={'Entrar'}
        onClick={() => navigation.navigate("HomeScreen")}
      />

      <View style={{flexDirection: "row"}}>
        <TouchableOpacity style={{marginRight:'0%', marginTop: 10}} onPress={() => navigation.navigate("Auth")}><Text>Voltar!</Text></TouchableOpacity>
      </View>
    </View>
  );
};

const CadastroScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text style={{fontSize: 26, marginBottom: 30}}>Cadastra-se</Text>

      <InputLogin
        keyboardType="text"
        place={'Nome'}
      />

      <InputLogin
        keyboardType="text"
        place={'Email'}
      />

      <InputLogin
        keyboardType="numeric"
        place={'Senha'}
        seguro={true}
      />
      
      <InputLogin
        keyboardType="numeric"
        place={'Digite novamente sua Senha'}
        seguro={true}
      />

      <BtnLogin
        TextLogin={'Entrar'}
        onClick={() => navigation.navigate("HomeScreen")}
      />

      <View style={{flexDirection: "row"}}>
        <TouchableOpacity style={{marginRight: "36%", marginTop: 10}} onPress={() => navigation.navigate("Auth")}><Text>Logar-Se!</Text></TouchableOpacity>
        <TouchableOpacity style={{marginTop: 10}}><Text>Sou especialista.</Text></TouchableOpacity>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    paddingTop: 0,
  },

  input: {
    backgroundColor: "white",
    borderWidth: 2,
    width: largura / 1.5,
    height: 40,
    fontSize: 20,
    padding: 10,
    margin: 10
  },
  imageLogo: {
    height: '20%',
    width: '40%',
  }
});

  export {CadastroScreen, AuthScreen, RecuperarScreen};

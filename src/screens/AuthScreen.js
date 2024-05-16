// AuthScreen.js
import React, { useState, useEffect } from "react";
import { AsyncStorage } from "react-native";
import { View, StyleSheet, Text, TouchableOpacity, Dimensions, Image } from "react-native";
import { BtnLogin , InputLogin, InputLoginHide } from "../components/LoginComponents";
import { useNavigation } from '@react-navigation/native';
import { TextInput } from 'react-native-paper';

const largura = Dimensions.get('screen').width
const altura = Dimensions.get('screen').height

const logo = require('../assets/imgs/PEJO.semfundo.png')


const AuthScreen = () => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  // useEffect(() => {
  //   AsyncStorage.getItem("userData").then(userData => {
  //     if (userData) {
  //       // Se as credenciais estiverem presentes, redirecione para a tela inicial
  //       navigation.navigate("Home");
  //     }
  //   });
  // }, []);

  // const handleLogin = () => {
  //   // Verificar as credenciais aqui
  //   // Se as credenciais estiverem corretas, armazene-as em AsyncStorage
  //   const userData = { emailOrPhone, password };
  //   AsyncStorage.setItem("userData", JSON.stringify(userData)).then(() => {
  //     // Redirecionar para a tela inicial após o login bem-sucedido
  //     navigation.navigate("Home");
  //   });
  // };

  return (
    <View style={styles.container}>
      <Image style={styles.imageLogo} source={logo}/>
      <Text style={{fontSize: 26, marginBottom: 30}}>Bem vindo-a!</Text>

      <InputLogin
        keyboardType="text"
        place={'Email ou Telefone'}
        value={emailOrPhone}
        onChangeText={setEmailOrPhone}
      />

      <InputLoginHide
        place={'Senha'}
        value={password}
        onChangeText={setPassword}
      />

      <BtnLogin
        TextLogin={'Entrar'}
        // onClick={handleLogin}
        onClick={() => navigation.navigate("Home")}
      />
      <View style={{flexDirection: "row"}}>
        <TouchableOpacity style={{marginRight:'22%', marginTop: 10}} onPress={() => navigation.navigate("RecuperarSenha")}><Text>Esqueceu a senha ?</Text></TouchableOpacity>
        <TouchableOpacity style={{marginTop: 10}} onPress={() => navigation.navigate("Cadastro")}><Text>Crie uma conta!</Text></TouchableOpacity>
      </View>
    </View>
  );
};

const RecuperarScreen = () => {
  const navigation = useNavigation();
  const [emailOrPhone, setEmailOrPhone] = useState("");
  return (
    <View style={styles.container}>
      <Image style={styles.imageLogo} source={logo}/>
      <Text style={{fontSize: 26, marginBottom: 30}}>Recuperação</Text>

      <InputLogin
        keyboardType="text"
        place={'Email ou Telefone'}
        value={emailOrPhone}
        onChangeText={setEmailOrPhone}
      />

      <BtnLogin
        TextLogin={'Enviar'}
        onClick={() => navigation.navigate("Auth")}
      />

      <View style={{flexDirection: "row"}}>
        <TouchableOpacity style={{marginRight:'0%', marginTop: 10}} onPress={() => navigation.navigate("Auth")}><Text>Voltar!</Text></TouchableOpacity>
      </View>
    </View>
  );
};

const CadastroScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRefresh, setPasswordRefresh] = useState("");
  return (
    <View style={styles.container}>
      <Text style={{fontSize: 26, marginBottom: 30}}>Cadastra-se</Text>

      <InputLogin
        keyboardType="text"
        place={'Nome'}
        value={name}
        onChangeText={setName}
      />

      <InputLogin
        keyboardType="text"
        place={'Email'}
        value={email}
        onChangeText={setEmail}
      />

      <InputLoginHide
        keyboardType="numeric"
        place={'Senha'} 
        value={password}
        onChangeText={setPassword}
      />
      
      <InputLoginHide
        keyboardType="numeric"
        place={'Digite novamente sua Senha'}
        value={passwordRefresh}
        onChangeText={setPasswordRefresh}
      />

      <BtnLogin
        TextLogin={'Cadastrar'}
        onClick={() => navigation.navigate("Home")}
      />

      <View style={{flexDirection: "row"}}>
        <TouchableOpacity style={{marginRight: "42.5%", marginTop: 10}} onPress={() => navigation.navigate("Auth")}><Text>Entrar!</Text></TouchableOpacity>
        <TouchableOpacity style={{marginTop: 10}}><Text>Sou especialista</Text></TouchableOpacity>
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
    width: '50%',
  }
});

  export {CadastroScreen, AuthScreen, RecuperarScreen};

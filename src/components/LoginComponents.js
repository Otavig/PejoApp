import React, { useState } from 'react';
import { Text, StyleSheet, TouchableOpacity, View} from "react-native";
import { Dimensions } from "react-native";
import { TextInput, useTheme, MD3Colors  } from 'react-native-paper';

const largura = Dimensions.get('screen').width
const altura = Dimensions.get('screen').height


const InputLogin = ({ place, seguro, value, onChangeText }) => {
  const { colors } = useTheme();
  return (
    <TextInput
      label={place}
      secureTextEntry={seguro}
      value={value}
      onChangeText={onChangeText}
      style={[styles.input, { backgroundColor: '#EAEAEA', borderTopLeftRadius: 0, borderTopRightRadius: 0 }]}
      underlineColor={'transparent'} 
      activeUnderlineColor={'#0058CC'}
    />
  );
};

const InputLoginHide = ({ place, value, onChangeText }) => {
  const [seguro, setSeguro] = useState(true); 
  const { colors } = useTheme();

  return (
    <TextInput
      label={place}
      value={value}
      secureTextEntry={seguro}
      right={
        <TextInput.Icon
          name={seguro ? 'eye' : 'eye-off'} 
          onPress={() => setSeguro(!seguro)}
          style={styles.icon}
        />
      }
      onChangeText={onChangeText}
      style={[styles.input, { backgroundColor: '#EAEAEA', borderRadius: 0, borderTopLeftRadius: 0, borderTopRightRadius: 0 }]}
      underlineColor={'transparent'} 
      activeUnderlineColor={'#0058CC'}
    />
  );
};

const BtnLogin = ({ TextLogin, onClick }) => {
  return (
    <TouchableOpacity onPress={onClick} style={styles.botao}>
      <Text style={styles.textoBtn}>{TextLogin}</Text>
    </TouchableOpacity>
  );
};

const styles =  StyleSheet.create({
texto:{
  color: 'black',
  fontWeight: 'bold',
  padding: 10,
  textAlign: 'center'
},
input: {
  width: largura - 80,
  height: 60,
  fontSize: 18,
  backgroundColor: '#DCDCDC',
  marginBottom: '5%',
  borderRadius: 0,
    },
icon: {
    alignSelf: 'center',
    marginHorizontal: 10 
},
botao: {
  // width: largura / 2,
  marginTop: 20,
  // borderRadius: 20,
  backgroundColor: '#0058CC',
  width: largura - 80,
  height: 60,
  justifyContent: 'center'
},
textoBtn: {
  fontSize: 23,
  textAlign: "center",
  color: 'white'
},
})

export {InputLogin, BtnLogin, InputLoginHide}
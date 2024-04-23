import { Text, StyleSheet, TouchableOpacity, TextInput, View} from "react-native";
import { Dimensions } from "react-native";

const largura = Dimensions.get('screen').width
const altura = Dimensions.get('screen').height


const InputLogin = ({place, seguro}) => {
    return(
        <TextInput placeholder={place} secureTextEntry={seguro} style={styles.input}/>           
    )
}

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
input:{
    // borderRadius:20,
    width:largura - 80,
    height:56,
    fontSize:18,
    backgroundColor: '#DCDCDC',
    padding:10,
    paddingHorizontal: 12,
    // marginTop:'5%',
    marginBottom: '5%'
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

export {InputLogin, BtnLogin}
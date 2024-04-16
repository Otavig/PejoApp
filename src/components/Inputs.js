import { Text, StyleSheet, TouchableOpacity, TextInput} from "react-native";
import { Dimensions } from "react-native";

const largura = Dimensions.get('screen').width

const Input = ({place}) => {
    return(
        <TextInput placeholder={place} style={styles.input}/>
        
            
    )
}


const styles =  StyleSheet.create({
    texto:{
        color: 'black',
        fontWeight: 'bold',
        padding: 10,
        textAlign: 'center'
    },
    input:{
        backgroundColor:'white',
        borderRadius:20,
        width:largura,
        height:60,
        borderWidth:2,
        fontSize:26,
        padding:10,
        marginTop:5,
        marginBottom:5
    },
})

export default Input 
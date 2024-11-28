import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Alert,
    ScrollView,
    Dimensions,
    Image,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const NewOpportunityScreen = ({ route, navigation }) => {
    const [idUsuario, setIdUsuario] = useState(null);
    const [cidade, setCidade] = useState('');
    const [cpf, setCpf] = useState('');
    const [horarios, setHorarios] = useState('');
    const [cfp, setCFP] = useState('');
    const [pagamento, setPagamento] = useState(''); // Forma de pagamento
    const [chavePix, setChavePix] = useState('');
    const [documentoBoleto, setDocumentoBoleto] = useState('');
    
    const pegarIdPerfil = async () => {
        const storedId = await AsyncStorage.getItem('userId');
        setIdUsuario(storedId);
    }

    pegarIdPerfil();

    const formatCpf = (text) => {
        let cpf = text.replace(/\D/g, '');
        if (cpf.length <= 3) {
            return cpf;
        } else if (cpf.length <= 6) {
            return cpf.slice(0, 3) + '.' + cpf.slice(3);
        } else if (cpf.length <= 9) {
            return cpf.slice(0, 3) + '.' + cpf.slice(3, 6) + '.' + cpf.slice(6);
        } else {
            return cpf.slice(0, 3) + '.' + cpf.slice(3, 6) + '.' + cpf.slice(6, 9) + '-' + cpf.slice(9, 11);
        }
    };

    const handleSubmit = async () => {
        if (!cidade) {
            Alert.alert('Erro', 'O campo "Cidade" é obrigatório.');
            return;
        }
        if (!cpf || cpf.length !== 14) {
            Alert.alert('Erro', 'O CPF é obrigatório e deve estar no formato válido.');
            return;
        }
        if (!cfp) {
            Alert.alert('Erro', 'O CRP é obrigatório.');
            return;
        }
        if (!horarios) {
            Alert.alert('Erro', 'O campo "Horários" é obrigatório.');
            return;
        }
        if (!pagamento) {
            Alert.alert('Erro', 'O campo "Forma de pagamento" é obrigatório.');
            return;
        }
        if (pagamento === 'pix' && !chavePix) {
            Alert.alert('Erro', 'A chave Pix é obrigatória.');
            return;
        }
        if (pagamento === 'boleto' && !documentoBoleto) {
            Alert.alert('Erro', 'O número do documento é obrigatório para o boleto.');
            return;
        }
        if (!idUsuario) {
            Alert.alert('Erro', 'Usuário não encontrado ou não carregado ainda.');
            return;
        }
    
        const crpPattern = /^\d{4,6}\/[A-Z]{2}$/;
        if (!crpPattern.test(cfp)) {
            Alert.alert('Erro', 'CFP inválido. O formato deve ser "12345/SP".');
            return;
        }
    
        // Definir a descrição da forma de pagamento
        let descricaoFormaPagamento = '';
        if (pagamento === 'pix') {
            descricaoFormaPagamento = cpf; // Envia o CPF se for Pix
        } else if (pagamento === 'boleto') {
            descricaoFormaPagamento = documentoBoleto; // Envia o número do documento se for boleto
        }
    
        try {
            const response = await axios.post('http://10.111.9.44:3000/criar-oportunidade', {
                idUser: idUsuario,
                cpf: cpf,
                horarios: horarios,
                cfp: cfp,
                cidade: cidade,
                forma_de_pagamento: pagamento,
                descricao_forma_pagamento: descricaoFormaPagamento
            });
    
            console.log('Oportunidade criada:', response.data);
            Alert.alert('Sucesso', 'Oportunidade criada com sucesso!');
            navigation.goBack();
        } catch (error) {
            console.error('Erro ao criar oportunidade:', error.response ? error.response.data : error.message);
            Alert.alert('Erro', 'Não foi possível criar a oportunidade.');
        }
    
        // Limpar os campos
        setCidade('');
        setCpf('');
        setHorarios('');
        setCFP('');
        setPagamento('');
        setChavePix('');
        setDocumentoBoleto('');
    };    

    return (
        <ScrollView style={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.label}>Cidade</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Digite a cidade"
                    value={cidade}
                    onChangeText={setCidade}
                />

                <Text style={styles.label}>CPF</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Digite o CPF"
                    keyboardType="numeric"
                    value={cpf}
                    onChangeText={(text) => setCpf(formatCpf(text))}
                />

                <Text style={styles.label}>CFP</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Digite o CRP (ex: 12345/SP)"
                    value={cfp}
                    onChangeText={setCFP}
                />

                <Text style={styles.label}>Horários Disponíveis</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ex: 9:00 - 18:00"
                    value={horarios}
                    onChangeText={setHorarios}
                />

                <Text style={styles.label}>Forma de Pagamento</Text>
                <View style={styles.paymentOptions}>
                    <TouchableOpacity
                        style={[
                            styles.paymentOption,
                            pagamento === 'pix' && styles.paymentOptionSelected,
                        ]}
                        onPress={() => setPagamento('pix')}
                    >
                        <Text style={styles.paymentOptionText}>Pix</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.paymentOption,
                            pagamento === 'boleto' && styles.paymentOptionSelected,
                        ]}
                        onPress={() => setPagamento('boleto')}
                    >
                        <Text style={styles.paymentOptionText}>Boleto</Text>
                    </TouchableOpacity>
                </View>

                {pagamento === 'pix' && (
                    <>
                        <Text style={styles.label}>Chave Pix (e-mail ou número)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Digite a chave Pix"
                            value={chavePix}
                            onChangeText={setChavePix}
                        />
                    </>
                )}

                {pagamento === 'boleto' && (
                    <>
                        <Text style={styles.label}>Número do Documento (CPF ou CNPJ)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Digite o número do documento"
                            value={documentoBoleto}
                            onChangeText={setDocumentoBoleto}
                        />
                    </>
                )}

                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Criar Oportunidade</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
        padding: 20,
    },
    formContainer: {
        marginTop: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingLeft: 10,
        marginBottom: 15,
        fontSize: 16,
    },
    paymentOptions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    paymentOption: {
        flex: 1,
        marginHorizontal: 5,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    paymentOptionSelected: {
        backgroundColor: '#3681d1',
        borderColor: '#3681d1',
    },
    paymentOptionText: {
        color: '#fff',
        color: 'black',
        fontSize: 16,
    },
    button: {
        backgroundColor: '#3681d1',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default NewOpportunityScreen;

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, Dimensions, Image } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker'; // Para selecionar a imagem do certificado
import { Picker } from '@react-native-picker/picker'; // Importação corrigida

const { width, height } = Dimensions.get('window');

const NewOpportunityScreen = ({ route, navigation }) => {
    // Estados para armazenar os dados do formulário
    const [cidade, setCidade] = useState('');
    const [cpf, setCpf] = useState('');
    const [horarios, setHorarios] = useState('');
    const [certificado, setCertificado] = useState(null); // Armazena a imagem do certificado
    const [pagamento, setPagamento] = useState(''); // Forma de pagamento
    const [chavePix, setChavePix] = useState(''); // Chave Pix (email ou número)
    const [documentoBoleto, setDocumentoBoleto] = useState(''); // Documento para o boleto
    
    // Função para formatar o CPF
    const formatCpf = (text) => {
        let cpf = text.replace(/\D/g, ''); // Remove qualquer caractere que não seja número
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

    // Função de validação e envio dos dados
    const handleSubmit = () => {
        // Verifica se todos os campos foram preenchidos
        if (!cidade || !cpf || !horarios || !certificado || !pagamento) {
            Alert.alert('Erro', 'Todos os campos são obrigatórios.');
            return;
        }

        // Verifica se o pagamento é Pix e a chave Pix está preenchida
        if (pagamento === 'pix' && !chavePix) {
            Alert.alert('Erro', 'A chave Pix é obrigatória.');
            return;
        }

        // Verifica se o pagamento é Boleto e o número do documento está preenchido
        if (pagamento === 'boleto' && !documentoBoleto) {
            Alert.alert('Erro', 'O número do documento é obrigatório para o boleto.');
            return;
        }

        // Exemplo de validação do CPF (apenas verificando se tem o número correto de caracteres)
        if (cpf.length !== 14) {
            Alert.alert('Erro', 'CPF inválido.');
            return;
        }

        // Aqui você pode enviar os dados para uma API ou fazer o que for necessário
        // Por enquanto, apenas uma mensagem de sucesso
        Alert.alert('Sucesso', 'Oportunidade criada com sucesso!');
        
        // Reseta os campos após o envio
        setCidade('');
        setCpf('');
        setHorarios('');
        setCertificado(null);
        setPagamento('');
        setChavePix('');
        setDocumentoBoleto('');
    };

    // Função para selecionar a imagem do certificado
    const selectCertificadoImage = () => {
        launchImageLibrary({ mediaType: 'photo' }, (response) => {
            if (response.didCancel) {
                console.log('Seleção de imagem cancelada');
            } else if (response.errorCode) {
                console.log('Erro ao selecionar imagem', response.errorMessage);
            } else {
                setCertificado(response.assets[0].uri); // Armazena a URI da imagem selecionada
            }
        });
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
                    onChangeText={(text) => setCpf(formatCpf(text))} // Formata o CPF automaticamente
                />

                <Text style={styles.label}>Horários Disponíveis</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ex: 9:00 - 18:00"
                    value={horarios}
                    onChangeText={setHorarios}
                />

                <Text style={styles.label}>Certificado</Text>
                <TouchableOpacity style={styles.imagePicker} onPress={selectCertificadoImage}>
                    <Text style={styles.imagePickerText}>{certificado ? 'Imagem Selecionada' : 'Escolher Imagem do Certificado'}</Text>
                </TouchableOpacity>
                {certificado && <Image source={{ uri: certificado }} style={styles.certificadoImage} />}

                <Text style={styles.label}>Forma de Pagamento</Text>
                <Picker
                    selectedValue={pagamento}
                    onValueChange={(itemValue) => setPagamento(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Selecione a forma de pagamento" value="" />
                    <Picker.Item label="Pix" value="pix" />
                    <Picker.Item label="Boleto" value="boleto" />
                </Picker>

                {/* Exibe campo para chave Pix, se o pagamento for Pix */}
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

                {/* Exibe campo para número de documento para boleto, se o pagamento for Boleto */}
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
    imagePicker: {
        backgroundColor: '#ddd',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        alignItems: 'center',
    },
    imagePickerText: {
        fontSize: 16,
        color: '#333',
    },
    certificadoImage: {
        width: width - 40,
        height: 200,
        marginBottom: 15,
        resizeMode: 'contain',
        borderRadius: 8,
    },
    picker: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 15,
    },
});

export default NewOpportunityScreen;

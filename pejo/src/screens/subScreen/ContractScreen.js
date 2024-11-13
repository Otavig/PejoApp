import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const ContractScreen = () => {
    // Função para lidar com a criação de oportunidades
    const handleCreateOpportunity = () => {
        // Lógica para criar uma nova oportunidade
        console.log("Oportunidade criada!");
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tela de Contratação</Text>
            <Button 
                title="Criar Oportunidade" 
                onPress={handleCreateOpportunity} 
                color="#841584" // Cor do botão
            />
        </View>
    );
};

// Estilos para o componente
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5', // Cor de fundo
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});

// Exportando o componente
export default ContractScreen;

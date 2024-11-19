import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';
import io from 'socket.io-client';
import { Buffer } from 'buffer';
import CryptoJS from 'crypto-js';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import axios from 'axios'; // Import axios para requisições HTTP

import prohibitedWords from './../../assets/json/prohibitedWords.json';

const socket = io('http://10.111.9.44:3000'); // Altere o endereço conforme necessário
const SECRET_KEY = 'pejoapp_22_10_20024'; // A mesma chave usada no servidor

const PROHIBITED_WORDS = prohibitedWords.words;

const ConversationScreen = ({ route }) => {
    const { personId } = route.params; // Get personId from route params
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const loadMessages = async () => {
            try {
                // Requisição para buscar mensagens do banco de dados
                const response = await axios.get(`http://10.111.9.44:3000/api/messages/${personId}`);
                setMessages(response.data); // Supondo que a resposta seja um array de mensagens
            } catch (error) {
                console.error('Failed to load messages:', error);
            }
        };

        loadMessages();

        socket.on('receive_message', (encryptedMessage) => {
            const decryptedMessage = decryptMessage(encryptedMessage);
            const newMessages = [...messages, decryptedMessage];
            setMessages(newMessages);
            saveMessages(newMessages); // Save messages to JSON
        });

        return () => {
            socket.off('receive_message');
        };
    }, [personId]); // Add personId
    
    const saveMessages = async (messages) => {
        try {
            await AsyncStorage.setItem(`conversationMessages_${personId}`, JSON.stringify(messages));
            // Enviar mensagem para o banco de dados
            await axios.post('http://localhost:3000/api/messages', {
                personId,
                messages
            });
        } catch (error) {
            console.error('Failed to save messages:', error);
        }
    };

    const encryptMessage = (message) => {
        const key = CryptoJS.enc.Utf8.parse(SECRET_KEY);
        const encrypted = CryptoJS.AES.encrypt(message, key, { mode: CryptoJS.mode.ECB }).toString();
        return encrypted;
    };

    const decryptMessage = (encryptedMessage) => {
        const key = CryptoJS.enc.Utf8.parse(SECRET_KEY);
        const bytes = CryptoJS.AES.decrypt(encryptedMessage, key, { mode: CryptoJS.mode.ECB });
        return bytes.toString(CryptoJS.enc.Utf8);
    };


    const sendMessage = async () => {
        if (message.trim()) {
            const lowerCaseMessage = message.toLowerCase();
            const containsProhibitedWords = PROHIBITED_WORDS.some(word => lowerCaseMessage.includes(word.toLowerCase()));
            if (containsProhibitedWords) {
                if (Math.random() < 0.15) {
                    alert('Por favor, cuide de suas palavras, pois elas têm o poder de ferir e curar. Lembre-se de que cada palavra que você diz pode impactar a vida de alguém. Procure sempre a bondade e a compaixão em suas interações. Sua mensagem contém palavras proibidas.');
                } else {
                    alert('Sua mensagem contém palavras proibidas.');
                }
                setMessage('');
                return;
            }

            const newMessages = [...messages, { text: message, sent: true }];
            setMessages(newMessages);
            await saveMessages(newMessages); // Save messages to JSON
            socket.emit('send_message', encryptMessage(message));
            setMessage('');
        }
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={messages}
                renderItem={({ item }) => (
                    <View style={item.sent ? styles.sentMessageContainer : styles.messageContainer}>
                        <Text style={styles.messageText}>{item.text}</Text>
                    </View>
                )}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.messagesContainer}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Digite sua mensagem"
                    value={message}
                    onChangeText={setMessage}
                />
                <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                    <Text style={styles.sendButtonText}>Enviar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F2F5',
    },
    header: {
        padding: 16,
        backgroundColor: '#007AFF',
    },
    name: {
        fontSize: 20,
        color: '#fff',
    },
    messagesContainer: {
        flex: 1,
        padding: 16,
    },
    message: {
        marginBottom: 10,
        fontSize: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 16,
        borderTopWidth: 1,
        borderColor: '#ccc',
    },
    input: {
        flex: 1,
        height: 50,
        borderColor: '#007AFF',
        borderWidth: 1,
        borderRadius: 25,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
    },
    sendButton: {
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#007AFF',
        borderRadius: 25,
        padding: 12,
    },
    sendButtonText: {
        color: '#fff',
        fontSize: 18,
    },
    messageContainer: {
        marginBottom: 10,
        padding: 10,
        borderRadius: 15,
        backgroundColor: '#E1FFC7', // Cor de fundo para mensagens recebidas
        alignSelf: 'flex-start', // Alinha à esquerda para mensagens recebidas
        maxWidth: '80%', // Limita a largura da mensagem
    },
    messageText: {
        fontSize: 16,
    },
    sentMessageContainer: {
        marginBottom: 10,
        padding: 10,
        borderRadius: 15,
        backgroundColor: '#007AFF', // Cor de fundo para mensagens enviadas
        alignSelf: 'flex-end', // Alinha à direita para mensagens enviadas
        maxWidth: '80%', // Limita a largura da mensagem
    },
});

export default ConversationScreen;

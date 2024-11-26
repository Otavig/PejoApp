import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Modal, Alert, Image } from 'react-native';
import io from 'socket.io-client';
import { Buffer } from 'buffer';
import CryptoJS from 'crypto-js';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import axios from 'axios'; // Import axios para requisições HTTP
import { MaterialCommunityIcons } from 'react-native-vector-icons'; // Para ícones

import prohibitedWords from './../../assets/json/prohibitedWords.json';

const socket = io('http://10.111.9.44:3000'); // Altere o endereço conforme necessário
const SECRET_KEY = 'pejoapp_22_10_20024'; // A mesma chave usada no servidor

const PROHIBITED_WORDS = prohibitedWords.words;

const ConversationScreen = ({ route }) => {
    const { personId, personName, personPhoto } = route.params || {}; // Get personId, name, and photo from route params
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [modalVisible, setModalVisible] = useState(false); // Modal visibility
    const [selectedOption, setSelectedOption] = useState('');
    const [rating, setRating] = useState(null); // Avaliação do usuário
    const [showRating, setShowRating] = useState(false); // Para mostrar a avaliação

    useEffect(() => {
        const loadMessages = async () => {
            try {
                const response = await axios.get(`http://10.111.9.44:3000/api/messages/${personId}`);
                setMessages(response.data); 
            } catch (error) {
                console.error('Failed to load messages:', error);
            }
        };

        loadMessages();

        socket.on('receive_message', (encryptedMessage) => {
            const decryptedMessage = decryptMessage(encryptedMessage);
            const newMessages = [...messages, decryptedMessage];
            setMessages(newMessages);
            saveMessages(newMessages); 
        });

        return () => {
            socket.off('receive_message');
        };
    }, [personId]);

    const saveMessages = async (messages) => {
        try {
            await AsyncStorage.setItem(`conversationMessages_${personId}`, JSON.stringify(messages));
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
                    alert('Por favor, cuide de suas palavras, pois elas têm o poder de ferir e curar...');
                } else {
                    alert('Sua mensagem contém palavras proibidas.');
                }
                setMessage('');
                return;
            }

            const newMessages = [...messages, { text: message, sent: true }];
            setMessages(newMessages);
            await saveMessages(newMessages);
            socket.emit('send_message', encryptMessage(message));
            setMessage('');
        }
    };

    const openModal = () => setModalVisible(true);

    const closeModal = () => setModalVisible(false);

    const handleOption = (option) => {
        setSelectedOption(option);
        closeModal(); 
        if (option === 'Denunciar') {
            alert('Você denunciou e bloqueou o usuário!');
        } else if (option === 'Avaliar') {
            setShowRating(true);
        }
    };

    const handleRating = (ratingValue) => {
        setRating(ratingValue);
        setShowRating(false);
        alert(`Você avaliou o usuário com nota ${ratingValue}`);
    };

    return (
        <View style={styles.container}>
            {/* Header with name, photo, and three dots */}
            <View style={styles.header}>
                <Image 
                    source={{ uri: personPhoto || 'https://via.placeholder.com/150' }} 
                    style={styles.avatar} 
                />
                <Text style={styles.name}>{personName || 'Nome Provisório'}</Text>
                <TouchableOpacity onPress={openModal} style={styles.threeDotsButton}>
                    <MaterialCommunityIcons name="dots-vertical" size={24} color="black" />
                </TouchableOpacity>
            </View>

            {/* Options Modal */}
            <Modal visible={modalVisible} transparent={true} animationType="fade" onRequestClose={closeModal}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity onPress={() => handleOption('Denunciar')}>
                            <Text style={styles.modalOption}>Denunciar/Bloquear</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleOption('Avaliar')}>
                            <Text style={styles.modalOption}>Avaliar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Rating Modal */}
            {showRating && (
                <Modal visible={showRating} transparent={true} animationType="fade" onRequestClose={() => setShowRating(false)}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalOption}>Avalie o usuário (0 a 5):</Text>
                            {[0, 1, 2, 3, 4, 5].map((value) => (
                                <TouchableOpacity key={value} onPress={() => handleRating(value)}>
                                    <Text style={styles.modalOption}>{value}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </Modal>
            )}

            {/* Chat messages */}
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

            {/* Input and Send Message */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Digite sua mensagem"
                    value={message}
                    onChangeText={setMessage}
                />
                <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                    <MaterialCommunityIcons name="send" size={24} color="white" />
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
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#007AFF',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    name: {
        fontSize: 20,
        color: '#fff',
        flex: 1,
    },
    threeDotsButton: {
        padding: 8,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalOption: {
        fontSize: 18,
        marginBottom: 10,
        color: '#007AFF',
    },
    messagesContainer: {
        flex: 1,
        padding: 16,
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
        backgroundColor: '#E1FFC7',
        alignSelf: 'flex-start',
        maxWidth: '80%',
    },
    sentMessageContainer: {
        marginBottom: 10,
        padding: 10,
        borderRadius: 15,
        backgroundColor: '#007AFF',
        alignSelf: 'flex-end',
        maxWidth: '80%',
    },
    messageText: {
        fontSize: 16,
    },
});

export default ConversationScreen;

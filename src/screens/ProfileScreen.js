import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const ProfileScreen = ({ navigation, route }) => {
  const [profilePicture, setProfilePicture] = useState(null);
  const [user, setUser] = useState(null);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState('John Doe');

  useEffect(() => {
    const loadUser = async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setProfilePicture(parsedUser.profile_picture_url);
        setNewName(parsedUser.name || newName);
      }
    };

    loadUser();
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Precisamos de permissão para acessar a galeria!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setProfilePicture(result.uri);
    }
  };

  const { handleLogout } = route.params;

  const handleLogoutPress = () => {
    Alert.alert(
      'Confirmar Logout',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          onPress: async () => {
            await AsyncStorage.removeItem('user');
            handleLogout(); // Chama a função handleLogout passada como parâmetro
          },
        },
      ],
      { cancelable: false }
    );
  };

  const saveName = () => {
    // Limite o nome a 30 caracteres
    const limitedName = newName.substring(0, 30);
    setNewName(limitedName); // Atualiza localmente apenas

    // Saia do modo de edição
    setEditingName(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.additionalCard} />

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogoutPress}>
          <Text style={styles.logoutButtonText}>Sair</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.profileContainer} onPress={pickImage}>
        <Image
          source={profilePicture ? { uri: profilePicture } : require('../../assets/imgs/defaultProfile.png')}
          style={styles.profileImage}
        />
      </TouchableOpacity>

      <View style={styles.nameContainer}>
        {editingName ? (
          <View style={styles.editNameContainer}>
            <TextInput
              style={styles.input}
              value={newName}
              onChangeText={setNewName}
              maxLength={30}
              autoFocus
              textAlign="center"
            />
            <TouchableOpacity style={styles.saveButton} onPress={saveName}>
              <Text style={styles.saveButtonText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.nameTextContainer} onPress={() => setEditingName(true)}>
            <Text style={styles.nameText}>{user?.name || newName}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0080CC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  additionalCard: {
    backgroundColor: '#FFFDFF',
    width: '100%',
    height: 800,
    position: 'absolute',
    top: 180,
    borderTopLeftRadius: 45,
    borderTopRightRadius: 45,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 5.25,
    shadowRadius: 3.84,
    elevation: 0,
  },
  profileContainer: {
    position: 'absolute',
    top: 0,
    alignItems: 'center',
    width: '100%',
    paddingTop: 100,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 1,
    zIndex: 1,
  },
  nameContainer: {
    position: 'absolute',
    top: 260,
    alignItems: 'center',
    width: '100%',
    zIndex: 1,
  },
  nameTextContainer: {
    alignItems: 'center',
  },
  nameText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  editNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 300,
  },
  input: {
    flex: 1,
    height: 40,
    width: 200,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: '#0088CC',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  logoutButton: {
    borderWidth: 1,
    backgroundColor: '#FF0000',
    borderColor: '#FF0000',
    padding: 10,
    borderRadius: 8,
    position: 'absolute',
    top: 30,
    right: 20,
    width: 70,
    marginTop: 20,
    zIndex: 1,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

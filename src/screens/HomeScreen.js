import React from 'react';
import { ImageBackground, StyleSheet, View , Text} from 'react-native';
import { BottomNavigation } from 'react-native-paper';

const HomeRoute = () => <Text></Text>;
const ChallengeRoute = () => <Text></Text>;
const ChatRoute = () => <Text></Text>;
const MoreRoute = () => <Text></Text>;

const NavigationApp = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'home', title: 'Home', focusedIcon: 'home', unfocusedIcon: 'home-outline' },
    { key: 'challenge', title: 'Desafios', focusedIcon: 'tournament', unfocusedIcon: 'tournament' },
    { key: 'chat', title: 'Chat', focusedIcon: 'chat', unfocusedIcon: 'chat-outline' },
    { key: 'more', title: 'Mais', focusedIcon: 'more' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeRoute,
    challenge: ChallengeRoute,
    chat: ChatRoute,
    more: MoreRoute,
  });

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground source={require('../assets/imgs/favicon.png')} style={styles.imageBackground}>
        <View style={{ flex: 1 }}>
          <BottomNavigation
            navigationState={{ index, routes }}
            onIndexChange={setIndex}
            renderScene={renderScene}
          />

        </View>
      </ImageBackground>
    </View>
  );
};

const HomeScreen = () => {
  return (
    <View style={{flex: 1, marginTop: 0}}>
      <NavigationApp />
    </View>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    resizeMode: 'cover', // ou 'stretch' se preferir esticar a imagem
    justifyContent: 'center',
  },
});

export default HomeScreen;

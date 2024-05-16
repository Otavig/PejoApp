import * as React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { BottomNavigation, Text as PaperText } from 'react-native-paper';

const MusicRoute = () => <Text>Home</Text>;
const AlbumsRoute = () => <Text>Desafios</Text>;
const RecentsRoute = () => <Text>Chat</Text>;
const NotificationsRoute = () => <Text>Mais</Text>;

const NavigationApp = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'music', title: 'Favorites', focusedIcon: 'heart', unfocusedIcon: 'heart-outline' },
    { key: 'albums', title: 'Albums', focusedIcon: 'album' },
    { key: 'recents', title: 'Recents', focusedIcon: 'history' },
    { key: 'notifications', title: 'Notifications', focusedIcon: 'bell', unfocusedIcon: 'bell-outline' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    music: MusicRoute,
    albums: AlbumsRoute,
    recents: RecentsRoute,
    notifications: NotificationsRoute,
  });

  return (
    <View style={{ flex: 1 }}>
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
      />
    </View>
  );
};

const HomeScreen = () => {
  return (
    <NavigationApp />
  );
};

export default HomeScreen;

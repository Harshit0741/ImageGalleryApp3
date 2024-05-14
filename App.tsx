import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  Image,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import axios from 'axios';
import { MaterialCommunityIcons } from 'react-native-vector-icons/dist/MaterialCommunityIcons';

const Stack = createStackNavigator();
const BottomTab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const API_KEY = '6f102c62f41998d151e5a1b48713cf13';

const HomeScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = () => {
    setLoading(true);
    setError('');
    axios
      .get(
        `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${API_KEY}&format=json&nojsoncallback=1&extras=url_s&text=${searchTerm}`
      )
      .then(response => {
        const validResults = response.data.photos.photo.filter(photo => photo.url_s); 
        setSearchResults(validResults);
      })
      .catch(error => {
        console.error(error);
        setError('An error occurred while fetching data.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const renderPhoto = ({ item }) => {
    return (
      <TouchableOpacity style={styles.photoContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Image source={{ uri: item.url_s }} style={styles.image} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          value={searchTerm}
          onChangeText={text => setSearchTerm(text)}
          placeholder="Search for photos"
          style={styles.input}
        />
        <Button title="Search" onPress={handleSearch} />
      </View>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={searchResults}
          renderItem={renderPhoto}
          keyExtractor={item => item.id}
          ListEmptyComponent={<Text>No photos found</Text>}
        />
      )}
    </View>
  );
};

const DetailsScreen = ({ route }) => {
  const { id, title, poster_path } = route.params;

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={{
          uri: `https://image.tmdb.org/t/p/w500${poster_path}`,
        }}
      />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const BottomTabNavigator = () => {
  return (
   <BottomTab.Navigator>
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="settings" color={color} size={size} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="bell" color={color} size={size} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
};

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Main" component={BottomTabNavigator} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      <Drawer.Screen name="Notifications" component={NotificationsScreen} />
    </Drawer.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <DrawerNavigator />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
   container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  photoContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 5,
  },
  error: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',marginTop: 20,
  },
});

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <Text>This is Profile Screen</Text>
    </View>
  );
};

const SettingsScreen = () => {
  return (
    <View style={styles.container}>
      <Text>This is Settings Screen</Text>
    </View>
  );
};

const NotificationsScreen = () => {
  return (
    <View style={styles.container}>
      <Text>This is Notifications Screen</Text>
    </View>
  );
};
export default App;
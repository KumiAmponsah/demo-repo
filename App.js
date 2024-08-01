import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Image, Dimensions, PanResponder, Animated, Easing } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Font from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient
import ThemeProvider from './ThemeProvider';

import OnlyButton4 from './onlyButton4';
import Concert from './Concert';
import Library from './Library';
import Settings from './Settings';
import SearchScreen2 from './SearchScreen2';
import SaveYourSearch from './SaveYourSearch';
import ArtisteComponents from './ArtisteComponents';
import SongComponent from './SongComponent';
import Cards from './songCard';
import resultsNotFound from './resultsNotFound';
import ResultsScreen from './resultsScreen';
import ShowDisplay1 from './ShowDisplay1';
import ArtistsPage from './ArtistsPage';
import manuelApp from './manuelApp';
import SignIn from './SignIn';
import LyricsScreen from './LyricsScreen';
import MusicPlayer from './MusicPlayer';
import PlaySong from './PlaySong';


const { width, height } = Dimensions.get('window');

// Load custom font
// async function loadFonts() {
//   await Font.loadAsync({
//     'NooplaRegular': require('./assets/fonts/NooplaRegular.ttf'),
//   });
// }

const SplashScreen = ({ onFinish }) => {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(onFinish, 1500); // Show splash screen for an additional 1.5 seconds
    });
  }, [fadeAnim]);

  return (
    <LinearGradient // Apply gradient to splash screen
      colors={['#5e16ec', '#000033']}
      style={styles.splashContainer}
    >
      <Animated.Text style={[styles.splashText, { opacity: fadeAnim }]}>
        Let's discover with Melora
      </Animated.Text>
    </LinearGradient>
  );
};

function HomeScreen() {
  const navigation = useNavigation();
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dx < -100) {
          navigation.navigate('Concert');
        } else if (gestureState.dx > 100) {
          navigation.navigate('Library');
        }
      },
      onPanResponderRelease: () => {},
    })
  ).current;

  // Animation setup
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [scaleAnim]);

  return (
    <LinearGradient // Wrap your existing View with LinearGradient
      colors={['#5e16ec', '#0d1f4e']} // Define your gradient colors
      style={styles.viewContainer} // Apply existing styles to the LinearGradient
    >
      <View {...panResponder.panHandlers}>
        <View style={styles.libraryAndConcert}>
          <TouchableOpacity style={styles.libraryContainer} onPress={() => navigation.navigate('Library')}>
            <FontAwesome6 name="chart-simple" size={33} color="#110f0f" style={styles.icon} />
            <Text style={styles.libraryText}>Library</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.concertContainer} onPress={() => navigation.navigate('Concert')}>
            <FontAwesome name="ticket" size={33} color="#110f0f" style={styles.icon} />
            <Text style={styles.concertText}>Concerts</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.centerContainer}>
          <Animated.View style={[styles.button, { transform: [{ scale: scaleAnim }] }]}>
            <TouchableOpacity onPress={() => navigation.navigate('OnlyButton4')}>
              <Image source={require('./assets/meloraImage.png')} style={styles.logo} />
            </TouchableOpacity>
          </Animated.View>
          <Text style={styles.meloraText}>Discover With Melora</Text>
          <TouchableOpacity style={styles.searchIcon} onPress={() => navigation.navigate('SearchScreen2')}>
            <FontAwesome name="search" size={width * 0.06} color="#C0C0C0" />
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const Stack = createStackNavigator();

export default function App() {
  const [isSplashVisible, setSplashVisible] = useState(true);

  const handleSplashFinish = () => {
    setSplashVisible(false);
  };

  return (
    <ThemeProvider>
      <NavigationContainer>
        {isSplashVisible ? (
          <SplashScreen onFinish={handleSplashFinish} />
        ) : (
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="OnlyButton4" component={OnlyButton4} options={{ headerShown: false }} />
            <Stack.Screen name="Concert" component={Concert} options={{ headerShown: false }} />
            <Stack.Screen name="Library" component={Library} options={{ headerShown: false }} />
            <Stack.Screen name="Settings" component={Settings} options={{ headerShown: false }} />
            <Stack.Screen name="SearchScreen2" component={SearchScreen2} options={{ headerShown: false }} />
            <Stack.Screen name="SaveYourSearch" component={SaveYourSearch} options={{ headerShown: false }} />
            <Stack.Screen name="ArtisteComponents" component={ArtisteComponents} options={{ headerShown: false }} />
            <Stack.Screen name="SongComponent" component={SongComponent} options={{ headerShown: false }} />
            <Stack.Screen name="songCard" component={Cards} options={{ headerShown: false }} />
            <Stack.Screen name="resultsNotFound" component={resultsNotFound} options={{ headerShown: false }} />
            <Stack.Screen name="resultsScreen" component={ResultsScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ShowDisplay1" component={ShowDisplay1} options={{ headerShown: false }} />
            <Stack.Screen name="ArtistsPage" component={ArtistsPage} options={{ headerShown: false }} />
            <Stack.Screen name="manuelApp" component={manuelApp} options={{ headerShown: false }} />
            <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }} />
            <Stack.Screen name="MusicPlayer" component={MusicPlayer} options={{ headerShown: false }} />
            <Stack.Screen name="LyricsScreen" component={LyricsScreen} options={{ headerShown: false }} />
            <Stack.Screen name="PlaySong" component={PlaySong} options={{ headerShown: false }} />
  
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashText: {
    fontSize: width * 0.1,
    color: '#ffffff',
    fontWeight: '900',
  },
  viewContainer: {
    flex: 1,
    padding: width * 0.05,
    // backgroundColor: '#195497', Remove background color from here
  },
  libraryAndConcert: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height * 0.08,
    marginTop: height * 0.05,
  },
  libraryContainer: {
    alignItems: 'center',
  },
  concertContainer: {
    alignItems: 'center',
  },
  centerContainer: {
    alignItems: 'center',
    top: height * 0.15
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#756792',
    borderRadius: 40,
    height: height * 0.08,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: height * 0.1,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingLeft: 10,
    fontSize: 18,
    color: '#110f0f',
  },
  searchIcon: {
    backgroundColor: '#3C1450',
    borderRadius: (width * 0.15) / 2,
    width: width * 0.11,
    height: width * 0.11,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    left: width * 0.01,
    top: height * 0.015,
  },
  button: {
    borderRadius: (width * 0.6) / 2,
    width: width * 0.50,
    height: width * 0.5,
    backgroundColor: '#1b1919',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  logo: {
    width: width * 0.45,
    height: (width * 0.45) * 1.04,
  },
  meloraText: {
    fontSize: width * 0.05,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: height * 0.02,
    marginTop: height * 0.2,
  },
  libraryText: {
    fontSize: width * 0.05,
    fontWeight: '700',
    color: '#110f0f',
  },
  concertText: {
    fontSize: width * 0.05,
    fontWeight: '700',
    color: '#110f0f',
  },
  icon: {
    marginBottom: 5,
  },
});

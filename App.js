
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useFonts } from 'expo-font';

import { Provider } from 'react-redux';
import store from './src/store';

import { View, Text, ActivityIndicator } from 'react-native';

import "./global.css";


import MainStack from './src/components/layouts/MainStack';


export default function App() {


  const [fontsLoaded, fontError] = useFonts({
    'Poppins-Regular': require('./assets/fonts/Poppins/Poppins-Regular.ttf'),
    'Poppins-Bold': require('./assets/fonts/Poppins/Poppins-Bold.ttf'),
    'Poppins-SemiBold': require('./assets/fonts/Poppins/Poppins-SemiBold.ttf'),
    'OpenSans-Regular': require('./assets/fonts/Open_Sans/static/OpenSans-Regular.ttf'),
    'OpenSans-Bold': require('./assets/fonts/Open_Sans/static/OpenSans-Bold.ttf'),
    'OpenSans-SemiBold': require('./assets/fonts/Open_Sans/static/OpenSans-SemiBold.ttf'),
    'OpenSans-Condensed-Regular': require('./assets/fonts/Open_Sans/static/OpenSans_Condensed-Regular.ttf'),
    'IBMPlexSans-Regular': require('./assets/fonts/IBM_Plex_Sans/static/IBMPlexSans-Regular.ttf'),
    'IBMPlexMono-Regular': require('./assets/fonts/IBM_Plex_Mono/IBMPlexMono-Bold.ttf'),
  });

  // Show loading indicator until fonts are loaded
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading fonts...</Text>
      </View>
    );
  }

  // Optional: Handle font loading errors
  if (fontError) {
    console.error('Font loading error:', fontError);
    // You can show an error message here if needed
  }



  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <MainStack />
        </NavigationContainer>
      </SafeAreaProvider>
      </Provider>
    
  );
}

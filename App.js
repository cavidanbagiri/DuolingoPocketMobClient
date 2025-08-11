
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { useFonts } from 'expo-font';

import { Provider } from 'react-redux';
import store from './src/store';

import "./global.css";


import MainStack from './src/components/layouts/MainStack';


export default function App() {

  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('./assets/fonts/Poppins/Poppins-Regular.ttf'),
    'Poppins-Bold': require('./assets/fonts/Poppins/Poppins-Bold.ttf'),
    'Poppins-SemiBold': require('./assets/fonts/Poppins/Poppins-SemiBold.ttf'),
    'OpenSans-Regular': require('./assets/fonts/Open_Sans/static/OpenSans-Regular.ttf'),
    'OpenSans-Bold': require('./assets/fonts/Open_Sans/static/OpenSans-Bold.ttf'),
    'OpenSans-SemiBold': require('./assets/fonts/Open_Sans/static/OpenSans-SemiBold.ttf'),
    'IBMPlexSans-Regular': require('./assets/fonts/IBM_Plex_Sans/static/IBMPlexSans-Regular.ttf'),
    'IBMPlexMono-Regular': require('./assets/fonts/IBM_Plex_Mono/IBMPlexMono-Bold.ttf'),
    // Add more as needed
  });

  return (
    <Provider store={store}>
        <NavigationContainer>
          <MainStack />
        </NavigationContainer>
      </Provider>
    
  );
}

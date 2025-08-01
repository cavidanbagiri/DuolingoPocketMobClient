
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { Provider } from 'react-redux';
import store from './src/store';

import HomeScreen from './src/screens/HomeScreen';
import LoginRegisterScreen from './src/screens/LoginRegisterScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import TabNavigator from './src/components/layouts/TabNavigator';

const Tab = createBottomTabNavigator();

export default function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false); // mock state


  return (
    <Provider store={store}>
      <NavigationContainer>
        <TabNavigator />
      </NavigationContainer>
    </Provider>
  );
}

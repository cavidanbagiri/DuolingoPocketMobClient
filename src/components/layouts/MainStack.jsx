// src/components/layouts/MainStack.js

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TabNavigator from './TabNavigator';
import CardDetailScreen from '../../screens/card_screen/CardDetailScreen';
import AIScreen from '../../screens/tab_screen/AIScreen';
import SearchScreen from '../../screens/card_screen/SearchScreen';
import FavoritesScreen from '../../screens/translate_screen/FavoritesScreen';
import CategoryWords from '../../screens/translate_screen/CategoryWords';
import AboutAppScreen from '../../screens/profile_screen/AboutApp';
import NotificationsScreen from '../../screens/profile_screen/NotificationScreen';
import PrivacySecurityScreen from '../../screens/profile_screen/PrivacySecurityScreen';

const Stack = createNativeStackNavigator();

export default function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen 
        name="CardDetail" 
        component={CardDetailScreen}
        options={{ title: 'Word Detail' }}
      />
      <Stack.Screen 
        name="AIScreen"
        component={AIScreen}
        options={{ title: 'AI Chat' }}
      />
      <Stack.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{ title: 'Search' }}
      />
      <Stack.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{ title: 'Search' }}
      />
      <Stack.Screen
        name="CategoryWords"
        component={CategoryWords}
        options={({ route }) => ({ 
          title: route.params.categoryName,
          headerShown: false // We're using custom header
        })}
      />
      <Stack.Screen 
        name="AboutApp" 
        component={AboutAppScreen}
        options={{ title: 'About App' }}
      />
      <Stack.Screen 
        name="Notifications" 
        component={NotificationsScreen}
        options={{ title: 'Notifications' }}
      />
      <Stack.Screen 
        name="PrivacySecurity" 
        component={PrivacySecurityScreen}
        options={{ title: 'Privacy & Security' }}
      />
    </Stack.Navigator>
  );
}

// src/components/layouts/MainStack.js

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TabNavigator from './TabNavigator';
import CardDetailScreen from '../../screens/CardDetailScreen';
import AIScreen from '../../screens/AIScreen';
import SearchScreen from '../../screens/SearchScreen';
import FavoritesScreen from '../../screens/FavoritesScreen';
import CategoryWords from '../../screens/CategoryWords';
import AboutAppScreen from '../../screens/AboutApp';
import NotificationsScreen from '../../screens/NotificationScreen';
import PrivacySecurityScreen from '../../screens/PrivacySecurityScreen';

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

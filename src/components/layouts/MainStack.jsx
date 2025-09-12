// src/components/layouts/MainStack.js

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TabNavigator from './TabNavigator';
import CardDetailScreen from '../../screens/CardDetailScreen';
import AIScreen from '../../screens/AIScreen';
import SearchScreen from '../../screens/SearchScreen';
import WordScreen from '../../screens/WordScreen';

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
    </Stack.Navigator>
  );
}

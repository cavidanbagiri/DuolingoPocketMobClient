// src/components/layouts/MainStack.js

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TabNavigator from './TabNavigator';
import CardDetailScreen from '../../screens/CardDetailScreen';

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
    </Stack.Navigator>
  );
}

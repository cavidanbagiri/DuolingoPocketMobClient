
import React, { useCallback, useEffect, useState } from 'react';
import AIComponent from '../components/ai/AIComponent';
import TranslateComponent from '../components/ai/TranslateComponent';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';

const Tab = createMaterialTopTabNavigator();

export default function AIScreen() {

  const insets = useSafeAreaInsets();


  return (

    <KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
  style={{ flex: 1 }}
>
  <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }} edges={['top']}>
    
    {/* Customized Material Top Tabs */}
    <Tab.Navigator
      screenOptions={{
        // 🔽 Tab Bar Style
        tabBarStyle: {
          paddingTop: insets.top,
          backgroundColor: '#FFFFFF',
          elevation: 0, // Android: remove shadow
          shadowOpacity: 0, // iOS: remove shadow
          borderBottomWidth: 1,
          borderBottomColor: '#F3F4F6',
        },
        tabBarActiveTintColor: '#6366F1', // Active tab color (indigo)
        tabBarInactiveTintColor: '#6B7280', // Inactive tabs
        tabBarIndicatorStyle: {
          backgroundColor: '#6366F1',
          height: 3,
          borderRadius: 3,
          marginHorizontal: 16,
        },
        tabBarLabelStyle: {
          fontSize: 15,
          fontWeight: '600',
          fontFamily: 'IBMPlexSans-SemiBold',
          textTransform: 'none', // Don't force uppercase
        },
        tabBarPressColor: 'rgba(99, 102, 241, 0.1)', // Ripple effect
        tabBarScrollEnabled: false, // Disable scroll if only 2 tabs
        sceneContainerStyle: {
          backgroundColor: '#FFFFFF',
        },
      }}
    >
      <Tab.Screen 
        name="AI Chat" 
        component={AIComponent} 
        options={{
          tabBarTestID: 'ai-tab',
          accessibilityLabel: 'AI Language Tutor',
        }}
      />
      <Tab.Screen 
        name="Translate" 
        component={TranslateComponent} 
        options={{
          tabBarTestID: 'translate-tab',
          accessibilityLabel: 'Translate phrases',
        }}
      />
    </Tab.Navigator>
  </SafeAreaView>
</KeyboardAvoidingView>

    //  <KeyboardAvoidingView
    //   behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    //   keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    //   style={{ flex: 1 }} // ← Critical
    // >

    //   <Tab.Navigator
    //     screenOptions={{
    //       tabBarStyle: {
    //         marginTop: insets.top,
    //         backgroundColor: '#ffffff',
    //       },
    //       sceneContainerStyle: {
    //         backgroundColor: '#ffffff',
    //       }
    //     }}
    //   >
    //     <Tab.Screen 
    //       name="AI Chat" 
    //       component={AIComponent} 
    //     />
    //     <Tab.Screen 
    //       name="Translate" 
    //       component={TranslateComponent} 
    //     />
    //   </Tab.Navigator>

    // </KeyboardAvoidingView>


  );
}

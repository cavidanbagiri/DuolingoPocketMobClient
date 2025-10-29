import CustomTabBar from './CustomTabBar';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';

import HomeScreen from '../../screens/tab_screen/HomeScreen';
import WordScreen from '../../screens/tab_screen/WordScreen';
import LearnedScreen from '../../screens/tab_screen/LearnedScreen';
import TranslateScreen from '../../screens/tab_screen/TranslateScreen'
import LoginRegisterScreen from '../../screens/tab_screen/LoginRegisterScreen';
import ProfileScreen from '../../screens/tab_screen/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
    const { is_auth } = useSelector((state) => state.authSlice);

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                // ... your existing screenOptions ...
                tabBarIcon: ({ color, size }) => {
                    let iconName;
                    if (route.name === 'Home'){
                        return <AntDesign name="home" size={30} color="black" />
                    }
                    // else if (route.name === 'Word') iconName = 'book';
                    else if (route.name === 'Word') {
                        return <Ionicons name="book-outline" size={30} color="black" />
                    }
                    else if (route.name === 'Translate') {
                       return <Ionicons name="language" size={30} color="black" />
                    }
                    else if (route.name === 'Login/Register') iconName = 'log-in'
                    else if (route.name === 'Profile') {
                        return <Feather name="user" size={30} color="black" />
                    }
                    return <Ionicons name={iconName} size={30} color={color} />;
                },
                headerShown: false,
            })}
            // --- ADD THIS PROP ---
            tabBar={(props) => <CustomTabBar {...props} />}
        >
            {/* ... your existing Tab.Screen components ... */}
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Word" component={WordScreen} />
            {/* <Tab.Screen name="Translate" component={LearnedScreen} /> */}
            <Tab.Screen name="Translate" component={TranslateScreen} />
            {!is_auth ? (
                <Tab.Screen name="Login/Register">
                    {() => <LoginRegisterScreen onLogin={() => {}} />}
                </Tab.Screen>
            ) : (
                <Tab.Screen name="Profile" component={ProfileScreen} />
            )}
        </Tab.Navigator>
    )
}



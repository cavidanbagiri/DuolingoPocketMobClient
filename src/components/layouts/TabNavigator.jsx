

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';




import HomeScreen from '../../screens/HomeScreen';
import WordScreen from '../../screens/WordScreen';
import LearnedScreen from '../../screens/LearnedScreen';
import LoginRegisterScreen from '../../screens/LoginRegisterScreen';
import ProfileScreen from '../../screens/ProfileScreen';

const Tab = createBottomTabNavigator();


export default function TabNavigator() {

    const { is_auth } = useSelector((state) => state.authSlice);

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName;
                    if (route.name === 'Home'){
                        return <AntDesign name="home" size={26} color="black" />
                    }
                    // else if (route.name === 'Word') iconName = 'book';
                    else if (route.name === 'Word') {
                        return <Ionicons name="book-outline" size={26} color="black" />
                    }
                    else if (route.name === 'Learned') {
                       return <Ionicons name="checkmark-done-outline" size={26} color="black" />
                    }
                    else if (route.name === 'Login/Register') iconName = 'log-in'
                    else if (route.name === 'Profile') {
                        return <Feather name="user" size={26} color="black" />
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                headerShown: false,
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Word" component={WordScreen} />
            <Tab.Screen name="Learned" component={LearnedScreen} />
            {!is_auth ? (
                <Tab.Screen name="Login/Register">
                    {() => <LoginRegisterScreen onLogin={() => {

                    }} />}
                </Tab.Screen>
            ) : (
                <Tab.Screen name="Profile" component={ProfileScreen} />
            )}
        </Tab.Navigator>
    )
}
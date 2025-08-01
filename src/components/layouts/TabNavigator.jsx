

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';


import HomeScreen from '../../screens/HomeScreen';
import LoginRegisterScreen from '../../screens/LoginRegisterScreen';
import ProfileScreen from '../../screens/ProfileScreen';

const Tab = createBottomTabNavigator();


export default function TabNavigator() {


    const { is_auth } = useSelector((state) => state.authSlice);

    const [isLoggedIn, setIsLoggedIn] = useState(false); // mock state

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName;
                    if (route.name === 'Home') iconName = 'home';
                    else if (route.name === 'Login/Register') iconName = 'log-in';
                    else if (route.name === 'Profile') iconName = 'person';
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                headerShown: false,
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            {!is_auth ? (
                <Tab.Screen name="Login/Register">
                    {() => <LoginRegisterScreen onLogin={() => {

                        // setIsLoggedIn(true);
                    }} />}
                </Tab.Screen>
            ) : (
                <Tab.Screen name="Profile" component={ProfileScreen} />
            )}
        </Tab.Navigator>
    )
}
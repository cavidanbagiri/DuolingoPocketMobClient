

import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AuthService from '../services/AuthService';
import { useNavigation } from '@react-navigation/native';

export default function ProfileScreen() {

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const { user } = useSelector((state) => state.authSlice); // Assuming you have user data in auth slice

  const logoutHandler = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Logout", 
          style: "destructive",
          onPress: () => dispatch(AuthService.userLogout())
        }
      ]
    );
  };

  const menuItems = [
    {
      icon: 'person-outline',
      title: 'Edit Profile',
      onPress: () => console.log('Edit Profile'),
      color: '#6366F1'
    },
    {
      icon: 'notifications-outline',
      title: 'Notifications',
      onPress: () => navigation.navigate('Notifications'),
      color: '#10B981'
    },
    {
      icon: 'shield-checkmark-outline',
      title: 'Privacy & Security',
      onPress: () => navigation.navigate('PrivacySecurity'),
      color: '#F59E0B'
    },
    {
      icon: 'help-buoy-outline',
      title: 'Help & Support',
      onPress: () => console.log('Help'),
      color: '#EF4444'
    },
    {
      icon: 'information-circle-outline',
      title: 'About App',
      onPress: () => navigation.navigate('AboutApp'),
      color: '#8B5CF6'
    },
  ];

  const stats = [
    { label: 'Words Learned', value: '1,243', icon: 'book-outline' },
    { label: 'Categories', value: '8', icon: 'folder-outline' },
    { label: 'Streak', value: '12 days', icon: 'flame-outline' },
  ];

  return (
    <View className="flex-1 bg-gray-50" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="px-4 py-3 bg-white border-b border-gray-200">
        <Text className="text-xl font-bold text-gray-900">Profile</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* User Profile Card */}
        <View className="bg-white mx-4 my-6 rounded-2xl shadow-sm border border-gray-100">
          <View className="items-center p-6">
            <View className="w-20 h-20 bg-indigo-100 rounded-full items-center justify-center mb-4">
              <Ionicons name="person" size={32} color="#6366F1" />
            </View>
            <Text className="text-xl font-semibold text-gray-900">
              {user?.name || 'User Name'}
            </Text>
            <Text className="text-gray-500 text-sm mt-1">
              {user?.email || 'user@example.com'}
            </Text>
            <Text className="text-indigo-600 text-sm mt-2">
              Premium Member • Since 2024
            </Text>
          </View>

          {/* Stats Row */}
          <View className="flex-row justify-around py-4 border-t border-gray-100">
            {stats.map((stat, index) => (
              <View key={index} className="items-center">
                <Ionicons name={stat.icon} size={20} color="#6366F1" />
                <Text className="text-lg font-bold text-gray-900 mt-1">
                  {stat.value}
                </Text>
                <Text className="text-xs text-gray-500">
                  {stat.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Menu Items */}
        <View className="bg-white mx-4 rounded-2xl shadow-sm border border-gray-100 mb-6">
          {menuItems.map((item, index) => (
            <React.Fragment key={index}>
              <TouchableOpacity
                className="flex-row items-center px-6 py-4"
                onPress={item.onPress}
              >
                <View 
                  className="w-10 h-10 rounded-full items-center justify-center mr-4"
                  style={{ backgroundColor: item.color + '20' }}
                >
                  <Ionicons name={item.icon} size={20} color={item.color} />
                </View>
                <Text className="text-gray-900 flex-1">{item.title}</Text>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>
              {index < menuItems.length - 1 && (
                <View className="h-px bg-gray-100 mx-6" />
              )}
            </React.Fragment>
          ))}
        </View>

        {/* App Settings */}
        <View className="bg-white mx-4 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <Text className="text-gray-500 text-sm font-medium px-6 py-3 border-b border-gray-100">
            APP SETTINGS
          </Text>
          
          {/* <View className="flex-row items-center justify-between px-6 py-4">
            <Text className="text-gray-900">Dark Mode</Text>
            <Ionicons name="moon" size={20} color="#6366F1" />
          </View> */}
          
          <View className="h-px bg-gray-100 mx-6" />
          
          <View className="flex-row items-center justify-between px-6 py-4">
            <Text className="text-gray-900">Language</Text>
            <Text className="text-gray-500">English</Text>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          className="bg-white mx-4 rounded-2xl shadow-sm border border-gray-100 mb-8"
          onPress={logoutHandler}
        >
          <View className="flex-row items-center justify-center px-6 py-4">
            <Ionicons name="log-out-outline" size={20} color="#EF4444" />
            <Text className="text-red-600 font-medium ml-2">Logout</Text>
          </View>
        </TouchableOpacity>

        {/* App Version */}
        <View className="items-center pb-8">
          <Text className="text-gray-400 text-sm">W9999 App</Text>
          <Text className="text-gray-400 text-xs mt-1">Version 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}
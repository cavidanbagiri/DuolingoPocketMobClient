import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function NotificationsScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  // Sample data for when you have notifications later
  const hasNotifications = false; // Set to true when you have actual notifications
  const notifications = []; // Empty array for now

  return (
    <View className="flex-1 bg-gray-50" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <View className="flex-row items-center">
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="mr-3"
          >
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-900">Notifications</Text>
        </View>
        
        {hasNotifications && (
          <TouchableOpacity>
            <Text className="text-indigo-600 font-medium">Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {hasNotifications ? (
          // When you have notifications in the future
          <View className="p-4">
            {/* Notification list would go here */}
            <Text className="text-gray-500 text-center">Your notifications will appear here</Text>
          </View>
        ) : (
          // Empty state - No notifications
          <View className="flex-1 justify-center items-center px-8 py-20">
            {/* Illustration */}
            <View className="w-24 h-24 bg-indigo-100 rounded-full items-center justify-center mb-6">
              <Ionicons name="notifications-off-outline" size={40} color="#6366F1" />
            </View>
            
            {/* Title */}
            <Text className="text-2xl font-bold text-gray-900 text-center mb-3">
              No notifications yet
            </Text>
            
            {/* Description */}
            <Text className="text-gray-500 text-center text-base mb-8 leading-6">
              We'll notify you about new features, learning achievements, 
              and important updates here. Stay tuned!
            </Text>
            
            {/* Optional: Action buttons */}
            {/* <View className="flex-row space-x-4">
              <TouchableOpacity 
                className="bg-indigo-600 px-6 py-3 rounded-full"
                onPress={() => console.log('Explore features')}
              >
                <Text className="text-white font-medium">Explore Features</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="border border-indigo-600 px-6 py-3 rounded-full"
                onPress={() => navigation.navigate('Settings')}
              >
                <Text className="text-indigo-600 font-medium">Settings</Text>
              </TouchableOpacity>
            </View> */}
            
            {/* Optional: Tips section */}
            {/* <View className="bg-blue-50 rounded-xl p-5 mt-8 w-full">
              <View className="flex-row items-start mb-3">
                <Ionicons name="bulb-outline" size={20} color="#3B82F6" />
                <Text className="text-blue-800 font-medium ml-2">Pro Tip</Text>
              </View>
              <Text className="text-blue-700 text-sm leading-5">
                Enable push notifications in settings to get instant updates 
                about your learning progress and new features.
              </Text>
            </View> */}
          </View>
        )}
      </ScrollView>

      {/* Optional: Refresh control for future */}
      {hasNotifications && (
        <TouchableOpacity 
          className="absolute bottom-6 right-6 w-14 h-14 bg-indigo-600 rounded-full items-center justify-center shadow-lg"
          onPress={() => console.log('Refresh notifications')}
        >
          <Ionicons name="refresh" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </View>
  );
}
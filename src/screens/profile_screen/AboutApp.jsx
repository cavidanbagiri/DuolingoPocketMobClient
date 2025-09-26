import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AboutAppScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  const openLink = async (url) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.log('Error opening link:', error);
    }
  };

  const features = [
    {
      icon: 'globe-outline',
      title: '9999 Essential Words',
      description: 'Learn the most frequently used words in any language'
    },
    {
      icon: 'sparkles-outline',
      title: 'AI-Powered Learning',
      description: 'Smart translations and explanations powered by AI'
    },
    {
      icon: 'heart-outline',
      title: 'Personalized Favorites',
      description: 'Save and organize words in custom categories'
    },
    {
      icon: 'mic-outline',
      title: 'Voice Pronunciation',
      description: 'Hear native pronunciation for every word'
    },
    {
      icon: 'rocket-outline',
      title: 'Progress Tracking',
      description: 'Monitor your learning journey with detailed stats'
    }
  ];

  const teamMembers = [
    { name: 'Your Name', role: 'Founder & Developer' },
    { name: 'AI Assistant', role: 'Learning Content' },
    { name: 'Open Source', role: 'Community Contributors' }
  ];

  return (
    <View className="flex-1 bg-gray-50" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 bg-white border-b border-gray-200">
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="mr-3"
        >
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900">About W9999</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View className="bg-white mx-4 my-6 rounded-2xl shadow-sm border border-gray-100 items-center p-6">
          <View className="w-20 h-20 bg-indigo-100 rounded-full items-center justify-center mb-4">
            <Ionicons name="book" size={32} color="#6366F1" />
          </View>
          <Text className="text-2xl font-bold text-gray-900 mb-2">W9999</Text>
          <Text className="text-gray-600 text-center mb-4">
            Master languages by learning the 9999 most essential words
          </Text>
          <Text className="text-indigo-600 font-medium">Version 1.0.0</Text>
        </View>

        {/* App Description */}
        <View className="bg-white mx-4 rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3">Our Mission</Text>
          <Text className="text-gray-600 leading-6">
            W9999 is designed to help language learners quickly acquire the most frequently 
            used words in their target language. By focusing on the essential 9999 words, 
            you'll achieve fluency faster and more efficiently than traditional methods.
          </Text>
        </View>

        {/* Features */}
        <View className="bg-white mx-4 rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Key Features</Text>
          {features.map((feature, index) => (
            <View key={index} className="flex-row items-start mb-4 last:mb-0">
              <View className="w-10 h-10 bg-indigo-100 rounded-full items-center justify-center mr-4 mt-1">
                <Ionicons name={feature.icon} size={20} color="#6366F1" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-medium">{feature.title}</Text>
                <Text className="text-gray-500 text-sm mt-1">{feature.description}</Text>
              </View>
            </View>
          ))}
        </View>

        

        {/* Links */}
        <View className="bg-white mx-4 rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Connect With Us</Text>
          
          <TouchableOpacity 
            className="flex-row items-center py-3 border-b border-gray-100"
            onPress={() => openLink('mailto:support@w9999app.com')}
          >
            <Ionicons name="mail-outline" size={20} color="#6366F1" />
            <Text className="text-gray-900 ml-3 flex-1">Support Email</Text>
            <Ionicons name="open-outline" size={16} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity 
            className="flex-row items-center py-3 border-b border-gray-100"
            onPress={() => openLink('https://w9999app.com')}
          >
            <Ionicons name="globe-outline" size={20} color="#6366F1" />
            <Text className="text-gray-900 ml-3 flex-1">Website</Text>
            <Ionicons name="open-outline" size={16} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity 
            className="flex-row items-center py-3"
            onPress={() => openLink('https://github.com/yourusername/w9999')}
          >
            <Ionicons name="logo-github" size={20} color="#6366F1" />
            <Text className="text-gray-900 ml-3 flex-1">GitHub Repository</Text>
            <Ionicons name="open-outline" size={16} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Legal */}
        <View className="bg-white mx-4 rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <Text className="text-lg font-semibold text-gray-900 mb-3">Legal</Text>
          
          <TouchableOpacity 
            className="py-3 border-b border-gray-100"
            onPress={() => console.log('Open Privacy Policy')}
          >
            <Text className="text-gray-900">Privacy Policy</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="py-3 border-b border-gray-100"
            onPress={() => console.log('Open Terms of Service')}
          >
            <Text className="text-gray-900">Terms of Service</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="py-3"
            onPress={() => console.log('Open Licenses')}
          >
            <Text className="text-gray-900">Open Source Licenses</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View className="items-center pb-8">
          <Text className="text-gray-400 text-sm">Made with ❤️ for language learners</Text>
          <Text className="text-gray-400 text-xs mt-2">© 2024 W9999 App. All rights reserved.</Text>
        </View>
      </ScrollView>
    </View>
  );
}
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PrivacySecurityScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [settings, setSettings] = useState({
    dataCollection: true,
    analytics: true,
    personalizedAds: false,
    crashReports: true,
    marketingEmails: false,
    biometricAuth: false,
    autoBackup: true
  });

  const toggleSetting = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const privacySections = [
    {
      title: 'DATA PRIVACY',
      items: [
        {
          icon: 'analytics-outline',
          title: 'Data Collection',
          description: 'Allow us to collect usage data to improve the app',
          value: settings.dataCollection,
          onToggle: () => toggleSetting('dataCollection')
        },
        {
          icon: 'bar-chart-outline',
          title: 'Analytics',
          description: 'Help us understand how you use the app',
          value: settings.analytics,
          onToggle: () => toggleSetting('analytics')
        },
        {
          icon: 'megaphone-outline',
          title: 'Personalized Ads',
          description: 'See ads tailored to your interests',
          value: settings.personalizedAds,
          onToggle: () => toggleSetting('personalizedAds')
        },
        {
          icon: 'bug-outline',
          title: 'Crash Reports',
          description: 'Automatically send crash reports to help fix issues',
          value: settings.crashReports,
          onToggle: () => toggleSetting('crashReports')
        }
      ]
    },
    {
      title: 'SECURITY',
      items: [
        {
          icon: 'finger-print-outline',
          title: 'Biometric Authentication',
          description: 'Use fingerprint or face ID to secure your account',
          value: settings.biometricAuth,
          onToggle: () => toggleSetting('biometricAuth')
        },
        {
          icon: 'cloud-upload-outline',
          title: 'Auto Backup',
          description: 'Automatically backup your learning progress',
          value: settings.autoBackup,
          onToggle: () => toggleSetting('autoBackup')
        }
      ]
    },
    {
      title: 'COMMUNICATIONS',
      items: [
        {
          icon: 'mail-outline',
          title: 'Marketing Emails',
          description: 'Receive emails about new features and updates',
          value: settings.marketingEmails,
          onToggle: () => toggleSetting('marketingEmails')
        }
      ]
    }
  ];

  const handleDataDeletion = () => {
    Alert.alert(
      "Delete Account Data",
      "This will permanently delete all your data including favorites, progress, and account information. This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            Alert.alert(
              "Confirm Deletion",
              "Are you absolutely sure? This will erase everything.",
              [
                { text: "Cancel", style: "cancel" },
                { 
                  text: "Delete Everything", 
                  style: "destructive",
                  onPress: () => console.log('Data deletion confirmed')
                }
              ]
            );
          }
        }
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      "Export Data",
      "Your data will be prepared for download. This may take a few minutes.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Export", 
          onPress: () => console.log('Exporting data...')
        }
      ]
    );
  };

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
        <Text className="text-xl font-bold text-gray-900">Privacy & Security</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Privacy Notice */}
        <View className="bg-white mx-4 my-6 rounded-2xl shadow-sm border border-gray-100 p-6">
          <View className="flex-row items-start mb-4">
            <Ionicons name="shield-checkmark" size={24} color="#10B981" />
            <Text className="text-lg font-semibold text-gray-900 ml-3">
              Your Privacy Matters
            </Text>
          </View>
          <Text className="text-gray-600 leading-6">
            We're committed to protecting your data. You have full control over 
            what information you share and how it's used for your learning experience.
          </Text>
        </View>

        {/* Privacy Settings */}
        {privacySections.map((section, sectionIndex) => (
          <View key={sectionIndex} className="bg-white mx-4 rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <Text className="text-gray-500 text-sm font-medium mb-4 uppercase tracking-wide">
              {section.title}
            </Text>
            
            {section.items.map((item, itemIndex) => (
              <View key={itemIndex}>
                <View className="flex-row items-center justify-between py-3">
                  <View className="flex-row items-center flex-1">
                    <View className="w-10 h-10 bg-indigo-100 rounded-full items-center justify-center mr-4">
                      <Ionicons name={item.icon} size={20} color="#6366F1" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-gray-900 font-medium">{item.title}</Text>
                      <Text className="text-gray-500 text-sm mt-1">{item.description}</Text>
                    </View>
                  </View>
                  <Switch
                    value={item.value}
                    onValueChange={item.onToggle}
                    trackColor={{ false: '#D1D5DB', true: '#6366F1' }}
                    thumbColor={item.value ? '#FFFFFF' : '#FFFFFF'}
                  />
                </View>
                {itemIndex < section.items.length - 1 && (
                  <View className="h-px bg-gray-100 my-2" />
                )}
              </View>
            ))}
          </View>
        ))}

        {/* Data Management */}
        <View className="bg-white mx-4 rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <Text className="text-gray-500 text-sm font-medium mb-4 uppercase tracking-wide">
            DATA MANAGEMENT
          </Text>
          
          <TouchableOpacity 
            className="flex-row items-center justify-between py-4 border-b border-gray-100"
            onPress={handleExportData}
          >
            <View className="flex-row items-center flex-1">
              <Ionicons name="download-outline" size={20} color="#6366F1" />
              <Text className="text-gray-900 font-medium ml-3">Export My Data</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity 
            className="flex-row items-center justify-between py-4"
            onPress={handleDataDeletion}
          >
            <View className="flex-row items-center flex-1">
              <Ionicons name="trash-outline" size={20} color="#EF4444" />
              <Text className="text-red-600 font-medium ml-3">Delete Account Data</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Legal Links */}
        <View className="bg-white mx-4 rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <Text className="text-gray-500 text-sm font-medium mb-4 uppercase tracking-wide">
            LEGAL
          </Text>
          
          <TouchableOpacity className="py-3 border-b border-gray-100">
            <Text className="text-gray-900">Privacy Policy</Text>
          </TouchableOpacity>

          <TouchableOpacity className="py-3 border-b border-gray-100">
            <Text className="text-gray-900">Terms of Service</Text>
          </TouchableOpacity>

          <TouchableOpacity className="py-3">
            <Text className="text-gray-900">Data Processing Agreement</Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View className="items-center pb-8">
          <Text className="text-gray-400 text-sm">W9999 App v1.0.0</Text>
          <Text className="text-gray-400 text-xs mt-1">Last updated: {new Date().toLocaleDateString()}</Text>
        </View>
      </ScrollView>
    </View>
  );
}
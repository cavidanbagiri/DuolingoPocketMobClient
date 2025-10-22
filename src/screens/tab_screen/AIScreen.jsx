

import React, { useCallback, useEffect, useState } from 'react';
import AIComponent from '../../components/ai/AIComponent';
import TranslateComponent from '../../components/ai/TranslateComponent';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  KeyboardAvoidingView, 
  Platform, 
  SafeAreaView, 
  View, 
  Text, 
  TouchableOpacity,
  StyleSheet 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Tab = createMaterialTopTabNavigator();

export default function AIScreen({route}) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [initialTab] = useState(route.params?.initialTab || 0);

  // Custom header component
  const CustomHeader = () => (
    <View style={[styles.header, { paddingTop: insets.top }]}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="arrow-back" size={24} color="#1F2937" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>AI Assistant</Text>
      <View style={styles.headerRight} />
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top + 60 : 60}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }} edges={['top']}>
        
        {/* Custom Header */}
        <CustomHeader />

        {/* Customized Material Top Tabs */}
        <Tab.Navigator
          initialRouteName={initialTab === 1 ? 'Translate' : 'AI Chat'}
          screenOptions={{
            tabBarStyle: {
              backgroundColor: '#FFFFFF',
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 1,
              borderBottomColor: '#F3F4F6',
            },
            tabBarActiveTintColor: '#6366F1',
            tabBarInactiveTintColor: '#6B7280',
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
              textTransform: 'none',
            },
            tabBarPressColor: 'rgba(99, 102, 241, 0.1)',
            tabBarScrollEnabled: false,
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
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: 'IBMPlexSans-SemiBold',
  },
  headerRight: {
    width: 32, // Same as back button for balance
  },
});




// import React, { useCallback, useEffect, useState } from 'react';
// import AIComponent from '../../components/ai/AIComponent';
// import TranslateComponent from '../../components/ai/TranslateComponent';
// import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';

// import { useLayoutEffect } from 'react';  

// const Tab = createMaterialTopTabNavigator();

// export default function AIScreen({route}) {

//   const insets = useSafeAreaInsets();

//   const [initialTab] = useState(route.params?.initialTab || 0);
  

//   return (

//     <KeyboardAvoidingView
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       // 🔥 Critical: increase offset for Android tab bar + status bar
//       keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top + 60 : 60}
//       style={{ flex: 1 }}
//     >
//       <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }} edges={['top']}>

//         {/* Customized Material Top Tabs */}
//         <Tab.Navigator
//           initialRouteName = {initialTab === 1 ? 'Translate' : 'AI Chat'} // Set initial tab based on param
//           screenOptions={{
//             // 🔽 Tab Bar Style
//             tabBarStyle: {
//               paddingTop: insets.top,
//               backgroundColor: '#FFFFFF',
//               elevation: 0, // Android: remove shadow
//               shadowOpacity: 0, // iOS: remove shadow
//               borderBottomWidth: 1,
//               borderBottomColor: '#F3F4F6',
//             },
//             tabBarActiveTintColor: '#6366F1', // Active tab color (indigo)
//             tabBarInactiveTintColor: '#6B7280', // Inactive tabs
//             tabBarIndicatorStyle: {
//               backgroundColor: '#6366F1',
//               height: 3,
//               borderRadius: 3,
//               marginHorizontal: 16,
//             },
//             tabBarLabelStyle: {
//               fontSize: 15,
//               fontWeight: '600',
//               fontFamily: 'IBMPlexSans-SemiBold',
//               textTransform: 'none', // Don't force uppercase
//             },
//             tabBarPressColor: 'rgba(99, 102, 241, 0.1)', // Ripple effect
//             tabBarScrollEnabled: false, // Disable scroll if only 2 tabs
//             sceneContainerStyle: {
//               backgroundColor: '#FFFFFF',
//             },
//           }}
//         >
//           <Tab.Screen
//             name="AI Chat"
//             component={AIComponent}
//             options={{
//               tabBarTestID: 'ai-tab',
//               accessibilityLabel: 'AI Language Tutor',
//             }}
//           />
//           <Tab.Screen
//             name="Translate"
//             component={TranslateComponent}
//             options={{
//               tabBarTestID: 'translate-tab',
//               accessibilityLabel: 'Translate phrases',
//             }}
//           />
//         </Tab.Navigator>

//       </SafeAreaView>
//     </KeyboardAvoidingView>

//   );
// }

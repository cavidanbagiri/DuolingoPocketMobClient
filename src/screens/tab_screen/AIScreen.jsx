

// AIScreen.jsx
import React from 'react';
import { useEffect } from 'react';
import AIComponent from '../../components/ai/AIComponent';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  KeyboardAvoidingView, 
  Platform, 
  SafeAreaView, 
  TouchableOpacity,
  View,
  Text
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';


export default function AIScreen({ route }) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();


  return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }} edges={['top']}>

        {/* ✅ Custom Header with Back Button */}
        <View
          style={{
            paddingTop: insets.top+10,
            paddingHorizontal: 16,
            paddingBottom: 12,
            backgroundColor: '#fff',
            borderBottomWidth: 1,
            borderBottomColor: '#e5e7eb',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 20, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '500',
              color: '#374151',
              marginLeft: 8,
            }}
          >
            AI Assistant
          </Text>
        </View>

        {/* AI Content */}
        <AIComponent />

      </SafeAreaView>
    // </KeyboardAvoidingView>
  );
}

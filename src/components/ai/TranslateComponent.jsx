

import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons'; // Example icons
import { useState } from 'react';

export default function TranslateComponent({ onClose }) { // Receive close function

  // State will be managed here
  const [fromLang, setFromLang] = useState('en');
  const [toLang, setToLang] = useState('es');
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  // Functions will be defined here
  const handleSwapLanguages = () => {
    setFromLang(toLang);
    setToLang(fromLang);
    setInputText(translatedText);
    setTranslatedText(inputText);
  };

  const handleSaveToFavorites = () => {
    // Logic to save the word/pair
    setIsFavorite(!isFavorite);
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* --- HEADER --- */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={24} color="#374151" />
        </TouchableOpacity>
        
        <Text className="text-lg font-semibold text-gray-900">Translate</Text>
        
        <TouchableOpacity 
        // onPress={() => navigation.navigate('Favorites')}
        >
          <Ionicons name="heart-outline" size={24} color="#374151" />
        </TouchableOpacity>
      </View>

      {/* --- LANGUAGE SELECTORS --- */}
      <View className="flex-row items-center justify-between px-6 py-4 bg-white">
        <TouchableOpacity 
          className="px-5 py-3 bg-blue-100 rounded-full"
          // onPress={() => setShowLangModal('from')}
        >
          <Text className="font-medium text-blue-800">{LANGUAGE_NAMES[fromLang]}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="p-2 bg-gray-100 rounded-full"
          onPress={handleSwapLanguages}
        >
          <Ionicons name="swap-horizontal" size={20} color="#4B5563" />
        </TouchableOpacity>

        <TouchableOpacity 
          className="px-5 py-3 bg-green-100 rounded-full"
          // onPress={() => setShowLangModal('to')}
        >
          <Text className="font-medium text-green-800">{LANGUAGE_NAMES[toLang]}</Text>
        </TouchableOpacity>
      </View>

      {/* --- INPUT/OUTPUT CARD --- */}
      <View className="flex-1 px-5 py-6">
        <View className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Input Section */}
          <View className="p-4 border-b border-gray-100">
            <TextInput
              className="text-gray-900 text-lg min-h-[100px]" 
              multiline
              placeholder="Type text to translate..."
              value={inputText}
              onChangeText={setInputText}
              autoFocus
            />
            <View className="flex-row items-center justify-between mt-3">
              <Text className="text-xs text-gray-500">{inputText.length}/500</Text>
              <TouchableOpacity>
                <Ionicons name="mic-outline" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Output Section */}
          <View className="p-4">
            {translatedText ? (
              <>
                <Text className="text-lg text-gray-900">{translatedText}</Text>
                <View className="flex-row items-center justify-between mt-3">
                  <TouchableOpacity>
                    <Text className="text-sm text-blue-600">Copy</Text>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Ionicons name="volume-medium-outline" size={20} color="#4B5563" />
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <Text className="text-gray-400">Translation will appear here...</Text>
            )}
          </View>
        </View>
      </View>

      {/* --- ACTION BAR (FIXED BOTTOM) --- */}
      <View className="flex-row items-center px-5 py-4 bg-white border-t border-gray-200">
        <TouchableOpacity 
          className={`p-3 rounded-full mr-4 ${isFavorite ? 'bg-red-100' : 'bg-gray-100'}`}
          onPress={handleSaveToFavorites}
        >
          <Ionicons 
            name={isFavorite ? "heart" : "heart-outline"} 
            size={24} 
            color={isFavorite ? "#EF4444" : "#4B5563"} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="flex-1 bg-indigo-600 py-4 rounded-full items-center"
          // onPress={handleTranslate}
          disabled={inputText.length === 0}
        >
          <Text className="text-white font-semibold">Translate</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Helper object for language names
const LANGUAGE_NAMES = {
  en: 'English',
  es: 'Spanish',
  ru: 'Russian',
  tr: 'Turkish',
  // ... add all your supported languages
};
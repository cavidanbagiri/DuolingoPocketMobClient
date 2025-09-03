import { Text, View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import WordService from '../services/WordService.js'

import { useNavigation } from '@react-navigation/native';

import Feather from '@expo/vector-icons/Feather';

import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

import { setSelectedLanguage } from '../store/word_store';

import LanguageSelected from '../components/layouts/LanguageSelected.jsx';

import VocabCard from '../components/cards/VocabCard';
import FilterComponent from '../components/wordscreen/FilterComponent.jsx';

export default function LearnedScreen() {

  const dispatch = useDispatch();

  const { is_auth } = useSelector((state) => state.authSlice);

  const { words, words_pending, selectedLanguage, availableLanguages } = useSelector((state) => state.wordSlice);

  const navigation = useNavigation();

  // const FLAG_IMAGES = {
  //   'English': require('../../assets/flags/england.png'),
  //   'Spanish': require('../../assets/flags/spanish.png'),
  //   'Russian': require('../../assets/flags/russian.png'),
  //   'Turkish': require('../../assets/flags/turkish.png'),
  // };

  useFocusEffect(
    useCallback(() => {
      if (is_auth && availableLanguages.length === 0) {
        dispatch(WordService.fetchAvailableLanguages());
      }
    }, [is_auth])
  );

  useFocusEffect(
    useCallback(() => {
      if (is_auth && selectedLanguage) {
        dispatch(WordService.handleLanguageSelect({
          filter: 'learned',
          langCode: selectedLanguage, // ✅ Now safe — runs when it changes
        }));
      }
    }, [is_auth, dispatch, selectedLanguage]) // ✅ Added dependency
  );


  return (

    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Language Selector */}
      {availableLanguages?.length > 1 && (
        <LanguageSelected screen={'LearnedScreen'} />
      )}
      {/* Loading State */}
      {selectedLanguage && words_pending && (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text className="mt-4 text-gray-600">Loading words...</Text>
        </View>
      )}
      {/* No Words State */}
      {selectedLanguage && !words_pending && words?.length === 0 && (
        <View className="flex-1 justify-center items-center px-6 py-8">
          {/* Icon */}
          <View className="w-16 h-16 bg-indigo-100 rounded-full justify-center items-center mb-5">
            <Feather name="book-open" size={32} color="#4f46e5" />
          </View>
          {/* Message */}
          <Text
            className="text-2xl font-bold text-gray-800 text-center mb-2"
            style={{ fontFamily: 'Poppins-SemiBold' }}
          >
            Not Yet, But Soon!
          </Text>
          {
            selectedLanguage &&
            <Text
              className="text-lg text-gray-600 text-center mb-6 leading-relaxed"
              style={{ fontFamily: 'IBMPlexSans-Regular' }}
            >
              You haven't learned any words in{' '}
              {typeof selectedLanguage === 'object'
                ? selectedLanguage.name
                : selectedLanguage || 'this language'
              }{' '}
              yet.
            </Text>
          }
          {/* CTA Button */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Word', { lang: selectedLanguage })}
            activeOpacity={0.8}
            className="flex-row items-center bg-indigo-600 px-6 py-3 rounded-xl "
          >
            <Feather name="play" size={18} color="white" style={{ marginRight: 8 }} />
            <Text
              className="text-white text-lg font-semibold"
              style={{ fontFamily: 'IBMPlexSans-SemiBold' }}
            >
              Start Learning
            </Text>
          </TouchableOpacity>
          {/* Tip */}
          <Text
            className="text-sm text-gray-500 text-center mt-6"
            style={{ fontFamily: 'IBMPlexSans-Regular' }}
          >
            Tap a word and mark it as learned to track your progress.
          </Text>
        </View>
      )}
      {/* Words List */}
      {selectedLanguage && !words_pending && words?.length > 0 && (
        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}>
          {words.map((word, index) => (
            <VocabCard word={word} key={index} />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  )
}

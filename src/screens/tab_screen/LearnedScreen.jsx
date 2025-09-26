import { Text, View, ActivityIndicator } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

import WordService from '../../services/WordService.js'

import LanguageSelected from '../../components/layouts/LanguageSelected.jsx';

import FilterComponent from '../../components/layouts/FilterComponent.jsx';
import WordList from '../../components/layouts/WordList.jsx';
import EmptyWordsComponents from '../../components/learned/EmptyWordsComponents.jsx';

export default function LearnedScreen() {

  const dispatch = useDispatch();

  const { is_auth } = useSelector((state) => state.authSlice);

  const { words, words_pending, selectedLanguage, available_lang_toggle,statistics, loading } = useSelector((state) => state.wordSlice);

  const [filter, setFilter] = useState('all');


  useFocusEffect(
    useCallback(() => {
      if (is_auth && statistics.length === 0) {
        dispatch(WordService.getStatisticsForDashboard());
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
      {/* Filter Component */}
      {
        selectedLanguage && 
        <FilterComponent
            filter={filter}
            setFilter={setFilter}
            screen={'LearnedScreen'}
        />
      }
      {/* Language Selector */}
      {available_lang_toggle && (
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
        <EmptyWordsComponents />
      )}
      {/* Words List */}
      {selectedLanguage && !words_pending && words?.length > 0 && (
        <WordList filter={'learned'} screen={'LearnedScreen'} />
      )}
    </SafeAreaView>
  )
}

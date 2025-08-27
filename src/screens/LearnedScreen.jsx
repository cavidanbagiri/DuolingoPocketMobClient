import { Text, View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import WordService from '../services/WordService.js'

import Feather from '@expo/vector-icons/Feather';

import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

import { setSelectedLanguage } from '../store/word_store';

import VocabCard from '../components/cards/VocabCard';
import FilterComponent from '../components/wordscreen/FilterComponent.jsx';

export default function LearnedScreen() {

  const dispatch = useDispatch();

  const { is_auth } = useSelector((state) => state.authSlice);

  const { words, words_pending, selectedLanguage, availableLanguages } = useSelector((state) => state.wordSlice);


  useFocusEffect(
    useCallback(() => {
      if (is_auth && availableLanguages.length === 0) {
        dispatch(WordService.fetchAvailableLanguages());
      }
    }, [is_auth])
  );


  useFocusEffect(
    useCallback(() => {
      if (is_auth) {
        dispatch(WordService.handleLanguageSelect({
          langCode: selectedLanguage,
          filter: 'learned'
        }));
      }
    }, [is_auth, dispatch])
  );



  return (


    // <SafeAreaView className="flex-1 bg-gray-50">

    //   {availableLanguages?.length > 1 && (
    //     <View >
    //       <Text>Select Language:</Text>
    //       <View >
    //         {availableLanguages.map((lang) => (
    //           <TouchableOpacity
    //             key={lang.lang}
    //             onPress={() => {
    //               dispatch(setSelectedLanguage(lang.lang));
    //               dispatch(WordService.handleLanguageSelect({
    //                 filter: 'learned',
    //                 langCode: lang.lang
    //               }))
    //             }}
    //           >
    //             <Text>{lang.language_name}</Text>
    //             <Text>({lang.total_words} words)</Text>
    //           </TouchableOpacity>
    //         ))}
    //       </View>
    //     </View>
    //   )}

    //   {
    //     (selectedLanguage && words_pending) &&
    //     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
    //       <ActivityIndicator
    //         size="large"
    //         color="#0000ff" // Change to your preferred color
    //       />
    //       <Text style={{ marginTop: 10 }}>Loading words...</Text>
    //     </View>
    //   }

    //   {
    //     (selectedLanguage && !words_pending && words?.length === 0) &&
    //     <View className="px-6 py-8 bg-blue-400">
    //         <View className="w-16 h-16 bg-indigo-100 rounded-full justify-center items-center mb-5">
    //           <Feather name="book-open" size={32} color="#4f46e5" />
    //         </View>

    //         {/* Main Message */}
    //         <Text
    //           className="text-2xl font-bold text-gray-800 text-center mb-2"
    //           style={{ fontFamily: 'Poppins-SemiBold' }}
    //         >
    //           Not Yet, But Soon!
    //         </Text>

    //         <Text
    //           className="text-lg text-gray-600 text-center mb-6 leading-relaxed"
    //           style={{ fontFamily: 'IBMPlexSans-Regular' }}
    //         >
    //           You haven't learned any words in {selectedLanguage} yet.
    //         </Text>
    //         <TouchableOpacity
    //           onPress={() => navigation.navigate('Learn', { lang: selectedLanguage })}
    //           activeOpacity={0.8}
    //           className="flex-row items-center bg-indigo-600 px-6 py-3 rounded-xl shadow-md"
    //         >
    //           <Feather name="play" size={18} color="white" style={{ marginRight: 8 }} />
    //           <Text
    //             className="text-white text-lg font-semibold"
    //             style={{ fontFamily: 'IBMPlexSans-SemiBold' }}
    //           >
    //             Start Learning
    //           </Text>
    //         </TouchableOpacity>

    //         {/* Optional Tip */}
    //         <Text
    //           className="text-sm text-gray-500 text-center mt-6"
    //           style={{ fontFamily: 'IBMPlexSans-Regular' }}
    //         >
    //           Tap a word and mark it as learned to track your progress.
    //         </Text>
    //     </View>
    //   }


    //   {/* Words list */}
    //   {
    //     (selectedLanguage && !words_pending && words?.length > 0) &&
    //     words?.map((word, index) => (
    //       <VocabCard word={word} key={index} />
    //     ))
    //   }




    // </SafeAreaView>


    <SafeAreaView className="flex-1 bg-gray-50"> {/* ✅ Add flex-1 here */}
      {/* Language Selector */}
      {availableLanguages?.length > 1 && (
        <View className="px-4 mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-2">Select Language:</Text>
          <View className="flex-row flex-wrap gap-2 bg-red-400">
            {availableLanguages.map((lang) => (
              <TouchableOpacity
                key={lang.lang}
                onPress={() => {
                  dispatch(setSelectedLanguage(lang.lang));
                  dispatch(
                    WordService.handleLanguageSelect({
                      filter: 'learned',
                      langCode: lang.lang,
                    })
                  );
                }}
                className="px-4 py-2 bg-blue-100 rounded-full"
              >
                <Text className="text-gray-800">{lang.language_name}</Text>
                <Text className="text-sm text-gray-600">({lang.total_words} words)</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
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
            selectedLanguage && <Text
            className="text-lg text-gray-600 text-center mb-6 leading-relaxed"
            style={{ fontFamily: 'IBMPlexSans-Regular' }}
          >
            You haven't learned any words in {selectedLanguage} yet.
          </Text>
          }

          {/* CTA Button */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Learn', { lang: selectedLanguage })}
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


{/* <ScrollView contentContainerStyle={styles.container}>
        {words_pending && (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
            <ActivityIndicator
              size="large"
              color="#0000ff" // Change to your preferred color
            />
            <Text style={{ marginTop: 10 }}>Loading words...</Text>
          </View>
        )}

        {!words_pending && words?.length === 0 && (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>
            There is not any learned words yet.
          </Text>
        )}

        {!words_pending && words?.length > 0 &&
          words?.map((word, index) => (
            <VocabCard word={word} key={index} />
          ))
        }
      </ScrollView> */}

import { Text, View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, FlatList, Image } from 'react-native';

import React, {  useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';

import { useDispatch, useSelector } from 'react-redux';

import LanguageSelector from '../components/wordscreen/LanguageSelector.jsx';

import { setSelectedLanguage } from '../store/word_store';

import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

import WordService from '../services/WordService.js';

import VocabCard from '../components/cards/VocabCard';
import FilterComponent from '../components/wordscreen/FilterComponent.jsx';

import Feather from '@expo/vector-icons/Feather';
import LanguageSelected from '../components/layouts/LanguageSelected.jsx';
import EmptyStarredComponent from '../components/home/EmptyStarredComponent.jsx';
import WordList from '../components/layouts/WordList.jsx';

// WordsScreen.jsx
export default function WordScreen() {
    const dispatch = useDispatch();

    const { words, loading, selectedLanguage, available_lang_toggle, statistics } = useSelector((state) => state.wordSlice);

    const [filter, setFilter] = useState('all');

    const { is_auth } = useSelector((state) => state.authSlice);


    useFocusEffect(
        useCallback(() => {
            if (is_auth) {
                dispatch(WordService.getStatisticsForDashboard());
            }
        }, [is_auth])
    );

    // ✅ Fetch words when selectedLanguage OR filter changes
    useFocusEffect(
        useCallback(() => {
            if (is_auth && selectedLanguage) {
                dispatch(
                    WordService.handleLanguageSelect({
                        filter,
                        langCode: selectedLanguage,
                    })
                );
            }
        }, [is_auth, dispatch, selectedLanguage, filter]) // ✅ Added `filter`
    );


    useEffect(() => {
        if (statistics.length === 1) {
            const lang_code = statistics[0]['language_code'];
            dispatch(setSelectedLanguage(lang_code));
            dispatch(
                WordService.handleLanguageSelect({
                    filter: 'all',
                    langCode: lang_code,
                })
            );
            setFilter('all'); // Sync local state
        }
    }, [statistics]);



    return (
        <SafeAreaView className='bg-white flex-1'>

            {
                selectedLanguage &&
                <FilterComponent
                    filter={filter}
                    setFilter={setFilter}
                    screen={'WordScreen'}
                />
            }

            {/* Language Selector */}
            {available_lang_toggle && (

                <LanguageSelected screen={'WordScreen'} />

            )}



            {/* Check if starred is empty */}
            {
                filter === 'starred' && words?.length === 0 &&
                <EmptyStarredComponent selectedLanguage={selectedLanguage} />
            }


            {/* Words List */}
            {selectedLanguage ? (
                <WordList filter={filter} screen={'WordScreen'} />
            )
                : (
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
                            Choose language
                        </Text>

                        {
                            selectedLanguage && <Text
                                className="text-lg text-gray-600 text-center mb-6 leading-relaxed"
                                style={{ fontFamily: 'IBMPlexSans-Regular' }}
                            >
                                You haven't learned any words in {selectedLanguage} yet.
                            </Text>
                        }

                        {/* Tip */}
                        <Text
                            className="text-sm text-gray-500 text-center mt-6"
                            style={{ fontFamily: 'IBMPlexSans-Regular' }}
                        >
                            Tap the language for words.
                        </Text>
                    </View>
                )}

        </SafeAreaView>
    );
}


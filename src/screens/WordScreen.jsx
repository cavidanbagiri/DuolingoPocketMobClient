
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, FlatList, Image } from 'react-native';

import React, { Component, use, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';

import { useDispatch, useSelector } from 'react-redux';

import LanguageSelector from '../components/wordscreen/LanguageSelector.jsx';

import {setSelectedLanguage} from '../store/word_store';

import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

import WordService from '../services/WordService.js';

import VocabCard from '../components/cards/VocabCard';
import FilterComponent from '../components/wordscreen/FilterComponent.jsx';

import Feather from '@expo/vector-icons/Feather'; 

// WordsScreen.jsx
export default function WordScreen() {
    const dispatch = useDispatch();

    const {words, loading, selectedLanguage, availableLanguages} = useSelector((state) => state.wordSlice);

    const { is_auth } = useSelector((state) => state.authSlice);

    const [screen, setScreen] = useState('all');

    useFocusEffect(
        useCallback(() => {
            if (is_auth) {
                dispatch(WordService.fetchAvailableLanguages());
            }
        }, [is_auth])
    );
    
    useEffect(() => {
        if (availableLanguages.length === 1) {
            dispatch(WordService.handleLanguageSelect({
                filter: 'all',
                langCode: availableLanguages[0].lang
            }));
            dispatch(setSelectedLanguage(availableLanguages[0].lang));
            setScreen('all');
        }
    }, [availableLanguages]);


    return (
        <SafeAreaView className='bg-white'>

            {
                selectedLanguage &&
                <FilterComponent screen={screen} setScreen={setScreen}/>
            }

            {/* Language Selector */}
            {availableLanguages?.length > 1 && (
                
                <View className="px-3 pb-1 bg-white border-b border-gray-100">

                    {/* Section Header */}
                    <Text
                        className="text-xl font-bold text-gray-800 mb-4 tracking-tight"
                        style={{ fontFamily: 'IBMPlexSans-Regular' }}
                    >
                        Choose Language
                    </Text>

                    {/* Language List */}
                    <View className="space-y-3 ">
                        {availableLanguages.map((lang) => {
                            const isSelected = selectedLanguage === lang.lang;

                            return (
                                <TouchableOpacity
                                    key={lang.lang}
                                    onPress={() => {
                                        dispatch(setSelectedLanguage(lang.lang));
                                        dispatch(
                                            WordService.handleLanguageSelect({
                                                filter: 'all',
                                                langCode: lang.lang,
                                            })
                                        );
                                    }}
                                    activeOpacity={0.7}
                                    className={`flex-row items-center p-4 rounded-2xl border-2 transition-all duration-150 my-1 ${
                                        isSelected
                                            ? 'border-blue-500 bg-blue-50 '
                                            : 'border-gray-200 bg-white hover:border-gray-300 '
                                    }`}
                                    style={{
                                        elevation: isSelected ? 3 : 1,
                                    }}
                                >
                                    {/* Flag Badge */}
                                    <View className="w-12 h-10 rounded-xl overflow-hidden border-2 border-white mr-4">
                                        <Image
                                            source={lang.flag}
                                            style={{ width: '100%', height: '100%' }}
                                            resizeMode="cover"
                                        />
                                    </View>

                                    {/* Language Info */}
                                    <View className="flex-1">
                                        <Text
                                            className={`text-base font-bold ${
                                                isSelected ? 'text-gray-900' : 'text-gray-800'
                                            }`}
                                            style={{ fontFamily: 'IBMPlexSans-SemiBold' }}
                                        >
                                            {lang.language_name}
                                        </Text>

                                        <View className="flex-row items-center mt-1">
                                            <Text
                                                className="text-sm text-gray-500"
                                                style={{ fontFamily: 'IBMPlexSans-Regular' }}
                                            >
                                                {lang.total_words} words
                                            </Text>
                                            <View className="mx-1 w-1 h-1 bg-gray-400 rounded-full" />
                                            <Text
                                                className={`text-sm ${
                                                    isSelected ? 'text-blue-600' : 'text-gray-500'
                                                }`}
                                                style={{ fontFamily: 'IBMPlexSans-Regular' }}
                                            >
                                                Tap to select
                                            </Text>
                                        </View>
                                    </View>

                                    {/* Selection Indicator */}
                                    <View
                                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                            isSelected ? 'border-blue-500 bg-blue-100' : 'border-gray-300'
                                        }`}
                                    >
                                        {isSelected && (
                                            <View className="w-2 h-2 rounded-full bg-blue-600" />
                                        )}
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            )}

            {/* Words List */}
            {selectedLanguage ? (
                <FlatList
                className='bg-white mt-1'
                    data={words}
                    renderItem={({ item }) => <VocabCard word={item} />}
                    keyExtractor={(item) => item.id.toString()}
                    refreshing={loading}
                    onRefresh={() => {
                        dispatch(setSelectedLanguage(selectedLanguage));
                        dispatch(WordService.handleLanguageSelect({
                            filter: 'all',
                            langCode: selectedLanguage
                        }))
                    }}
                />
            ) : (
                <Text>Please select a language</Text>
            )}
            
        </SafeAreaView>
    );
}


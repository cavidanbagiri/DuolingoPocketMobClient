

import { Text, View, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'

import { useDispatch, useSelector } from 'react-redux';

import { setSelectedLanguage } from '../../store/word_store';

import WordService from '../../services/WordService';


const FLAG_IMAGES = {
    'English': require('../../../assets/flags/england.png'),
    'Spanish': require('../../../assets/flags/spanish.png'),
    'Russian': require('../../../assets/flags/russian.png'),
    'Turkish': require('../../../assets/flags/turkish.png'),
};

export default function LanguageSelected({ screen }) {

    const dispatch = useDispatch();

    const { selectedLanguage, statistics } = useSelector((state) => state.wordSlice);

    const [filter, setFilter] = useState('all');

    return (
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
                {/*  Inside of the return of available languages, return with an index */}
                {statistics?.map((lang, index) => {
                    const isSelected = selectedLanguage === lang.language_code;

                    return (
                        <TouchableOpacity
                            key={index}
                            onPress={() => {
                                const new_lang_code = lang.language_code;
                                dispatch(setSelectedLanguage(new_lang_code));
                                if (screen === 'WordScreen') {
                                    dispatch(
                                        WordService.handleLanguageSelect({
                                            filter: 'all',
                                            langCode: new_lang_code,
                                        })
                                    );
                                }
                                else if (screen === 'LearnedScreen') {
                                    dispatch(
                                        WordService.handleLanguageSelect({
                                            filter: 'learned',
                                            langCode: new_lang_code,
                                        })
                                    );
                                }
                            }}
                            activeOpacity={0.7}
                            className={`flex-row items-center p-4 rounded-2xl border-2 transition-all duration-150 my-1 ${isSelected
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
                                    source={FLAG_IMAGES[lang.language_name]}
                                    style={{ width: '100%', height: '100%' }}
                                    resizeMode="cover"
                                />
                            </View>

                            {/* Language Info */}
                            <View className="flex-1">

                                <Text
                                    className={`text-base font-bold ${isSelected ? 'text-gray-900' : 'text-gray-800'
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
                                        {lang.learned_words} words
                                    </Text>
                                    <View className="mx-1 w-1 h-1 bg-gray-400 rounded-full" />
                                    <Text
                                        className={`text-sm ${isSelected ? 'text-blue-600' : 'text-gray-500'
                                            }`}
                                        style={{ fontFamily: 'IBMPlexSans-Regular' }}
                                    >
                                        Learned Words
                                    </Text>
                                </View>

                                <View className="flex-row items-center mt-1">
                                    <Text
                                        className="text-sm text-gray-500"
                                        style={{ fontFamily: 'IBMPlexSans-Regular' }}
                                    >
                                        {lang.total_words} words
                                    </Text>
                                    <View className="mx-1 w-1 h-1 bg-gray-400 rounded-full" />
                                    <Text
                                        className={`text-sm ${isSelected ? 'text-blue-600' : 'text-gray-500'
                                            }`}
                                        style={{ fontFamily: 'IBMPlexSans-Regular' }}
                                    >
                                        Tap to select
                                    </Text>
                                </View>


                            </View>




                            {/* Selection Indicator */}
                            <View
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-blue-500 bg-blue-100' : 'border-gray-300'
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
    )
}


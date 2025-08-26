
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
                                            ? 'border-blue-500 bg-blue-50 shadow-md'
                                            : 'border-gray-200 bg-white hover:border-gray-300 shadow-sm'
                                    }`}
                                    style={{
                                        elevation: isSelected ? 3 : 1,
                                    }}
                                >
                                    {/* Flag Badge */}
                                    <View className="w-12 h-10 rounded-xl overflow-hidden border-2 border-white shadow-xs mr-4">
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
                    // onRefresh={() => handleLanguageSelect(selectedLanguage)}
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




// export default function WordScreen() {
//     const dispatch = useDispatch();
//     const { is_auth } = useSelector((state) => state.authSlice);
//     const { 
//         wordsData, 
//         availableLanguages, 
//         selectedLanguage, 
//         words, 
//         words_pending, 
//         is_words_error, 
//         is_words_success 
//     } = useSelector((state) => state.wordSlice);

//     const [localSelectedLang, setLocalSelectedLang] = useState(null);

//     useFocusEffect(
//         useCallback(() => {
//             if (is_auth) {
//                 dispatch(WordService.fetchWords({ filter: 'all' }));
//             }
//         }, [is_auth, dispatch])
//     );

//     // Sync local state with Redux state
//     useEffect(() => {
//         setLocalSelectedLang(selectedLanguage);
//     }, [selectedLanguage]);

//     const handleLanguageSelect = (langCode) => {
//         setLocalSelectedLang(langCode);
        
//         // Find words for the selected language
//         const selectedLangData = wordsData.find(data => data.lang === langCode);
//         if (selectedLangData) {
//             // You might want to dispatch this to Redux or keep it locally
//             // For simplicity, we'll use local state
//         }
//     };

//     // Get words for currently selected language
//     const currentWords = localSelectedLang 
//         ? wordsData.find(data => data.lang === localSelectedLang)?.words || []
//         : words; // Fallback to old structure

//     return (
//         <SafeAreaView className={'bg-white'}>
//             {/* <FilterComponent screen='all'/> */}
            
//             {/* Language Selector */}
//             <LanguageSelector
//                 languages={availableLanguages}
//                 selectedLanguage={localSelectedLang}
//                 onSelectLanguage={handleLanguageSelect}
//             />

//             <ScrollView contentContainerStyle={styles.container}>
//                 {words_pending && (
//                     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
//                         <ActivityIndicator size="large" color="#0000ff" />
//                         <Text style={{ marginTop: 10 }}>Loading words...</Text>
//                     </View>
//                 )}

//                 {/* Show language selection prompt if multiple languages */}
//                 {!words_pending && availableLanguages.length > 1 && !localSelectedLang && (
//                     <View style={{ padding: 20, alignItems: 'center' }}>
//                         <Text style={{ textAlign: 'center', fontSize: 16, color: '#666' }}>
//                             Please select a language to view words
//                         </Text>
//                     </View>
//                 )}

//                 {/* Show words for selected language */}
//                 {!words_pending && localSelectedLang && currentWords?.length === 0 && (
//                     <Text style={{ textAlign: 'center', marginTop: 20 }}>
//                         No words found for {getLanguageName(localSelectedLang)}
//                     </Text>
//                 )}

//                 {/* Show words */}
//                 {!words_pending && localSelectedLang && currentWords?.length > 0 && (
//                     currentWords.map((word, index) => (
//                         <VocabCard word={word} key={index} />
//                     ))
//                 )}

//                 {/* Fallback for single language (old behavior) */}
//                 {!words_pending && availableLanguages.length === 1 && currentWords?.length > 0 && (
//                     currentWords.map((word, index) => (
//                         <VocabCard word={word} key={index} />
//                     ))
//                 )}
//             </ScrollView>
//         </SafeAreaView>
//     );
// }


// Helper function (add this outside the component)
// const getLanguageName = (code) => {
//     const langMap = {
//         'ru': 'Russian',
//         'en': 'English',
//         'tr': 'Turkish',
//         'es': 'Spanish'
//     };
//     return langMap[code] || code;
// };



// const styles = StyleSheet.create({
//     container: {
//         alignItems: 'center',
//         paddingVertical: 20,
//     },
// });





























// import { Text, View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';

// import React, { Component, useEffect } from 'react'
// import { SafeAreaView } from 'react-native-safe-area-context';

// import { useDispatch, useSelector } from 'react-redux';



// import { useFocusEffect } from '@react-navigation/native';
// import { useCallback } from 'react';



// import WordService from '../services/WordService.js';

// import VocabCard from '../components/cards/VocabCard';
// import FilterComponent from '../components/wordscreen/FilterComponent.jsx';


// export default function WordScreen() {

//     const dispatch = useDispatch();

//     const { is_auth } = useSelector((state) => state.authSlice);

//     const { words, words_pending, is_words_error, is_words_success } = useSelector((state) => state.wordSlice);

//     useFocusEffect(
//         useCallback(() => {
//             if (is_auth) {
//             dispatch(WordService.fetchWords({ filter: 'all' }));
//             }
//         }, [is_auth, dispatch])
//     );

//     return (

//         <SafeAreaView className={'bg-white'}>
//             {/* <FilterComponent screen='all'/> */}

//             <ScrollView contentContainerStyle={styles.container}>
//                 {words_pending && (
//                     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
//                         <ActivityIndicator
//                             size="large"
//                             color="#0000ff" // Change to your preferred color
//                         />
//                         <Text style={{ marginTop: 10 }}>Loading words...</Text>
//                     </View>
//                 )}

//                 {!words_pending && words?.length === 0 && (
//                     <Text style={{ textAlign: 'center', marginTop: 20 }}>
//                         There is not any starred word
//                     </Text>
//                 )}

//                 {/* Words list */}
//                 {/* {!words_pending && words?.length > 0 &&
//                     words.map((word, index) => (
//                         <VocabCard word={word} key={index} />
//                     ))
//                 } */}


//             </ScrollView>
//         </SafeAreaView>

//     )
// }


// const styles = StyleSheet.create({
//     container: {
//         alignItems: 'center',
//         paddingVertical: 20,
//     },
// });
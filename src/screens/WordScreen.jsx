
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';

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

import $api from '../http/api.js';

// WordsScreen.jsx
export default function WordScreen() {
    const dispatch = useDispatch();

    const {words, loading, selectedLanguage} = useSelector((state) => state.wordSlice);

    const { is_auth } = useSelector((state) => state.authSlice);
    const [availableLanguages, setAvailableLanguages] = useState([]);

    useFocusEffect(
        useCallback(() => {
            if (is_auth) {
                fetchAvailableLanguages();
                // dispatch(WordService.fetchAvailableLanguages());
            }
        }, [is_auth])
    );


    const fetchAvailableLanguages = async () => {
        try {
            const response = await $api.get('/words/user/languages');
            setAvailableLanguages(response.data);
            
            if (response.data.length === 1) {
                dispatch(WordService.handleLanguageSelect(response.data[0].lang));
                dispatch(setSelectedLanguage(response.data[0].lang));
            }
        } catch (error) {
            console.error('Error fetching languages:', error);
        }
    };

    return (
        <SafeAreaView>
            {/* Language Selector */}
            {availableLanguages.length > 1 && (
                <View >
                    <Text>Select Language:</Text>
                    <View >
                        {availableLanguages.map((lang) => (
                            <TouchableOpacity
                                key={lang.lang}
                                onPress={() => {
                                    dispatch(setSelectedLanguage(lang.lang));
                                    dispatch(WordService.handleLanguageSelect(lang.lang))
                                }}
                            >
                                <Text>{lang.language_name}</Text>
                                <Text>({lang.total_words} words)</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            )}

            {/* Words List */}
            {selectedLanguage ? (
                <FlatList
                    data={words}
                    renderItem={({ item }) => <VocabCard word={item} />}
                    keyExtractor={(item) => item.id.toString()}
                    refreshing={loading}
                    // onRefresh={() => handleLanguageSelect(selectedLanguage)}
                    onRefresh={() => {
                        dispatch(setSelectedLanguage(selectedLanguage));
                        dispatch(WordService.handleLanguageSelect(selectedLanguage))
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
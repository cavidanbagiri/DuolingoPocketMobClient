

import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons'; // Example icons
import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import TranslateService from '../../services/TranslateService';
import TRANSLATE_LANGUAGES_LIST from '../../constants/TranslateLanguagesList';
import LANGUAGES from '../../constants/Languages';
import LanguagePickerModal from './LanguagePickerModal';
import debounce from 'lodash.debounce';
import VoiceButtonComponent from '../cards/VoiceButtonComponent';

import * as SecureStore from 'expo-secure-store';
import { clearTranslatedText } from '../../store/translate_store';

export default function TranslateComponent({ onClose }) { // Receive close function

    const navigation = useNavigation();

    const dispatch = useDispatch();

    const { translatedText, loading, error } = useSelector((state) => state.translateSlice);
    const { selectedLanguage } = useSelector((state) => state.wordSlice);

    // State will be managed here
    const [fromLang, setFromLang] = useState(null);
    const [toLang, setToLang] = useState(null);
    const [inputText, setInputText] = useState('');
    const [isFavorite, setIsFavorite] = useState(false);
    const [showLangModal, setShowLangModal] = useState(null);

    
    const handleSwapLanguages = () => {
        const currentFromLang = fromLang;
        const currentToLang = toLang;
        const currentTranslation = translatedText?.translation || '';

        // Update state immediately (no timeout needed)
        setFromLang(currentToLang);
        setToLang(currentFromLang);
        
        if (currentTranslation) {
            setInputText(currentTranslation);
        }
    };

    // Then use useEffect to handle the translation when languages change
    useEffect(() => {
        if (inputText && fromLang && toLang) {
            const timer = setTimeout(() => {
                dispatch(TranslateService.translateText({
                    text: inputText,
                    from_lang: fromLang,
                    to_lang: toLang,
                })).unwrap();
            }, 350);
            
            return () => clearTimeout(timer);
        }
    }, [fromLang, toLang, dispatch, inputText]); // ← Add inputText to dependencies


    const handleSaveToFavorites = () => {
        setIsFavorite(!isFavorite);
    };
    
    const handleTextChange = useCallback(
        debounce((text) => {
            if (text && fromLang && toLang) {
                dispatch(TranslateService.translateText({
                    text: text,
                    from_lang: fromLang,
                    to_lang: toLang,
                })).unwrap();
            }
        }, 300),
        [fromLang, toLang, dispatch]
    );

    useEffect(() => {
        const getNativeLang = async () => {
            try {
                const native = await SecureStore.getItemAsync('native');
                const lang_code = LANGUAGES.find(lang => lang.name === native)?.code;
                
                // Only set fromLang if it hasn't been set yet
                if (lang_code && !fromLang) {
                    setFromLang(lang_code);
                }
            } catch (error) {
                console.error('Failed to load native language', error);
            }
        };
        getNativeLang();
    }, []);

    useEffect(() => {
        if (selectedLanguage) {
            setToLang(selectedLanguage);
        }
    }, []);

    return (
        <View className="flex-1 bg-gray-50">
            {/* --- HEADER --- */}
            <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200">

                <Text className="text-lg font-semibold text-gray-900">Translate</Text>

                <TouchableOpacity
                    onPress={() => navigation.navigate('Favorites')}
                >
                    <Ionicons name="heart-outline" size={24} color="#374151" />
                </TouchableOpacity>
            </View>

            {/* --- LANGUAGE SELECTORS --- */}
            <View className="flex-row items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
                <TouchableOpacity
                    onPress={() => setShowLangModal('from')}
                    activeOpacity={0.7}
                    className="flex-1 max-w-[45%] px-5 py-3 bg-gray-100 rounded-full flex-row items-center justify-center space-x-2"
                    accessibilityLabel={`Translate from ${TRANSLATE_LANGUAGES_LIST[fromLang]}`}
                >
                    <Text className="font-semibold text-gray-800 truncate">
                    {TRANSLATE_LANGUAGES_LIST[fromLang]}
                    </Text>
                </TouchableOpacity>
                <LanguagePickerModal
                    visible={showLangModal === 'from'}
                    onClose={() => setShowLangModal(null)}
                    onSelect={(langCode) => setFromLang(langCode)}
                    selectedLang={fromLang}
                    excludeLang={toLang}
                    title="Translate from"
                />

                {/* Swap Button */}
                <TouchableOpacity
                    onPress={handleSwapLanguages}
                    activeOpacity={0.6}
                    className="p-3 bg-indigo-100 rounded-full mx-1"
                    accessibilityLabel="Swap languages"
                    accessibilityHint="Switch translation direction"
                >
                    <Ionicons name="swap-horizontal" size={20} color="#6366F1" />
                </TouchableOpacity>

                {/* "To" Language Pill */}
                <LanguagePickerModal
                    visible={showLangModal === 'to'}
                    onClose={() => setShowLangModal(null)}
                    onSelect={(langCode) => setToLang(langCode)}
                    selectedLang={toLang}
                    excludeLang={fromLang}
                    title="Translate to"
                />
                <TouchableOpacity
                    onPress={() => setShowLangModal('to')}
                    activeOpacity={0.7}
                    className="flex-1 max-w-[45%] px-5 py-3 bg-indigo-100 rounded-full flex-row items-center justify-center space-x-2"
                    accessibilityLabel={`Translate to ${TRANSLATE_LANGUAGES_LIST[toLang]}`}
                >
                    <Text className="font-semibold text-indigo-800 truncate">
                    {TRANSLATE_LANGUAGES_LIST[toLang]}
                    </Text>
                </TouchableOpacity>

            </View>

            {/* --- INPUT/OUTPUT CARD --- */}
            <View className="flex-1 px-5 py-6">
                <View className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <TouchableOpacity 
                        className='flex-row justify-end p-2'
                            onPress={() => {
                                dispatch(clearTranslatedText());
                                setInputText('');
                            }}
                        >
                        <Ionicons name="close" size={24} color="#9CA3AF" />
                    </TouchableOpacity>
                    {/* Input Section */}
                    <View className="px-4 pb-4 border-b border-gray-100">
                        <TextInput
                            className="text-gray-900 text-lg min-h-[100px] "
                            multiline
                            placeholder="Type text to translate..."
                            value={inputText}
                            onChangeText={(text) => {
                                setInputText(text);
                                handleTextChange(text);
                            }}
                            autoFocus
                            textAlignVertical="top"
                        />
                        <View className="flex-row items-center justify-between mt-3 "> 
                            <Text className="text-xs text-gray-500">{inputText.length}/500</Text>
                            <View className='flex-row items-center'>
                                <VoiceButtonComponent text={inputText} language={fromLang} />
                                <TouchableOpacity className='ml-2'>
                                    <Ionicons name="sparkles-outline" size={20} color="#4B5563" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className={`ml-4`}
                                    onPress={handleSaveToFavorites}
                                >
                                    <Ionicons
                                        name={isFavorite ? "heart" : "heart-outline"}
                                        size={20}
                                        color={isFavorite ? "#EF4444" : "#4B5563"}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {/* Output Section */}
                    <View className="p-4">
                        {translatedText ? (
                            <>
                                <Text className="text-lg text-gray-900">{translatedText.translation}</Text>
                                <View className="flex-row items-center justify-between mt-3">
                                    <TouchableOpacity>
                                        <Text className="text-sm text-blue-600">Copy</Text>
                                    </TouchableOpacity>
                                    <VoiceButtonComponent text={translatedText.translation} language={toLang} />
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
                    onPress={() =>{
                        dispatch(TranslateService.translateText({
                            text: inputText,
                            from_lang: fromLang,
                            to_lang: toLang,
                        })).unwrap();
                    }}
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
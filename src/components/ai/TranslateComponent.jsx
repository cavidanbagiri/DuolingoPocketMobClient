



import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons'; // Example icons
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import TranslateService from '../../services/TranslateService';
import TRANSLATE_LANGUAGES_LIST from '../../constants/TranslateLanguagesList';
import LanguagePickerModal from './LanguagePickerModal';

export default function TranslateComponent({ onClose }) { // Receive close function

    const navigation = useNavigation();

    const dispatch = useDispatch();

    const { translatedText, loading, error } = useSelector((state) => state.translateSlice);

    // State will be managed here
    const [fromLang, setFromLang] = useState('en');
    const [toLang, setToLang] = useState('tr');
    const [inputText, setInputText] = useState('');
    const [isFavorite, setIsFavorite] = useState(false);
    const [showLangModal, setShowLangModal] = useState(null);

    // Functions will be defined here
    const handleSwapLanguages = () => {
        // const from = toLang;
        // const to = fromLang;
        const text = translatedText.translation;
        setFromLang(toLang);
        setToLang(fromLang);
        setInputText(translatedText.translation);
        dispatch(TranslateService.translateText({
            text: text,
            from_lang: toLang,
            to_lang: fromLang,
        })).unwrap();
    };

    const handleSaveToFavorites = () => {
        setIsFavorite(!isFavorite);
    };

    const handleTextChange = (text) => {
        setInputText(text);
        dispatch(TranslateService.translateText({
            text: text,
            from_lang: fromLang,
            to_lang: toLang,
        })).unwrap();
    };

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
                    {/* Input Section */}
                    <View className="p-4 border-b border-gray-100">
                        <TextInput
                            className="text-gray-900 text-lg min-h-[100px]"
                            multiline
                            placeholder="Type text to translate..."
                            value={inputText}
                            onChangeText={handleTextChange}
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
                                <Text className="text-lg text-gray-900">{translatedText.translation}</Text>
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
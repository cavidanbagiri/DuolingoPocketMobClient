

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { clearDetail, setDetail } from '../../store/word_store';
import WordService from '../../services/WordService';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { setCurrentWord } from '../../store/ai_store';
import VoiceButtonComponent from '../../components/layouts/VoiceButtonComponent';

export default function CardDetailScreen({ route }) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { word } = route.params;

  const { selectedLanguage } = useSelector((state) => state.wordSlice);
  const detail = useSelector((state) => state.wordSlice.detail);
  const loading = useSelector((state) => state.wordSlice.loading);

  useEffect(() => {
    dispatch(WordService.getDetailWord(word.id));
    return () => {
      dispatch(clearDetail());
    };
  }, [word]);

  const toggleStatus = (actionKey) => {
    const actionType = actionKey === 'is_starred' ? 'star' : 'learned';
    const value = !detail[actionKey];
    dispatch(setDetail({ actionType, value }));
    dispatch(
      WordService.setStatus({
        word_id: detail?.id,
        action: actionType,
      })
    );
  };

  if (loading || !detail || !Array.isArray(detail.meanings)) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#6366f1" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header with Back Button */}
      <View className="px-6 pt-4 pb-2 border-b border-gray-100">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="flex-row items-center p-2 -ml-2"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color="#374151" />
            <Text className="ml-1 text-gray-600 font-medium" style={{ fontFamily: 'IBMPlexSans-SemiBold' }}>
              Back
            </Text>
          </TouchableOpacity>

          <View className="flex-row items-center">
            <View className="bg-indigo-100 px-3 py-1 rounded-full">
              <Text className="text-indigo-700 text-xs font-medium" style={{ fontFamily: 'IBMPlexSans-SemiBold' }}>
                {detail?.level || 'A1'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 20 }}
        showsVerticalScrollIndicator={false}
      >

         {/* Action Buttons - Floating Bar */}
        <View className="bg-white rounded-2xl p-3 mb-8 shadow-lg border border-gray-100">
          <View className="flex-row justify-around items-center">
            <TouchableOpacity
              onPress={() => toggleStatus('is_starred')}
              className={`flex-col items-center justify-center p-3 rounded-xl ${detail?.is_starred ? 'bg-amber-50' : 'bg-transparent'
                }`}
            >
              <View className={`w-10 h-10 rounded-full items-center justify-center ${detail?.is_starred ? 'bg-amber-100' : 'bg-gray-100'
                }`}>
                <Ionicons
                  name={detail?.is_starred ? 'star' : 'star-outline'}
                  size={20}
                  color={detail?.is_starred ? '#f59e0b' : '#6b7280'}
                />
              </View>
              <Text
                className={`mt-2 text-xs font-medium ${detail?.is_starred ? 'text-amber-700' : 'text-gray-600'
                  }`}
                style={{ fontFamily: 'IBMPlexSans-SemiBold' }}
              >
                {detail?.is_starred ? 'Starred' : 'Star'}
              </Text>
            </TouchableOpacity>

            <View className="h-8 w-px bg-gray-200" />

            <TouchableOpacity
              onPress={() => toggleStatus('is_learned')}
              className={`flex-col items-center justify-center p-3 rounded-xl ${detail?.is_learned ? 'bg-emerald-50' : 'bg-transparent'
                }`}
            >
              <View className={`w-10 h-10 rounded-full items-center justify-center ${detail?.is_learned ? 'bg-emerald-100' : 'bg-gray-100'
                }`}>
                <Ionicons
                  name={detail?.is_learned ? 'checkmark-circle' : 'checkmark-circle-outline'}
                  size={20}
                  color={detail?.is_learned ? '#10b981' : '#6b7280'}
                />
              </View>
              <Text
                className={`mt-2 text-xs font-medium ${detail?.is_learned ? 'text-emerald-700' : 'text-gray-600'
                  }`}
                style={{ fontFamily: 'IBMPlexSans-SemiBold' }}
              >
                {detail?.is_learned ? 'Learned' : 'Learn'}
              </Text>
            </TouchableOpacity>

            <View className="h-8 w-px bg-gray-200" />

            <TouchableOpacity
              onPress={() => {
                dispatch(setCurrentWord(word));
                navigation.navigate('AIScreen');
              }}
              className="flex-col items-center justify-center p-3 rounded-xl"
            >
              <View className="w-10 h-10 rounded-full items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500">
                <Ionicons name="sparkles" size={20} color="#3b82f6" />
              </View>
              <Text
                className="mt-2 text-xs font-medium text-gray-600"
                style={{ fontFamily: 'IBMPlexSans-SemiBold' }}
              >
                AI Tutor
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Word Header Section */}
        <View className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-3xl mb-6 border border-indigo-100">
          <View className="flex-row items-start justify-between mb-4">
            <View className="flex-1">
              <Text
                className="text-4xl font-bold text-gray-900 mb-2"
                style={{ fontFamily: 'Poppins-Bold' }}
              >
                {detail?.text}
              </Text>
              <Text
                className="text-xl text-indigo-600 mb-4"
                style={{ fontFamily: 'Poppins-Regular' }}
              >
                {detail?.translations[0]?.translated_text ?? 'No translation available'}
              </Text>
            </View>
            <VoiceButtonComponent
              text={word?.text}
              language={selectedLanguage}
              size="large"
            />
          </View>

          {/* Meta Info */}
          <View className="flex-row flex-wrap gap-2">
            <View className="bg-white px-3 py-2 rounded-2xl shadow-xs border border-gray-200">
              <Text className="text-xs text-gray-500 font-medium" style={{ fontFamily: 'IBMPlexSans-SemiBold' }}>
                Frequency
              </Text>
              <Text className="text-sm text-gray-900 font-bold" style={{ fontFamily: 'Poppins-SemiBold' }}>
                #{detail?.frequency_rank || '–'}
              </Text>
            </View>

            {!detail?.is_learned && (
              <View className="bg-white px-3 py-2 rounded-2xl shadow-xs border border-gray-200">
                <Text className="text-xs text-gray-500 font-medium" style={{ fontFamily: 'IBMPlexSans-SemiBold' }}>
                  Strength
                </Text>
                <View className="flex-row items-center">
                  <Text className="text-sm text-gray-900 font-bold mr-1" style={{ fontFamily: 'Poppins-SemiBold' }}>
                    {detail?.strength || 0}%
                  </Text>
                  <View className="w-8 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <View
                      className="h-full bg-orange-500 rounded-full"
                      style={{ width: `${detail?.strength || 0}%` }}
                    />
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>


        {/* Meanings Section */}
        <View className="mb-8">
          <View className="flex-row items-center mb-6">
            <View className="w-1 h-6 bg-indigo-500 rounded-full mr-3" />
            <Text
              className="text-2xl font-bold text-gray-900"
              style={{ fontFamily: 'Poppins-Bold' }}
            >
              Meanings & Examples
            </Text>
          </View>

          {detail?.meanings?.map((m, index) => (
            <View
              key={m.id}
              className="bg-gray-50 p-5 rounded-2xl mb-4 border border-gray-200"
            >
              {/* POS Badge */}
              <View className="flex-row items-center justify-between mb-3">
                <View className="bg-indigo-500 px-3 py-1 rounded-full">
                  <Text
                    className="text-xs uppercase tracking-wide text-white font-bold"
                    style={{ fontFamily: 'IBMPlexSans-Bold' }}
                  >
                    {m.pos}
                  </Text>
                </View>
                <View className="w-2 h-2 bg-indigo-300 rounded-full" />
              </View>

              {/* Example */}
              <View className="mb-4">
                <Text
                  className="text-base text-gray-700 leading-7"
                  style={{ fontFamily: 'Poppins-Regular' }}
                >
                  "{m.example}"
                </Text>
              </View>

              {/* Sentences */}
              {m.sentences.length > 0 && (
                <View className="mt-4 pt-4 border-t border-gray-200">
                  <Text
                    className="text-sm font-semibold text-gray-600 mb-3"
                    style={{ fontFamily: 'IBMPlexSans-SemiBold' }}
                  >
                    Usage in context:
                  </Text>
                  {m.sentences.map((s) => (
                    <View key={s.id} className="mb-4 last:mb-0">
                      <View className="flex-row items-start mb-2">
                        <View className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 mr-3" />
                        <Text
                          className="flex-1 text-sm text-gray-800 leading-6"
                          style={{ fontFamily: 'Poppins-Regular' }}
                        >
                          {s.text}
                        </Text>
                      </View>
                      {s.translations.map((t, i) => (
                        <View key={i} className="ml-4 mb-1">
                          <Text
                            className="text-sm text-gray-500 italic"
                            style={{ fontFamily: 'IBMPlexSans-Regular' }}
                          >
                            {t.language_code.toUpperCase()}: {t.translated_text}
                          </Text>
                        </View>
                      ))}
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Additional Example Sentences */}
        {detail?.example_sentences?.length > 0 && (
          <View className="mb-6">
            <View className="flex-row items-center mb-6">
              <View className="w-1 h-6 bg-purple-500 rounded-full mr-3" />
              <Text
                className="text-2xl font-bold text-gray-900"
                style={{ fontFamily: 'Poppins-Bold' }}
              >
                More Examples
              </Text>
            </View>

            {detail?.example_sentences?.map((s) => (
              <View
                key={s.id}
                className="bg-white p-5 rounded-2xl mb-4 border border-gray-200 shadow-xs"
              >
                <Text
                  className="text-base text-gray-800 mb-3 leading-7"
                  style={{ fontFamily: 'Poppins-Regular' }}
                >
                  {s.text}
                </Text>
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    {s.translations.map((t, i) => (
                      <Text
                        key={i}
                        className="text-sm text-gray-500 italic"
                        style={{ fontFamily: 'IBMPlexSans-Regular' }}
                      >
                        {t.language_code.toUpperCase()}: {t.translated_text}
                      </Text>
                    ))}
                  </View>
                  <VoiceButtonComponent
                    text={s.text}
                    language={selectedLanguage}
                    size="small"
                  />
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Bottom Spacer */}
        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff'
  },
});



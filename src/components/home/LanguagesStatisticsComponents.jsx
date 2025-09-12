import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';

import { useDispatch, useSelector } from 'react-redux';

import { LinearGradient } from 'expo-linear-gradient';

import { useNavigation } from '@react-navigation/native';

import WordService from '../../services/WordService';

import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { setSelectedLanguage } from '../../store/word_store';

const getLanguageGradient = (langCode) => {
  const gradients = {
    en: ['#22c55e', '#BBF7D0'], // Green - English
    es: ['#f97316', '#fed7aa'], // Orange - Spanish
    fr: ['#3b82f6', '#bfdbfe'], // Blue - French
    de: ['#18181b', '#a3a3a3'], // Gray - German
    ja: ['#ec4899', '#fbcfe8'], // Pink - Japanese
    ru: ['#ef4444', '#fecaca'], // Red - Russian
    default: ['#8b5cf6', '#e0e7ff'], // Purple
  };
  return gradients[langCode] || gradients.default;
};

export default function LanguagesStatisticsComponents() {

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { is_auth } = useSelector((state) => state.authSlice);
  const { statistics } = useSelector((state) => state.wordSlice);

  useFocusEffect(
    useCallback(() => {
      if (is_auth) {
        dispatch(WordService.getStatisticsForDashboard());
      }
    }, [is_auth, dispatch])
  );

  return (

    <View  className="flex-1 bg-gray-50 py-6 rounded-2xl mt-5">

      {/* Screen Title */}
      <Text
        className="text-3xl font-bold text-gray-800 mb-2 text-center"
        style={{ fontFamily: 'Poppins-Bold' }}
      >
        Your Progress
      </Text>

      <Text
        className="text-lg text-gray-500 mb-6 text-center"
        style={{ fontFamily: 'IBMPlexSans-Regular' }}
      >
        See how far you've come 🌱
      </Text>

      {/* Scrollable Stats */}
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {statistics && statistics.length > 0 ? (
          statistics?.map((item, index) => (
            <Pressable
              key={index}
              onPress={() => {
                // Navigate to the Word tab and pass parameters
                navigation.navigate('Tabs', { 
                  screen: 'Word',
                  // params: { selectedLanguage: item.language_code }
                });
                dispatch(setSelectedLanguage(item.language_code))
              }}
              className="rounded-3xl overflow-hidden mt-5 shadow-lg bg-white border border-gray-100"
            >
              {/* Gradient Header */}
              <LinearGradient
                colors={getLanguageGradient(item.language_name)} // Dynamic by language
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="p-5"
              >
                {/* Language Name & Code */}
                <View className="flex-row items-start justify-between mb-3">
                  <Text
                    className="text-lg text-white opacity-90"
                    style={{ fontFamily: 'Poppins-SemiBold' }}
                  >
                    {item.language_name}
                  </Text>
                </View>

                {/* Motivational Message */}
                <Text
                  className="text-white text-base mb-4 leading-relaxed"
                  style={{ fontFamily: 'IBMPlexSans-Regular' }}
                >
                  🚀 You've learned{' '}
                  <Text className="font-semibold">{item.learned_words}</Text> words!{' '}
                  Just{' '}
                  <Text className="font-semibold">
                    {item.total_words - item.learned_words}
                  </Text>{' '}
                  to go!
                </Text>

                {/* Stats Cards */}
                <View className="flex-row justify-between">
                  {[
                    { label: 'Total', value: item.total_words, icon: '📚' },
                    { label: 'Learned', value: item.learned_words, icon: '✅' },
                    { label: 'Starred', value: item.starred_words, icon: '⭐' },
                  ].map((stat, i) => (
                    <View
                      key={i}
                      className="flex-1 mx-1 bg-white/20 p-3 rounded-xl backdrop-blur-sm border border-white/30"
                    >
                      <Text
                        className="text-white text-xs font-medium text-center opacity-90"
                        style={{ fontFamily: 'IBMPlexSans-Regular' }}
                      >
                        {stat.icon} {stat.label}
                      </Text>
                      <Text
                        className="text-white text-xl font-bold text-center mt-1"
                        style={{ fontFamily: 'Poppins-Bold' }}
                      >
                        {stat.value}
                      </Text>
                    </View>
                  ))}
                </View>
              </LinearGradient>

              {/* Progress Bar (Optional) */}
              <View className="p-4 bg-gray-50">
                <View className="flex-row justify-between mb-1">
                  <Text
                    className="text-xs text-gray-500"
                    style={{ fontFamily: 'IBMPlexSans-Regular' }}
                  >
                    Progress
                  </Text>
                  <Text
                    className="text-xs text-gray-600"
                    style={{ fontFamily: 'IBMPlexSans-Regular' }}
                  >
                    {((item.learned_words / item.total_words) * 100).toFixed(2)}%
                  </Text>
                </View>
                <View className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <View
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    style={{
                      width: `${(item.learned_words / item.total_words) * 100}%`,
                    }}
                  />
                </View>
              </View>
            </Pressable>
          ))
        ) : (
          <View className="flex-1 justify-center items-center py-10">
            <Text
              className="text-gray-500 text-lg"
              style={{ fontFamily: 'IBMPlexSans-Regular' }}
            >
              No stats yet. Start learning to see your progress!
            </Text>
          </View>
        )}
      </ScrollView>
    </View >


  );
}



const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 5,
  },
  boxContainer: {
    width: '100%',
  },
  langBox: {
    height: 150,
    width: '100%',
    backgroundColor: '#f3f3f3',
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 15,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  langLeft: {
    justifyContent: 'center',
  },
  langName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  stats: {
    fontSize: 13,
    color: '#555',
  },
});



import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';

import WordService from '../../services/WordService';

import { Feather } from '@expo/vector-icons';
import VoiceButtonComponent from '../layouts/VoiceButtonComponent';


export default function VocabCard({ word, language }) {

  const dispatch = useDispatch();

  const navigation = useNavigation();

  const [isStarred, setIsStarred] = useState(false);
  const [isLearned, setIsLearned] = useState(false);


  const handleToggle = async (actionType) => {
    try {
      const res = await dispatch(WordService.setStatus({
        word_id: word.id,
        action: actionType,
      })).unwrap();

      setIsStarred(res.is_starred);
      setIsLearned(res.is_learned);

    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };



  useEffect(() => {
    setIsStarred(word.is_starred);
    setIsLearned(word.is_learned);
  }, [word.id, word.is_starred, word.is_learned]);



  return (

    <TouchableOpacity
      onPress={() => navigation.navigate('CardDetail', { word })}
      activeOpacity={0.7}
      className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm mb-4 mx-3"

    >
      {/* Top Row: Word + Level Badge */}
      <View className="flex-row items-start justify-between mb-3">
        <Text
          className="text-2xl font-bold text-gray-800 flex-1"
          style={{ fontFamily: 'Poppins-Bold' }}
        >
          {word.text}
        </Text>

        <View className="ml-3 bg-indigo-100 px-2.5 py-1 rounded-full">
          <Text
            className="text-xs font-semibold text-indigo-700"
            style={{ fontFamily: 'IBMPlexSans-SemiBold' }}
          >
            Level {word.level ?? '1'}
          </Text>
        </View>
      </View>

      {/* Middle: POS + Translation */}
      <View className="mb-4">
        {word.pos && (
          <Text
            className="text-xs uppercase tracking-wide text-indigo-600 mb-1"
            style={{ fontFamily: 'IBMPlexSans-Regular' }}
          >
            {word.pos}
          </Text>
        )}
        <Text
          className="text-xl text-gray-700 leading-relaxed"
          style={{ fontFamily: 'Poppins-Regular' }}
        >
          {word.translation_to_native ?? 'Translation'}
        </Text>
      </View>

      {/* Bottom: Frequency + Action Icons */}
      <View className="flex-row items-center justify-between">
        {/* Frequency Rank */}
        <View className="flex-row items-center">
          <View className="w-6 h-6 bg-gray-100 rounded-full items-center justify-center mr-2">
            <Feather name="trending-up" size={12} color="#6b7280" />
          </View>
          <Text
            className="text-sm text-gray-500"
            style={{ fontFamily: 'IBMPlexSans-Regular' }}
          >
            #{word.frequency_rank ?? '–'}
          </Text>
        </View>

        {/* Action Icons */}
        <View className="flex-row items-center space-x-4">
          {/* Star Toggle */}
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation(); // Prevent card navigation
              handleToggle('star');
            }}
            className="p-2"
            accessibilityLabel={isStarred ? "Remove from favorites" : "Add to favorites"}
          >
            <Ionicons
              name={isStarred ? 'star' : 'star-outline'}
              size={20}
              color={isStarred ? '#facc15' : '#4B5563'}
            />
          </TouchableOpacity>

          {/* Learned Toggle */}
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation(); // Prevent card navigation
              handleToggle('learned');
            }}
            className="p-2"
            accessibilityLabel={isLearned ? "Mark as not learned" : "Mark as learned"}
          >
            <Ionicons
              name={isLearned ? 'checkmark-circle' : 'checkmark-circle-outline'}
              size={20}
              color={isLearned ? '#4ade80' : '#4B5563'}
            />
          </TouchableOpacity>


          <VoiceButtonComponent text={word.text} language={language} />

        </View>
      </View>
    </TouchableOpacity>

  );
}

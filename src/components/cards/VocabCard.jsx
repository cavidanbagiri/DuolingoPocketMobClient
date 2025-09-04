

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Tts from 'react-native-tts';
import { useDispatch } from 'react-redux';
import { Audio } from 'expo-av';
// import { Audio } from 'expo-audio';
import { generateSpeech } from '../../api/audio';

import WordService from '../../services/WordService';

import { Feather } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';


export default function VocabCard({ word, language }) {

  const dispatch = useDispatch();

  const navigation = useNavigation();

  const [isStarred, setIsStarred] = useState(false);
  const [isLearned, setIsLearned] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Ref to hold our Sound object
  const soundRef = useRef(new Audio.Sound());

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




const playSound = async (wordText) => {
  if (isPlaying) return;
  setIsPlaying(true);

  try {
    const status = await soundRef.current.getStatusAsync();
    if (status.isLoaded) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
    }

    // 1. Call the API directly, NOT through Redux
    const audioBlob = await generateSpeech({
      text: wordText,
      language: language,
    });


    // ... (rest of your code to save the blob and play it remains the same) ...
    const fileName = `${wordText}_${Date.now()}.mp3`;
    const localUri = `${FileSystem.cacheDirectory}${fileName}`;

    const reader = new FileReader();
    const base64 = await new Promise((resolve, reject) => {
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(audioBlob);
    });

    await FileSystem.writeAsStringAsync(localUri, base64, {
      encoding: FileSystem.EncodingType.Base64,
    });

    await soundRef.current.loadAsync({ uri: localUri });
    await soundRef.current.playAsync();

    soundRef.current.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) {
        setIsPlaying(false);
      }
    });

  } catch (error) {
    console.error('Failed to play sound', error);
    Alert.alert("Error", "Could not play audio. Please try again.");
    setIsPlaying(false);
  }
};


// Cleanup: Unload sound when component unmounts
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);


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
              size={24}
              color={isStarred ? '#facc15' : '#9ca3af'}
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
              size={24}
              color={isLearned ? '#4ade80' : '#9ca3af'}
            />
          </TouchableOpacity>

        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            playSound(word.text);
          }}
          className="p-2"
          accessibilityLabel="Play pronunciation"
          disabled={isPlaying} // Disable button while playing
        >
          <AntDesign 
            name={'sound'}
            size={24}
            color={isPlaying ? '#d1d5db' : '#9ca3af'} // Change color when playing
          />
        </TouchableOpacity>

        </View>
      </View>
    </TouchableOpacity>

  );
}

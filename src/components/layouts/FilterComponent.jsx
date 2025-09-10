
import React from 'react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import Feather from '@expo/vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';


import { setAvailableLangToggle } from '../../store/word_store';


import WordService from '../../services/WordService';

const FilterComponent = ({ filter, setFilter, screen }) => {

  const navigation = useNavigation();

  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = useState('');

  const { selectedLanguage, available_lang_toggle } = useSelector((state) => state.wordSlice);

  const toggleFilter = () => {
    console.log('toggle filter is working ', filter)
    const newFilter = filter === 'all' ? 'starred' : 'all';
    setFilter(newFilter);
  };

  useEffect(() => {
    if (selectedLanguage) {
    }
  }, [filter, selectedLanguage]);

  return (

    <View className="px-5 pb-4 pt-2 bg-white border-b border-gray-100">

      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          navigation.navigate('SearchScreen');
        }}
        className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 mb-3"
        activeOpacity={0.7}
        accessibilityLabel="Search words"
        accessibilityHint="Opens search screen to find vocabulary"
      >
        <Ionicons name="search" size={18} color="#6b7280" />
        
        <Text
          className="ml-3 text-gray-500 text-base"
          style={{ fontFamily: 'IBMPlexSans-Regular' }}
        >
          Search words...
        </Text>

        {/* Optional: Chevron icon for affordance */}
        <Ionicons
          name="chevron-forward"
          size={18}
          color="#9ca3af"
          className="ml-auto"
        />
      </TouchableOpacity>

      {/* Filter & Actions Row */}
      <View className="flex-row items-center justify-between">

        {/* Filter Toggle: Starred vs All */}
        {
          screen === 'WordScreen' &&
          <TouchableOpacity
            onPress={toggleFilter}
            activeOpacity={0.7}
            className="flex-row items-center space-x-2 bg-gray-100 px-4 py-2.5 rounded-full"

          >
            <Ionicons
              name={filter === 'starred' ? 'star' : 'star-outline'}
              size={20}
              color={filter === 'starred' ? '#facc15' : '#6b7280'}
            />
            <Text
              className={`font-semibold ${filter === 'starred' ? 'text-amber-700' : 'text-gray-700'
                }`}
              style={{ fontFamily: 'IBMPlexSans-SemiBold' }}
            >
              {filter === 'starred' ? 'Starred' : 'All Words'}
            </Text>
          </TouchableOpacity>
        }

        {/* Toggle Language Button */}
        <TouchableOpacity
          onPress={() => {
            dispatch(setAvailableLangToggle(!available_lang_toggle));
          }}
          activeOpacity={0.7}
          className="flex-row items-center space-x-2 bg-gray-100 px-4 py-2.5 rounded-full"

        >
          <Ionicons
            name={available_lang_toggle ? 'checkmark-circle' : 'checkmark-circle-outline'}
            size={20}
            color={available_lang_toggle ? '#facc15' : '#6b7280'}
          />
          <Text
            className={`font-semibold ${available_lang_toggle ? 'text-amber-700' : 'text-gray-700'
              }`}
            style={{ fontFamily: 'IBMPlexSans-SemiBold' }}
          >
            {available_lang_toggle ? 'Available' : 'All'}
          </Text>
        </TouchableOpacity>

        {/* Refresh Button */}
        <TouchableOpacity
          onPress={() => {
            let new_filter;
            if (screen === 'LearnedScreen') {
              new_filter = 'learned';
            }
            else if (screen === 'WordScreen') {
              new_filter = 'all';
            }
            setFilter(new_filter);
            setSearchQuery('');
            dispatch(
              WordService.handleLanguageSelect({
                filter:new_filter,
                langCode: selectedLanguage,
              })
            );
          }}
          activeOpacity={0.6}
          className="w-10 h-10 bg-gray-200 rounded-full justify-center items-center"

        >
          <Feather name="refresh-cw" size={18} color="#4b5563" />
        </TouchableOpacity>


      </View>

    </View>


  );
};

export default FilterComponent;


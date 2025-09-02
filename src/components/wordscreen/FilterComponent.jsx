
import React from 'react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Make sure this is installed
import Feather from '@expo/vector-icons/Feather';

import { setWordsPendingFalse } from '../../store/word_store';


import WordService from '../../services/WordService';
import PosStatistics from "./PosStatistics";

const FilterComponent = ({ filter, setFilter }) => {

  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = useState('');

  const { selectedLanguage } = useSelector((state) => state.wordSlice);

  const toggleFilter = () => {
    const newFilter = filter === 'all' ? 'starred' : 'all';
    setFilter(newFilter);
  };

  useEffect(() => {
    if (selectedLanguage) {
    }
  }, [filter, selectedLanguage]);

  return (

    <View className="px-5 pb-4 pt-2 bg-white border-b border-gray-100">

      {/* 🔍 Search Bar */}
      <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 mb-3">
        <Ionicons name="search" size={18} color="#6b7280" />

        <TextInput
          placeholder="Search words..."
          placeholderTextColor="#6b7280"
          value={searchQuery}
          onChangeText={setSearchQuery}
          className="flex-1 ml-2 text-base text-gray-800"
          style={{ fontFamily: 'IBMPlexSans-Regular' }}
          autoCapitalize="none"
          returnKeyType="search"
        />

        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#9ca3af" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter & Actions Row */}
      <View className="flex-row items-center justify-between">

        {/* Filter Toggle: Starred vs All */}
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

        {/* Refresh Button */}
        <TouchableOpacity
          onPress={() => {
            setFilter('all');
            setSearchQuery('');
            dispatch(
              WordService.handleLanguageSelect({
                filter,
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


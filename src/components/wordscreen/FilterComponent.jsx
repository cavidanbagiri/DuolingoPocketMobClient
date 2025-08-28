
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

    // // const [filter, setFilter] = useState('all'); // 'all' or 'starred'

    // const [searchQuery, setSearchQuery] = useState('');

    // const { selectedLanguage, availableLanguages } = useSelector((state) => state.wordSlice);

    // const toggleFilter = () => {
    //     setFilter(prev => prev === 'all' ? 'starred' : 'all');
    // };

    // useEffect(() => {
    //     dispatch(WordService.handleLanguageSelect({
    //       langCode: selectedLanguage,
    //       filter: filter
    //     }));
    //     setStarred(filter === 'starred' ? true : false);
    // }, [filter]);

    // useEffect(() => {
    //     setFilter('all');
    // }, [selectedLanguage]);

    const [searchQuery, setSearchQuery] = useState('');

  const { selectedLanguage } = useSelector((state) => state.wordSlice);

  const toggleFilter = () => {
    const newFilter = filter === 'all' ? 'starred' : 'all';
    setFilter(newFilter);
  };

  // ✅ Remove the effect that resets filter on language change
  // We no longer need: useEffect(() => { setFilter('all'); }, [selectedLanguage]);

  // ✅ Sync with Redux when filter changes
  useEffect(() => {
    if (selectedLanguage) {
      // This is already handled in WordScreen via useFocusEffect
      // But if you want immediate UI feedback, keep it
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
        className={`font-semibold ${
          filter === 'starred' ? 'text-amber-700' : 'text-gray-700'
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
            // langCode: selectedLanguage,
            // filter: 'all',
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

  {/* Optional Hint Text */}
  {/* {screen !== 'learned' && (
    <Text
      className="text-xs text-gray-500 mt-2 ml-1"
      style={{ fontFamily: 'IBMPlexSans-Regular' }}
    >
      Tap the star to toggle favorites
    </Text>
  )} */}
</View>


        // <View className='flex flex-col px-10 py-5 '>

        //     {
        //         screen !== 'learned' &&
        //         <View className='flex flex-row justify-between'>
                    
        //             <TouchableOpacity className='flex flex-row  justify-center items-center'
        //             onPress={toggleFilter}>
        //                 <Ionicons
        //                     name={filter === 'starred' ? 'star' : 'star-outline'}
        //                     size={20}
        //                     color={filter === 'starred' ? '#facc15' : '#6b7280'}
        //                     style={styles.icon}
        //                 />
        //                 <Text className='text-xl text-gray-800 font-medium'>
        //                     {filter === 'starred' ? 'Starred' : 'All'}
        //                 </Text>
        //             </TouchableOpacity>

        //             <TouchableOpacity className=' p-1'
        //             onPress={() => {
        //                 setFilter('all')
        //                 // dispatch(WordService.fetchWords())
        //                 dispatch(WordService.handleLanguageSelect({
        //                     langCode: selectedLanguage,
        //                     filter: 'all'
        //                 }));
        //             }}>
        //                 <Feather name="refresh-ccw" size={24} color="black" />
        //             </TouchableOpacity>

        //         </View>

        //     }

        // </View>

        

    );
};

export default FilterComponent;


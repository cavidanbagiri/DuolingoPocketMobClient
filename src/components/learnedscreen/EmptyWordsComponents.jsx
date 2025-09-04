import { Text, View, TouchableOpacity } from 'react-native'
import React, {  } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';


import Feather from '@expo/vector-icons/Feather';


export default function EmptyWordsComponents() {

    const navigation = useNavigation();

    
  const { selectedLanguage} = useSelector((state) => state.wordSlice);

    return (
        <View className="flex-1 justify-center items-center px-6 py-8">
          {/* Icon */}
          <View className="w-16 h-16 bg-indigo-100 rounded-full justify-center items-center mb-5">
            <Feather name="book-open" size={32} color="#4f46e5" />
          </View>
          {/* Message */}
          <Text
            className="text-2xl font-bold text-gray-800 text-center mb-2"
            style={{ fontFamily: 'Poppins-SemiBold' }}
          >
            Not Yet, But Soon!
          </Text>
          {
            selectedLanguage &&
            <Text
              className="text-lg text-gray-600 text-center mb-6 leading-relaxed"
              style={{ fontFamily: 'IBMPlexSans-Regular' }}
            >
              You haven't learned any words in{' '}
              {typeof selectedLanguage === 'object'
                ? selectedLanguage.name
                : selectedLanguage || 'this language'
              }{' '}
              yet.
            </Text>
          }
          {/* CTA Button */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Word', { lang: selectedLanguage })}
            activeOpacity={0.8}
            className="flex-row items-center bg-indigo-600 px-6 py-3 rounded-xl "
          >
            <Feather name="play" size={18} color="white" style={{ marginRight: 8 }} />
            <Text
              className="text-white text-lg font-semibold"
              style={{ fontFamily: 'IBMPlexSans-SemiBold' }}
            >
              Start Learning
            </Text>
          </TouchableOpacity>
          {/* Tip */}
          <Text
            className="text-sm text-gray-500 text-center mt-6"
            style={{ fontFamily: 'IBMPlexSans-Regular' }}
          >
            Tap a word and mark it as learned to track your progress.
          </Text>
        </View>
    )

}



import { Text, View } from 'react-native'
import React, { Component } from 'react'
import Feather from '@expo/vector-icons/Feather';

export default function EmptyStarredComponent({selectedLanguage}) {



    return (
        <View className="flex-1 justify-center items-center px-6 py-8">
            {/* Icon */}
            <View className="w-16 h-16 bg-yellow-100 rounded-full justify-center items-center mb-5">
                <Feather name="star" size={32} color="#eab308" />
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
                    You haven't starred any words
                    in{' '}
                    {typeof selectedLanguage === 'object'
                        ? selectedLanguage.name
                        : selectedLanguage || 'this language'
                    }{' '}
                    yet.
                </Text>
            }

        </View>
    )

}
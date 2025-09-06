import { Text, View, Image, TouchableOpacity } from 'react-native'
import React, {  } from 'react'

import { useNavigation } from '@react-navigation/native'; 

export default function InitialPageComponent() {

    
  const navigation = useNavigation(); // 👈 Get navigation object

    return (
        <View className="flex-1 bg-white p-6">
            {/* Welcome Section */}
            <View className="items-center mt-20 mb-6">
                <Text
                    style={{ fontFamily: 'Poppins-Regular' }}
                    className="text-5xl font-bold text-gray-800"
                >
                    Welcome
                </Text>
            </View>

            {/* Logo Image */}
            <View className="items-center mb-8">
                <Image
                    source={require('../../../assets/logo.png')}
                    style={{
                        width: '70%',
                        marginTop: 20,
                        marginBottom: 20,
                        height: 100,
                        resizeMode: 'cover',
                    }}
                />
            </View>

            {/* Feature Card */}
            <View
                className="bg-white p-6 rounded-2xl mb-8 "
            >
                <Text
                    style={{ fontFamily: 'OpenSans-Regular' }}
                    className="text-2xl text-center text-gray-800 mb-2 font-bold"
                >
                    Learn Top Words
                </Text>
                <Text
                    style={{ fontFamily: 'IBMPlexSans-Regular' }}
                    className="text-center text-lg text-gray-600 leading-relaxed"
                >
                    Master the most common words in 3 languages through real-life sentences and interactive practice.
                </Text>
            </View>

            {/* Call-to-Action Button */}
            <TouchableOpacity
                className="flex flex-row justify-center items-center mt-12 bg-blue-600 py-4 rounded-xl shadow-md"
                onPress={() => {
                    navigation.navigate('Login/Register')
                }}
                activeOpacity={0.8}
            >
                <Text
                    style={{ fontFamily: 'IBMPlexSans-SemiBold' }}
                    className="text-white text-lg"
                >
                    Continue Learning
                </Text>
            </TouchableOpacity>

            {/* Optional: Sign Up Link (small) */}
            <View className="mt-4 items-center">
                <Text
                    style={{ fontFamily: 'IBMPlexSans-Regular' }}
                    className="text-sm text-gray-500"
                >
                    New here?{' '}
                    <Text className="text-blue-600 font-semibold"
                        onPress={() => {
                            navigation.navigate('Login/Register')
                        }}
                    >Create an account</Text>
                </Text>
            </View>
        </View>

    )
}


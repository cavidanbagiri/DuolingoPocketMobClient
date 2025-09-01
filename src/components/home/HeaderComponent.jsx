
import React, { useState, useEffect } from 'react';

import { Text, View, Image } from 'react-native'

import Feather from '@expo/vector-icons/Feather';

import * as SecureStore from 'expo-secure-store';


export default function HeaderComponent({ username }) {


  const [nativeLangCode, setNativeLangCode] = useState(null);
  

  // Load native language from SecureStore
    useEffect(() => {
      const getNativeLang = async () => {
        const native = await SecureStore.getItemAsync('native');
        setNativeLangCode(native);
        setIsLoading(false); // ← Mark as loaded
      };
      getNativeLang();
    }, []);

  return (


    <View className='flex flex-row items-center mt-5 w-full border border-gray-100 rounded-2xl bg-white/90 px-4 py-5 shadow-sm'>
      {/* Profile Image (Left) */}
      <View className='relative'>
        <Image
          source={require('../../../assets/avatar.webp')}
          style={{ width: 60, height: 60, borderRadius: 9999 }}
          resizeMode='cover'
        />
        {/* Online indicator */}
        <View className='absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full' />
      </View>

      {/* Text Content */}
      <View className='flex-1 ml-4'>
        <Text
          className='text-2xl font-semibold text-gray-800'
          style={{ fontFamily: 'Poppins-Bold' }}
        >
          {username ? `Hi, ${username}!` : 'Hi, Language Explorer!'}
        </Text>

        <Text
          className='text-lg  text-blue-700 mt-1'
          style={{ fontFamily: 'Poppins-Regular' }}
        >
          Ready to learn words?
        </Text>

        <View className='flex flex-row items-center mt-0.5'>
          {/* UK Flag Badge */}
          <Image
            source={require('../../../assets/flags/england.png')} // ← UK flag (England/UK)
            style={{ width: 30, height: 24, borderRadius: 4, marginRight: 6 }}
            resizeMode='cover'
          />
          <Text
            className='text-sm text-gray-600'
            style={{ fontFamily: 'IBMPlexSans-Regular' }}
          >
            Native: {nativeLangCode}
          </Text>
        </View>
      </View>

      {/* Right-side icon (streak or menu) */}
      <View className='mr-1'>
        <Feather name="zap" size={20} color="#f59e0b" />
      </View>
    </View>

    
  )

}

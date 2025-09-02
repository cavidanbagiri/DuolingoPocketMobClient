
import React, { useState, useEffect } from 'react';

import { Text, View, Image } from 'react-native'

import Feather from '@expo/vector-icons/Feather';

import * as SecureStore from 'expo-secure-store';


export default function HeaderComponent({ username }) {


  const [nativeLangCode, setNativeLangCode] = useState(null);
  const [flagImage, setFlagImage] = useState(null);


  const FLAG_IMAGES = {
    'English': require('../../../assets/flags/england.png'),
    'Spanish': require('../../../assets/flags/spanish.png'),
    'Russian': require('../../../assets/flags/russian.png'),
    'Turkish': require('../../../assets/flags/turkish.png'),
    };
  

    useEffect(() => {
    const getNativeLang = async () => {
      try {
        const native = await SecureStore.getItemAsync('native');
        setNativeLangCode(native);

        // ✅ 2. Map code to image
        if (native && FLAG_IMAGES[native]) {
          setFlagImage(FLAG_IMAGES[native]);
        } 
      } catch (error) {
        console.error('Failed to load native language', error);
      } finally {
        setIsLoading(false);
      }
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
            source={flagImage}
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

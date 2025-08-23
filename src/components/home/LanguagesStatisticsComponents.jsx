import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

import { useDispatch, useSelector } from 'react-redux';

// import LinearGradient from 'react-native-linear-gradient';
import { LinearGradient } from 'expo-linear-gradient';


import WordService from '../../services/WordService';

import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export default function LanguagesStatisticsComponents() {

  const dispatch = useDispatch();

  const { is_auth } = useSelector((state) => state.authSlice);
  const { statistics } = useSelector((state) => state.wordSlice);

  useFocusEffect(
    useCallback(() => {
      if (is_auth) {
        dispatch(WordService.getStatisticsForDashboard());
      }
    }, [is_auth, dispatch])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selected Languages</Text>

      <ScrollView style={styles.boxContainer}>

        {
          statistics &&
          statistics.map((item, index) => (
            <View className='rounded-xl overflow-hidden mt-10'
            key={index}>
              
            <LinearGradient
              colors={['#22c55e', '#BBF7D0']} // green-500 to green-300
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className='flex flex-col justify-between h-48 p-5 rounded-lg shadow-lg'
            >
              {/* Language Header */}
              <View className='flex-row items-center ' >
                <Text className='text-4xl font-bold text-white'>
                  {item.language_name}
                </Text>
                <Text className='text-3xl font-bold text-black opacity-80' style={{fontFamily: 'Poppins-SemiBold'}}>
                  {item?.language_code?.toUpperCase()}
                </Text>
              </View>

              <View className='flex-row items-center ' >
                <Text className='text-lg text-black opacity-80 font-normal' style={{fontFamily: 'IBMPlexSans-Regular'}}>
                  🚀 You've learned {item.learned_words} words! Just {item.total_words - item.learned_words} to go!
                </Text>
              </View>

              {/* Stats Row */}
              <View className='flex-row justify-between '>
                <View className='flex flex-row bg-white/20 p-2 rounded-lg backdrop-blur'>
                  <Text className='text-black text-lg font-semibold text-center'>
                    Total
                  </Text>
                  <Text className='text-black text-xl font-bold text-center ml-1'>
                    {item.total_words}
                  </Text>
                </View>

                <View className='flex flex-row bg-white/20 p-2 rounded-lg backdrop-blur'>
                  <Text className=' text-black text-lg font-semibold text-center'>
                    Learned 
                  </Text>
                  <Text className='text-black text-xl font-bold text-center ml-1'>
                    {item.learned_words}
                  </Text>
                </View>

                <View className='flex flex-row bg-white/20 p-2 rounded-lg backdrop-blur'>
                  <Text className='text-black text-lg font-semibold text-center'>
                    ⭐ Starred
                  </Text>
                  <Text className='text-black text-xl font-bold text-center ml-1'>
                    {item.starred_words}
                  </Text>
                </View>
              </View>
            </LinearGradient>
            </View>
          ))
        }

      </ScrollView>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 10,
  },
  boxContainer: {
    width: '100%',
  },
  langBox: {
    height: 150,
    width: '100%',
    backgroundColor: '#f3f3f3',
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 15,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  langLeft: {
    justifyContent: 'center',
  },
  langName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  stats: {
    fontSize: 13,
    color: '#555',
  },
});

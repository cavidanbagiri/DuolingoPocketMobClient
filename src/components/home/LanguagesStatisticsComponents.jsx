import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

import { useDispatch, useSelector } from 'react-redux';

// import LinearGradient from 'react-native-linear-gradient';
import { LinearGradient } from 'expo-linear-gradient';


import WordService from '../../services/WordService';

import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

const getLanguageGradient = (langCode) => {
  const gradients = {
    en: ['#22c55e', '#BBF7D0'], // Green - English
    es: ['#f97316', '#fed7aa'], // Orange - Spanish
    fr: ['#3b82f6', '#bfdbfe'], // Blue - French
    de: ['#18181b', '#a3a3a3'], // Gray - German
    ja: ['#ec4899', '#fbcfe8'], // Pink - Japanese
    ru: ['#ef4444', '#fecaca'], // Red - Russian
    default: ['#8b5cf6', '#e0e7ff'], // Purple
  };
  return gradients[langCode] || gradients.default;
};

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

    <View className="flex-1 bg-gray-50 py-6 rounded-2xl mt-5">

      {/* Screen Title */}
      <Text
        className="text-3xl font-bold text-gray-800 mb-2 text-center"
        style={{ fontFamily: 'Poppins-Bold' }}
      >
        Your Progress
      </Text>

      <Text
        className="text-lg text-gray-500 mb-6 text-center"
        style={{ fontFamily: 'IBMPlexSans-Regular' }}
      >
        See how far you've come 🌱
      </Text>

      {/* Scrollable Stats */}
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {statistics && statistics.length > 0 ? (
          statistics?.map((item, index) => (
            <View
              key={index}
              className="rounded-3xl overflow-hidden mt-5 shadow-lg bg-white border border-gray-100"
            >
              {/* Gradient Header */}
              <LinearGradient
                colors={getLanguageGradient(item.language_name)} // Dynamic by language
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="p-5"
              >
                {/* Language Name & Code */}
                <View className="flex-row items-start justify-between mb-3">
                  <Text
                    className="text-lg text-white opacity-90"
                    style={{ fontFamily: 'Poppins-SemiBold' }}
                  >
                    {item.language_name}
                  </Text>
                </View>

                {/* Motivational Message */}
                <Text
                  className="text-white text-base mb-4 leading-relaxed"
                  style={{ fontFamily: 'IBMPlexSans-Regular' }}
                >
                  🚀 You've learned{' '}
                  <Text className="font-semibold">{item.learned_words}</Text> words!{' '}
                  Just{' '}
                  <Text className="font-semibold">
                    {item.total_words - item.learned_words}
                  </Text>{' '}
                  to go!
                </Text>

                {/* Stats Cards */}
                <View className="flex-row justify-between">
                  {[
                    { label: 'Total', value: item.total_words, icon: '📚' },
                    { label: 'Learned', value: item.learned_words, icon: '✅' },
                    { label: 'Starred', value: item.starred_words, icon: '⭐' },
                  ].map((stat, i) => (
                    <View
                      key={i}
                      className="flex-1 mx-1 bg-white/20 p-3 rounded-xl backdrop-blur-sm border border-white/30"
                    >
                      <Text
                        className="text-white text-xs font-medium text-center opacity-90"
                        style={{ fontFamily: 'IBMPlexSans-Regular' }}
                      >
                        {stat.icon} {stat.label}
                      </Text>
                      <Text
                        className="text-white text-xl font-bold text-center mt-1"
                        style={{ fontFamily: 'Poppins-Bold' }}
                      >
                        {stat.value}
                      </Text>
                    </View>
                  ))}
                </View>
              </LinearGradient>

              {/* Progress Bar (Optional) */}
              <View className="p-4 bg-gray-50">
                <View className="flex-row justify-between mb-1">
                  <Text
                    className="text-xs text-gray-500"
                    style={{ fontFamily: 'IBMPlexSans-Regular' }}
                  >
                    Progress
                  </Text>
                  <Text
                    className="text-xs text-gray-600"
                    style={{ fontFamily: 'IBMPlexSans-Regular' }}
                  >
                    {Math.round((item.learned_words / item.total_words) * 100)}%
                  </Text>
                </View>
                <View className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <View
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    style={{
                      width: `${(item.learned_words / item.total_words) * 100}%`,
                    }}
                  />
                </View>
              </View>
            </View>
          ))
        ) : (
          <View className="flex-1 justify-center items-center py-10">
            <Text
              className="text-gray-500 text-lg"
              style={{ fontFamily: 'IBMPlexSans-Regular' }}
            >
              No stats yet. Start learning to see your progress!
            </Text>
          </View>
        )}
      </ScrollView>
    </View>


    // <View style={styles.container}>
    //   <Text style={styles.title}>Languages Statistics</Text>

    //   <ScrollView style={styles.boxContainer}>

    //     {
    //       statistics &&
    //       statistics.map((item, index) => (
    //         <View className='rounded-xl overflow-hidden mt-5'
    //         key={index}>

    //         <LinearGradient
    //           colors={['#22c55e', '#BBF7D0']} // green-500 to green-300
    //           start={{ x: 0, y: 0 }}
    //           end={{ x: 1, y: 1 }}
    //           className='flex flex-col justify-between h-48 p-5 rounded-lg shadow-lg'
    //         >
    //           {/* Language Header */}
    //           <View className='flex-row items-center ' >
    //             <Text className='text-4xl font-bold text-white'>
    //               {item.language_name}
    //             </Text>
    //             <Text className='text-3xl font-bold text-black opacity-80' style={{fontFamily: 'Poppins-SemiBold'}}>
    //               {item?.language_code?.toUpperCase()}
    //             </Text>
    //           </View>

    //           <View className='flex-row items-center ' >
    //             <Text className='text-lg text-black opacity-80 font-normal' style={{fontFamily: 'IBMPlexSans-Regular'}}>
    //               🚀 You've learned {item.learned_words} words! Just {item.total_words - item.learned_words} to go!
    //             </Text>
    //           </View>

    //           {/* Stats Row */}
    //           <View className='flex-row justify-between '>
    //             <View className='flex flex-row bg-white/20 p-2 rounded-lg backdrop-blur'>
    //               <Text className='text-black text-lg font-semibold text-center'>
    //                 Total
    //               </Text>
    //               <Text className='text-black text-xl font-bold text-center ml-1'>
    //                 {item.total_words}
    //               </Text>
    //             </View>

    //             <View className='flex flex-row bg-white/20 p-2 rounded-lg backdrop-blur'>
    //               <Text className=' text-black text-lg font-semibold text-center'>
    //                 Learned 
    //               </Text>
    //               <Text className='text-black text-xl font-bold text-center ml-1'>
    //                 {item.learned_words}
    //               </Text>
    //             </View>

    //             <View className='flex flex-row bg-white/20 p-2 rounded-lg backdrop-blur'>
    //               <Text className='text-black text-lg font-semibold text-center'>
    //                 ⭐ Starred
    //               </Text>
    //               <Text className='text-black text-xl font-bold text-center ml-1'>
    //                 {item.starred_words}
    //               </Text>
    //             </View>
    //           </View>
    //         </LinearGradient>
    //         </View>
    //       ))
    //     }

    //   </ScrollView>
    // </View>


  );
}



const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 5,
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

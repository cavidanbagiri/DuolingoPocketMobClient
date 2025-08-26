

import { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AuthService from '../../services/AuthService';


import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export default function ChooseLangComponent({ selectedLanguage, setSelectedLanguage, nativeLanguage }) {

  const dispatch = useDispatch();

  const { user, new_target_lang_cond } = useSelector((state) => state.authSlice);

  const [nativeLangCode, setNativeLangCode] = useState(null);

  const [filteredLanguages, setFilteredLanguages] = useState([]);

  const languages = [
    { name: 'Spanish', image: require('../../../assets/flags/spanish.png'), code: 'es' },
    { name: 'Russian', image: require('../../../assets/flags/russian.png'), code: 'ru' },
    { name: 'English', image: require('../../../assets/flags/england.png'), code: 'en' },
  ];

  const selectedLangCodes = user?.target_langs || [];


  useEffect(() => {
    const getNativeLang = async () => {
      const native = await SecureStore.getItemAsync('native');
      setNativeLangCode(native);
    };
    getNativeLang();
  }, []);


  useEffect(() => {
    // ✅ Filter languages based on selected languages and native language
    const filtered = languages.filter(
      (lang) =>
        !selectedLangCodes.includes(lang.code) &&
        lang.name !== nativeLanguage &&
        lang.name !== nativeLangCode
      // ✅ Filter out native language
    );

    setFilteredLanguages(filtered);
  }, [nativeLanguage, selectedLangCodes, nativeLangCode]); // ✅ Add dependencies



  return (


    <View className="flex-1 bg-gray-50 px-6 py-8 rounded-2xl mt-5">

      {/* Header */}
      <Text
        className="text-3xl font-bold text-gray-800 mb-2 text-center"
        style={{ fontFamily: 'Poppins-Bold' }}
      >
        Choose Your Language
      </Text>

      <Text
        className="text-lg text-gray-500 mb-8 text-center"
        style={{ fontFamily: 'IBMPlexSans-Regular' }}
      >
        Start learning in just one tap
      </Text>

      {/* Language Grid */}
      {filteredLanguages.length > 0 ? (
        <View className="flex-1">
          <View className="grid grid-cols-3 gap-6">
            {filteredLanguages.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                onPress={() => {
                  setSelectedLanguage(lang.name);
                  dispatch(
                    AuthService.setTargetLanguage({
                      target_language_code: lang.code,
                    })
                  );
                }}
                activeOpacity={0.7}
                className={`items-center p-4 rounded-2xl border-2 ${selectedLanguage === lang.name
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 bg-white shadow-sm'
                  }`}
                style={{
                  elevation: selectedLanguage === lang.name ? 4 : 1,
                }}
              >
                {/* Flag */}
                <View className="w-16 h-12 mb-3 overflow-hidden rounded-lg border border-gray-100">
                  <Image
                    source={lang.image}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                  />
                </View>

                {/* Language Name */}
                <Text
                  className={`font-semibold text-base ${selectedLanguage === lang.name ? 'text-blue-700' : 'text-gray-700'
                    }`}
                  style={{ fontFamily: 'IBMPlexSans-SemiBold' }}
                >
                  {lang.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : (
        <View className="flex-1 justify-center items-center">
          <Text
            className="text-gray-500 text-lg"
            style={{ fontFamily: 'IBMPlexSans-Regular' }}
          >
            No languages available
          </Text>
        </View>
      )}

      {/* Optional: "Skip for now" or "View All" */}
      {/* <View className="mt-6 items-center">
    <TouchableOpacity>
      <Text
        className="text-blue-600 text-base"
        style={{ fontFamily: 'IBMPlexSans-Regular' }}
      >
        Show all languages
      </Text>
    </TouchableOpacity>
  </View> */}
    </View>


    // <View style={styles.container}>

    //   {
    //     filteredLanguages.length !== 0 &&
    //     <Text className='text-xl font-medium my-5 w-full'>Which language do you want to learn?</Text>
    //   }

    //   <View className='flex flex-row justify-around w-full'> 
    //     {filteredLanguages.length !== 0 &&

    //     (
    //       filteredLanguages.map((lang) => (
    //         <TouchableOpacity
    //           className='flex flex-col items-center justify-center p-2 rounded-lg border border-gray-300'
    //           key={lang.code}
    //           onPress={() => {
    //             setSelectedLanguage(lang.name);
    //             dispatch(
    //               AuthService.setTargetLanguage({
    //                 target_language_code: lang.code,
    //               })
    //             );
    //           }}
    //           style={[
    //             selectedLanguage === lang.name && styles.selectedFlag,
    //           ]}
    //         >
    //           <Image source={lang.image} style={styles.flagImage} />
    //           <Text style={styles.flagLabel}>{lang.name}</Text>
    //         </TouchableOpacity>
    //       ))
    //     )}
    //   </View>
    // </View>

  );
}




// import React from 'react';
// import { useSelector } from 'react-redux';
// import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

// import AuthService from '../../services/AuthService';
// import { useDispatch } from 'react-redux';

// export default function ChooseLangComponent({ selectedLanguage, setSelectedLanguage }) {


//   const dispatch = useDispatch();

//   const { user, new_target_lang_cond } = useSelector((state) => state.authSlice);


//   const languages = [
//     { name: 'Turkish', image: require('../../../assets/flags/turkish.png'), code: 'tr' },
//     { name: 'Russian', image: require('../../../assets/flags/russian.png'), code: 'ru' },
//     { name: 'English', image: require('../../../assets/flags/england.png'), code: 'en' },
//   ];

//   // Get selected target languages from user (from backend)
//   const selectedLangCodes = user?.target_langs || [];


//   // Filter out already selected languages
//   const filteredLanguages = languages.filter(
//     (lang) => !selectedLangCodes.includes(lang.code)
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Choose language for learning</Text>

//       <View style={styles.flagsRow}>
//         {filteredLanguages.length === 0 ? (
//           <Text style={{ marginTop: 20, fontSize: 16 }}>You've already chosen all available languages 🎉</Text>
//         ) 
//         : (
//           filteredLanguages.map((lang) => (
//             <TouchableOpacity
//               key={lang.code}
//               onPress={() => {
//                 setSelectedLanguage(lang.name);
//                 dispatch(
//                   AuthService.setTargetLanguage({
//                     target_language_code: lang.code, // now sending 'tr', 'ru', 'en'
//                   })
//                 );
//               }}
//               style={[
//                 styles.flagWrapper,
//                 selectedLanguage === lang.name && styles.selectedFlag,
//               ]}
//             >
//               <Image source={lang.image} style={styles.flagImage} />
//               <Text style={styles.flagLabel}>{lang.name}</Text>
//             </TouchableOpacity>
//           ))
//         )}
//       </View>
//     </View>
//   );

// }

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 10,
  },
  flagsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  flagWrapper: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedFlag: {
    borderColor: '#FF4F2F',
    backgroundColor: '#FFF0EC',
  },
  flagImage: {
    width: 80,
    height: 60,
    resizeMode: 'contain',
  },
  flagLabel: {
    marginTop: 5,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
});



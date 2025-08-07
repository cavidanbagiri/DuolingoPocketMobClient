

import { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AuthService from '../../services/AuthService'; 


import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export default function ChooseLangComponent({ selectedLanguage, setSelectedLanguage }) {

  const dispatch = useDispatch();

  const { user, new_target_lang_cond } = useSelector((state) => state.authSlice);

  const [nativeLangCode, setNativeLangCode] = useState(null);

  useEffect(() => {
    const getNativeLang = async () => {
      const native = await SecureStore.getItemAsync('native');
      console.log('native is {}', native);
      setNativeLangCode(native); // should be like 'en', 'tr', 'ru'
    };
    getNativeLang();
  }, []);

  const languages = [
    { name: 'Turkish', image: require('../../../assets/flags/turkish.png'), code: 'tr' },
    { name: 'Russian', image: require('../../../assets/flags/russian.png'), code: 'ru' },
    { name: 'English', image: require('../../../assets/flags/england.png'), code: 'en' },
  ];

  const selectedLangCodes = user?.target_langs || [];

  // ✅ Filter out already selected languages and native language
  const filteredLanguages = languages.filter(
    (lang) =>
      !selectedLangCodes.includes(lang.code) &&
      lang.name !== nativeLangCode
  );

  return (
    <View style={styles.container}>

      {
        filteredLanguages.length !== 0 &&
        <Text className='text-xl font-medium my-5 w-full'>Which language do you want to learn?</Text>
      }

      <View className='flex flex-row justify-around w-full'> 
        {filteredLanguages.length !== 0 &&
        
        (
          filteredLanguages.map((lang) => (
            <TouchableOpacity
              className='flex flex-col items-center justify-center p-2 rounded-lg border border-gray-300'
              key={lang.code}
              onPress={() => {
                setSelectedLanguage(lang.name);
                dispatch(
                  AuthService.setTargetLanguage({
                    target_language_code: lang.code,
                  })
                );
              }}
              style={[
                selectedLanguage === lang.name && styles.selectedFlag,
              ]}
            >
              <Image source={lang.image} style={styles.flagImage} />
              <Text style={styles.flagLabel}>{lang.name}</Text>
            </TouchableOpacity>
          ))
        )}
      </View>
    </View>
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



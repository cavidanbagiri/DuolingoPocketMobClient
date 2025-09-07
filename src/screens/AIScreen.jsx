


// import { View, Text } from 'react-native'
// import React, { useEffect, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux';
// import * as SecureStore from 'expo-secure-store';
// import AIService from '../services/AIService';
// import LANGUAGES from '../constants/Languages';

// export default function AIScreen() {

//   const dispatch = useDispatch();

//   const { currentWord } = useSelector((state) => state.aiSlice);
  
//   const [nativeLangCode, setNativeLangCode] = useState(null);

//   useEffect(() => {
//     console.log('here work')
//     const getNativeLang = async () => {
//       try {
//         const native = await SecureStore.getItemAsync('native');
//         setNativeLangCode(native);

      
//       } catch (error) {
//         console.error('Failed to load native language', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     getNativeLang();
//   }, []);

//   useEffect(() => {
//     if (currentWord) {
//       console.log('ther current word is ', currentWord)
//       const target_language = LANGUAGES.find(lang => lang.code === currentWord.language_code).code;
//       const payload = {
//         text: currentWord.text,
//         language: target_language,
//         native: nativeLangCode,
//       }
//       console.log('payload is ', payload)
//       // dispatch(AIService.generateWordInformation(currentWord))
//     }
//   }, [currentWord]);



//   return (
//     <View>
//       <Text>AIScreen</Text>
//       <Text>AIScreen</Text>
//       <Text>AIScreen</Text>
//       <Text>AIScreen</Text>

//     </View>
//   )
// }



import { View, Text, ActivityIndicator } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as SecureStore from 'expo-secure-store';
import AIService from '../services/AIService';
import LANGUAGES from '../constants/Languages';

export default function AIScreen() {
  const dispatch = useDispatch();
  const { currentWord } = useSelector((state) => state.aiSlice);
  const [nativeLangCode, setNativeLangCode] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Memoized function to generate and send payload
  const generatePayload = useCallback(() => {
    if (!currentWord || !nativeLangCode) {
      console.log('Waiting for both currentWord and nativeLangCode...');
      return null;
    }

    console.log('Both values are ready!');
    const target_language = LANGUAGES.find(lang => lang.code === currentWord.language_code)?.code;
    
    if (!target_language) {
      console.error('Target language not found for code:', currentWord.language_code);
      return null;
    }

    const payload = {
      text: currentWord.text,
      language: target_language,
      native: nativeLangCode,
    };
    
    console.log('Final payload is:', payload);
    dispatch(AIService.generateAIWord(payload));
    
    return payload;
  }, [currentWord, nativeLangCode, dispatch]);

  // Effect to load native language
  useEffect(() => {
    console.log('Loading native language...');
    const getNativeLang = async () => {
      try {
        const native = await SecureStore.getItemAsync('native');
        setNativeLangCode(native);
      } catch (error) {
        console.error('Failed to load native language', error);
      } finally {
        setIsLoading(false);
      }
    };

    getNativeLang();
  }, []);

  // Effect to trigger API call when both values are ready
  useEffect(() => {
    if (currentWord && nativeLangCode) {
      console.log('Both values available, generating payload...');
      generatePayload();
    }
  }, [currentWord, nativeLangCode, generatePayload]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text>Loading AI assistant...</Text>
      </View>
    );
  }

  return (
    <View>
      <Text>AI Screen</Text>
      <Text>Current Word: {currentWord?.text || 'None'}</Text>
      <Text>Native Language: {nativeLangCode || 'Not set'}</Text>
      {/* Your AI content will go here */}
    </View>
  );
}
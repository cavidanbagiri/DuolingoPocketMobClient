
import { useMemo } from 'react';
import { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { View, Text, TouchableOpacity, Image,  ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AuthService from '../../services/AuthService';

import LANGUAGES from '../../constants/Languages';


// export default function ChooseLangComponent({ selectedLanguage, setSelectedLanguage, nativeLanguage }) {
export default function ChooseLangComponent({ selectedLanguage, setSelectedLanguage }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.authSlice);

  const [nativeLangName, setNativeLangName] = useState(null);
  const [filteredLanguages, setFilteredLanguages] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // ← Add loading state

  const languages = LANGUAGES;

  // const selectedLangCodes = user?.target_langs || [];
  const selectedLangCodes = useMemo(
  () => user?.target_langs || [],
  [user?.target_langs]
);

  // Load native language from SecureStore
  useEffect(() => {
    const getNativeLang = async () => {
      try{
        const native = await SecureStore.getItemAsync('native');
        setNativeLangName(native);
        setIsLoading(false); 
      }
      catch(error){
        setNativeLangName(null);
        
      }
      finally {
        setIsLoading(false);
      }
    };
    getNativeLang();
  }, []);
  
  // Filter languages when dependencies change 
  useEffect(() => {
    if (isLoading) return; // ← Don't run until nativeLangCode is ready

    const filtered = languages.filter(
      (lang) =>
        !selectedLangCodes.includes(lang.code) &&
        lang.name !== nativeLangName
    );

    setFilteredLanguages(filtered);
  }, [isLoading, selectedLangCodes, nativeLangName]);

  // 🔁 Don't render grid until loading is done
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <ActivityIndicator size="small" color="#3b82f6" />
        <Text className="text-gray-500 mt-2" style={{ fontFamily: 'IBMPlexSans-Regular' }}>
          Loading languages...
        </Text>
      </View>
    );
  }

  return (

    <View>

      {
        filteredLanguages.length > 0 &&
          <View className="bg-gray-50 px-6 py-8 rounded-2xl mt-5">
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
              <View className="grid grid-cols-3 gap-6">
                {filteredLanguages.map((lang) => (
                  <TouchableOpacity
                  accessibilityLabel={`Select ${lang.name} language`}
                  accessibilityRole="button"
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
                    
                  >
                    <View className="w-16 h-12 mb-3 overflow-hidden rounded-lg border border-gray-100">
                      <Image
                        source={lang.image}
                        style={{ width: '100%', height: '100%' }}
                        resizeMode="cover"
                      />
                    </View>
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
          
      }

    </View>




  );


}









// import { useEffect, useState } from 'react';
// import * as SecureStore from 'expo-secure-store';
// import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
// import { useDispatch, useSelector } from 'react-redux';
// import AuthService from '../../services/AuthService';




// export default function ChooseLangComponent({ selectedLanguage, setSelectedLanguage, nativeLanguage }) {
//   const dispatch = useDispatch();
//   const { user } = useSelector((state) => state.authSlice);

//   const [nativeLangCode, setNativeLangCode] = useState(null);
//   const [filteredLanguages, setFilteredLanguages] = useState([]);
//   const [isLoading, setIsLoading] = useState(true); // ← Add loading state

//   const languages = [
//     { name: 'Spanish', image: require('../../../assets/flags/spanish.png'), code: 'es' },
//     { name: 'Russian', image: require('../../../assets/flags/russian.png'), code: 'ru' },
//     { name: 'English', image: require('../../../assets/flags/england.png'), code: 'en' },
//   ];

//   const selectedLangCodes = user?.target_langs || [];

//   // Load native language from SecureStore
//   useEffect(() => {
//     const getNativeLang = async () => {
//       const native = await SecureStore.getItemAsync('native');
//       setNativeLangCode(native);
//       setIsLoading(false); // ← Mark as loaded
//     };
//     getNativeLang();
//   }, []);

//   // Filter languages when dependencies change 
//   useEffect(() => {
//     if (isLoading) return; // ← Don't run until nativeLangCode is ready

//     const filtered = languages.filter(
//       (lang) =>
//         !selectedLangCodes.includes(lang.code) &&
//         lang.name !== nativeLanguage &&
//         lang.name !== nativeLangCode
//     );

//     setFilteredLanguages(filtered);
//   }, [isLoading, nativeLanguage, selectedLangCodes, nativeLangCode]);

//   // 🔁 Don't render grid until loading is done
//   if (isLoading) {
//     return (
//       <View className="flex-1 justify-center items-center p-4">
//         <ActivityIndicator size="small" color="#3b82f6" />
//         <Text className="text-gray-500 mt-2" style={{ fontFamily: 'IBMPlexSans-Regular' }}>
//           Loading languages...
//         </Text>
//       </View>
//     );
//   }

//   return (

//     <View>

//       {
//         filteredLanguages.length > 0 ?
//         <View className="bg-gray-50 px-6 py-8 rounded-2xl mt-5">
//       {/* Header */}
//       <Text
//         className="text-3xl font-bold text-gray-800 mb-2 text-center"
//         style={{ fontFamily: 'Poppins-Bold' }}
//       >
//         Choose Your Language
//       </Text>

//       <Text
//         className="text-lg text-gray-500 mb-8 text-center"
//         style={{ fontFamily: 'IBMPlexSans-Regular' }}
//       >
//         Start learning in just one tap
//       </Text>

//       {/* Language Grid */}
//       {filteredLanguages.length > 0 ? (
//         <View className="grid grid-cols-3 gap-6">
//           {filteredLanguages.map((lang) => (
//             <TouchableOpacity
//               key={lang.code}
//               onPress={() => {
//                 setSelectedLanguage(lang.name);
//                 dispatch(
//                   AuthService.setTargetLanguage({
//                     target_language_code: lang.code,
//                   })
//                 );
//               }}
//               activeOpacity={0.7}
//               className={`items-center p-4 rounded-2xl border-2 ${
//                 selectedLanguage === lang.name
//                   ? 'border-blue-500 bg-blue-50 shadow-md'
//                   : 'border-gray-200 bg-white shadow-sm'
//               }`}
//               style={{
//                 elevation: selectedLanguage === lang.name ? 4 : 1,
//               }}
//             >
//               <View className="w-16 h-12 mb-3 overflow-hidden rounded-lg border border-gray-100">
//                 <Image
//                   source={lang.image}
//                   style={{ width: '100%', height: '100%' }}
//                   resizeMode="cover"
//                 />
//               </View>
//               <Text
//                 className={`font-semibold text-base ${
//                   selectedLanguage === lang.name ? 'text-blue-700' : 'text-gray-700'
//                 }`}
//                 style={{ fontFamily: 'IBMPlexSans-SemiBold' }}
//               >
//                 {lang.name}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       ) : (
//         <View className="flex-1 justify-center items-center py-8">
//           <Text
//             className="text-gray-500 text-center"
//             style={{ fontFamily: 'IBMPlexSans-Regular' }}
//           >
//             No available languages to learn.
//           </Text>
//         </View>
//       )}
//     </View>
//         :
//         <View className="flex-1 justify-center items-center p-4">
//         </View>
//       }

//     </View>


      

//   );


// }







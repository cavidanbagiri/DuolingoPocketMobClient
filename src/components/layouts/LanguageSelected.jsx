

import { Text, View, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedLanguage } from '../../store/word_store';
import WordService from '../../services/WordService';

const FLAG_IMAGES = {
  English: require('../../../assets/flags/england.png'),
  Spanish: require('../../../assets/flags/spanish.png'),
  Russian: require('../../../assets/flags/russian.png'),
  Turkish: require('../../../assets/flags/turkish.png'),
};

export default function LanguageSelected({ screen }) {
  const dispatch = useDispatch();
  const { selectedLanguage, statistics } = useSelector((state) => state.wordSlice);

  const handleLanguagePress = (langCode) => {
    dispatch(setSelectedLanguage(langCode));
    const filter = screen === 'LearnedScreen' ? 'learned' : 'all';
    dispatch(
      WordService.handleLanguageSelect({
        filter,
        langCode,
      })
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Choose Language</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {statistics?.map((lang, index) => {
          const isSelected = selectedLanguage === lang.language_code;
          const flagSource = FLAG_IMAGES[lang.language_name];
          const progress = lang.total_words > 0 
            ? (lang.learned_words / lang.total_words) 
            : 0;

          return (
            <TouchableOpacity
              key={index}
              onPress={() => handleLanguagePress(lang.language_code)}
              activeOpacity={0.85}
              style={[styles.card, isSelected ? styles.cardSelected : styles.cardDefault]}
            >
              {/* Flag */}
              <View style={styles.flagContainer}>
                {flagSource ? (
                  <Image source={flagSource} style={styles.flag} resizeMode="cover" />
                ) : (
                  <View style={styles.flagPlaceholder} />
                )}
              </View>

              {/* Language Name */}
              <Text style={[styles.languageName, isSelected && styles.languageNameSelected]}>
                {lang.language_name}
              </Text>

              {/* Progress Bar */}
              <View style={styles.progressBarBg}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${Math.round(progress * 100)}%` },
                    isSelected && { backgroundColor: '#3B82F6' }
                  ]}
                />
              </View>

              {/* Stats: Learned / Total */}
              <Text style={[styles.statText, isSelected && styles.statTextSelected]}>
                {lang.learned_words} / {lang.total_words}
              </Text>

              {/* Selection Badge */}
              {isSelected && <View style={styles.selectedBadge} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  header: {
    fontSize: 16,
    fontFamily: 'IBMPlexSans-SemiBold',
    color: '#1F2937',
    marginBottom: 12,
    marginTop: 8,
  },
  scrollContent: {
    gap: 12,
    paddingHorizontal: 4,
  },
  card: {
    width: 120,
    padding: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    position: 'relative',
  },
  cardDefault: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
  },
  cardSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  flagContainer: {
    width: 48,
    height: 36,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    marginBottom: 10,
    backgroundColor: '#F9FAFB',
  },
  flag: {
    width: '100%',
    height: '100%',
  },
  flagPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F3F4F6',
  },
  languageName: {
    fontSize: 14,
    fontFamily: 'IBMPlexSans-SemiBold',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 6,
  },
  languageNameSelected: {
    color: '#1E3A8A',
  },
  progressBarBg: {
    width: '100%',
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    marginBottom: 6,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#9CA3AF',
    borderRadius: 3,
  },
  statText: {
    fontSize: 12,
    fontFamily: 'IBMPlexSans-SemiBold',
    color: '#6B7280',
    textAlign: 'center',
  },
  statTextSelected: {
    color: '#3B82F6',
  },
  selectedBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
});




// import { Text, View, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
// import React from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { setSelectedLanguage } from '../../store/word_store';
// import WordService from '../../services/WordService';

// const FLAG_IMAGES = {
//   English: require('../../../assets/flags/england.png'),
//   Spanish: require('../../../assets/flags/spanish.png'),
//   Russian: require('../../../assets/flags/russian.png'),
//   Turkish: require('../../../assets/flags/turkish.png'),
// };

// export default function LanguageSelected({ screen }) {
//   const dispatch = useDispatch();
//   const { selectedLanguage, statistics } = useSelector((state) => state.wordSlice);

//   const handleLanguagePress = (langCode) => {
//     dispatch(setSelectedLanguage(langCode));
//     const filter = screen === 'LearnedScreen' ? 'learned' : 'all';
//     dispatch(
//       WordService.handleLanguageSelect({
//         filter,
//         langCode,
//       })
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Choose Language</Text>

//       {/* Horizontal Scrollable List */}
//       <ScrollView
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         contentContainerStyle={styles.scrollContent}
//         keyboardShouldPersistTaps="handled"
//       >
//         {statistics?.map((lang, index) => {
//           const isSelected = selectedLanguage === lang.language_code;
//           const flagSource = FLAG_IMAGES[lang.language_name];

//           return (
//             <TouchableOpacity
//               key={index}
//               onPress={() => handleLanguagePress(lang.language_code)}
//               activeOpacity={0.85}
//               style={[styles.card, isSelected ? styles.cardSelected : styles.cardDefault]}
//             >
//               {/* Flag */}
//               <View style={styles.flagContainer}>
//                 {flagSource ? (
//                   <Image source={flagSource} style={styles.flag} resizeMode="cover" />
//                 ) : (
//                   <View style={styles.flagPlaceholder} />
//                 )}
//               </View>

//               {/* Language Name */}
//               <Text style={[styles.languageName, isSelected && styles.languageNameSelected]}>
//                 {lang.language_name}
//               </Text>

//               {/* Stats */}
//               <View style={styles.stats}>
//                 <Text style={styles.statText}>
//                   {lang.learned_words}/{lang.total_words}
//                 </Text>
//                 <Text style={[styles.statusText, isSelected && styles.statusTextSelected]}>
//                   words
//                 </Text>
//               </View>

//               {/* Selection Indicator */}
//               {isSelected && <View style={styles.selectedBadge} />}
//             </TouchableOpacity>
//           );
//         })}
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     paddingHorizontal: 16,
//     paddingBottom: 12,
//     backgroundColor: '#FFFFFF',
//     borderBottomWidth: 1,
//     borderBottomColor: '#F3F4F6',
//   },
//   header: {
//     fontSize: 20,
//     fontFamily: 'IBMPlexSans-SemiBold',
//     color: '#1F2937',
//     marginBottom: 12,
//     marginTop: 8,
//   },
//   scrollContent: {
//     gap: 12,
//     paddingHorizontal: 4,
//     paddingVertical: 4,
//   },
//   card: {
//     width: 120,
//     padding: 12,
//     borderRadius: 16,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderWidth: 2,
//     position: 'relative',
//   },
//   cardDefault: {
//     backgroundColor: '#FFFFFF',
//     borderColor: '#E5E7EB',
//   },
//   cardSelected: {
//     backgroundColor: '#EFF6FF',
//     borderColor: '#3B82F6',
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   flagContainer: {
//     width: 48,
//     height: 36,
//     borderRadius: 8,
//     overflow: 'hidden',
//     borderWidth: 2,
//     borderColor: '#FFFFFF',
//     marginBottom: 8,
//     backgroundColor: '#F9FAFB',
//   },
//   flag: {
//     width: '100%',
//     height: '100%',
//   },
//   flagPlaceholder: {
//     width: '100%',
//     height: '100%',
//     backgroundColor: '#F3F4F6',
//   },
//   languageName: {
//     fontSize: 14,
//     fontFamily: 'IBMPlexSans-SemiBold',
//     color: '#374151',
//     textAlign: 'center',
//     marginBottom: 4,
//   },
//   languageNameSelected: {
//     color: '#1E3A8A',
//   },
//   stats: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 2,
//   },
//   statText: {
//     fontSize: 12,
//     fontFamily: 'IBMPlexSans-SemiBold',
//     color: '#4B5563',
//   },
//   statusText: {
//     fontSize: 10,
//     fontFamily: 'IBMPlexSans-Regular',
//     color: '#9CA3AF',
//   },
//   statusTextSelected: {
//     color: '#3B82F6',
//   },
//   selectedBadge: {
//     position: 'absolute',
//     top: 4,
//     right: 4,
//     width: 16,
//     height: 16,
//     borderRadius: 8,
//     backgroundColor: '#3B82F6',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });



// import { Text, View, TouchableOpacity, Image, StyleSheet } from 'react-native';
// import React, { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { setSelectedLanguage } from '../../store/word_store';
// import WordService from '../../services/WordService';

// const FLAG_IMAGES = {
//   English: require('../../../assets/flags/england.png'),
//   Spanish: require('../../../assets/flags/spanish.png'),
//   Russian: require('../../../assets/flags/russian.png'),
//   Turkish: require('../../../assets/flags/turkish.png'),
// };

// export default function LanguageSelected({ screen }) {
//   const dispatch = useDispatch();
//   const { selectedLanguage, statistics } = useSelector((state) => state.wordSlice);

//   const handleLanguagePress = (langCode, languageName) => {
//     dispatch(setSelectedLanguage(langCode));
//     const filter = screen === 'LearnedScreen' ? 'learned' : 'all';
//     dispatch(
//       WordService.handleLanguageSelect({
//         filter,
//         langCode,
//       })
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Choose Language</Text>

//       <View style={styles.list}>
//         {statistics?.map((lang, index) => {
//           const isSelected = selectedLanguage === lang.language_code;
//           const flagSource = FLAG_IMAGES[lang.language_name] || null;

//           return (
//             <TouchableOpacity
//               key={index}
//               onPress={() => handleLanguagePress(lang.language_code, lang.language_name)}
//               activeOpacity={0.85}
//               style={[styles.card, isSelected ? styles.cardSelected : styles.cardDefault]}
//             >
//               {/* Flag */}
//               <View style={styles.flagContainer}>
//                 {flagSource ? (
//                   <Image source={flagSource} style={styles.flag} resizeMode="cover" />
//                 ) : (
//                   <View style={styles.flagPlaceholder} />
//                 )}
//               </View>

//               {/* Info */}
//               <View style={styles.info}>
//                 <Text style={[styles.languageName, isSelected && styles.languageNameSelected]}>
//                   {lang.language_name}
//                 </Text>

//                 <View style={styles.statRow}>
//                   <Text style={styles.statLabel}>
//                     {lang.learned_words} words
//                   </Text>
//                   <Text style={[styles.statValue, isSelected && styles.statValueSelected]}>
//                     Learned
//                   </Text>
//                 </View>

//                 <View style={styles.statRow}>
//                   <Text style={styles.statLabel}>
//                     {lang.total_words} words
//                   </Text>
//                   <Text style={[styles.statValue, isSelected && styles.statValueSelected]}>
//                     Tap to select
//                   </Text>
//                 </View>
//               </View>

//               {/* Radio Indicator */}
//               <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
//                 {isSelected && <View style={styles.radioInner} />}
//               </View>
//             </TouchableOpacity>
//           );
//         })}
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     paddingHorizontal: 16,
//     paddingBottom: 8,
//     backgroundColor: '#FFFFFF',
//     borderBottomWidth: 1,
//     borderBottomColor: '#F3F4F6',
//   },
//   header: {
//     fontSize: 20,
//     fontFamily: 'IBMPlexSans-SemiBold',
//     color: '#1F2937',
//     marginBottom: 16,
//     marginTop: 8,
//   },
//   list: {
//     gap: 12,
//   },
//   card: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     borderRadius: 16,
//     borderWidth: 2,
//     minHeight: 72,
//   },
//   cardDefault: {
//     backgroundColor: '#FFFFFF',
//     borderColor: '#E5E7EB',
//   },
//   cardSelected: {
//     backgroundColor: '#EFF6FF',
//     borderColor: '#3B82F6',
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.08,
//     shadowRadius: 4,
//   },
//   flagContainer: {
//     width: 48,
//     height: 40,
//     borderRadius: 12,
//     overflow: 'hidden',
//     borderWidth: 2,
//     borderColor: '#FFFFFF',
//     marginRight: 16,
//     backgroundColor: '#F9FAFB',
//   },
//   flag: {
//     width: '100%',
//     height: '100%',
//   },
//   flagPlaceholder: {
//     width: '100%',
//     height: '100%',
//     backgroundColor: '#F3F4F6',
//   },
//   info: {
//     flex: 1,
//     gap: 4,
//   },
//   languageName: {
//     fontSize: 16,
//     fontFamily: 'IBMPlexSans-SemiBold',
//     color: '#374151',
//   },
//   languageNameSelected: {
//     color: '#1E3A8A',
//   },
//   statRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//   },
//   statLabel: {
//     fontSize: 13,
//     fontFamily: 'IBMPlexSans-Regular',
//     color: '#6B7280',
//   },
//   statValue: {
//     fontSize: 13,
//     fontFamily: 'IBMPlexSans-Regular',
//     color: '#9CA3AF',
//   },
//   statValueSelected: {
//     color: '#3B82F6',
//   },
//   radioOuter: {
//     width: 20,
//     height: 20,
//     borderRadius: 10,
//     borderWidth: 2,
//     borderColor: '#D1D5DB',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   radioOuterSelected: {
//     borderColor: '#3B82F6',
//     backgroundColor: '#DBEAFE',
//   },
//   radioInner: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: '#3B82F6',
//   },
// });








// import { Text, View, TouchableOpacity, Image } from 'react-native'
// import React, { useState } from 'react'

// import { useDispatch, useSelector } from 'react-redux';

// import { setSelectedLanguage } from '../../store/word_store';

// import WordService from '../../services/WordService';


// const FLAG_IMAGES = {
//     'English': require('../../../assets/flags/england.png'),
//     'Spanish': require('../../../assets/flags/spanish.png'),
//     'Russian': require('../../../assets/flags/russian.png'),
//     'Turkish': require('../../../assets/flags/turkish.png'),
// };

// export default function LanguageSelected({ screen }) {

//     const dispatch = useDispatch();

//     const { selectedLanguage, statistics } = useSelector((state) => state.wordSlice);

//     const [filter, setFilter] = useState('all');

//     return (
//         <View className="px-3 pb-1 bg-white border-b border-gray-100">

//             {/* Section Header */}
//             <Text
//                 className="text-xl font-bold text-gray-800 mb-4 tracking-tight"
//                 style={{ fontFamily: 'IBMPlexSans-Regular' }}
//             >
//                 Choose Language
//             </Text>


//             {/* Language List */}
//             <View className="space-y-3 ">
//                 {/*  Inside of the return of available languages, return with an index */}
//                 {statistics?.map((lang, index) => {
//                     const isSelected = selectedLanguage === lang.language_code;

//                     return (
//                         <TouchableOpacity
//                             key={index}
//                             onPress={() => {
//                                 const new_lang_code = lang.language_code;
//                                 dispatch(setSelectedLanguage(new_lang_code));
//                                 if (screen === 'WordScreen') {
//                                     dispatch(
//                                         WordService.handleLanguageSelect({
//                                             filter: 'all',
//                                             langCode: new_lang_code,
//                                         })
//                                     );
//                                 }
//                                 else if (screen === 'LearnedScreen') {
//                                     dispatch(
//                                         WordService.handleLanguageSelect({
//                                             filter: 'learned',
//                                             langCode: new_lang_code,
//                                         })
//                                     );
//                                 }
//                             }}
//                             activeOpacity={0.7}
//                             className={`flex-row items-center p-4 rounded-2xl border-2 transition-all duration-150 my-1 ${isSelected
//                                 ? 'border-blue-500 bg-blue-50 '
//                                 : 'border-gray-200 bg-white hover:border-gray-300 '
//                                 }`}
//                             style={{
//                                 elevation: isSelected ? 3 : 1,
//                             }}
//                         >
//                             {/* Flag Badge */}
//                             <View className="w-12 h-10 rounded-xl overflow-hidden border-2 border-white mr-4">
//                                 <Image
//                                     source={FLAG_IMAGES[lang.language_name]}
//                                     style={{ width: '100%', height: '100%' }}
//                                     resizeMode="cover"
//                                 />
//                             </View>

//                             {/* Language Info */}
//                             <View className="flex-1">

//                                 <Text
//                                     className={`text-base font-bold ${isSelected ? 'text-gray-900' : 'text-gray-800'
//                                         }`}
//                                     style={{ fontFamily: 'IBMPlexSans-SemiBold' }}
//                                 >
//                                     {lang.language_name}
//                                 </Text>

//                                 <View className="flex-row items-center mt-1">
//                                     <Text
//                                         className="text-sm text-gray-500"
//                                         style={{ fontFamily: 'IBMPlexSans-Regular' }}
//                                     >
//                                         {lang.learned_words} words
//                                     </Text>
//                                     <View className="mx-1 w-1 h-1 bg-gray-400 rounded-full" />
//                                     <Text
//                                         className={`text-sm ${isSelected ? 'text-blue-600' : 'text-gray-500'
//                                             }`}
//                                         style={{ fontFamily: 'IBMPlexSans-Regular' }}
//                                     >
//                                         Learned Words
//                                     </Text>
//                                 </View>

//                                 <View className="flex-row items-center mt-1">
//                                     <Text
//                                         className="text-sm text-gray-500"
//                                         style={{ fontFamily: 'IBMPlexSans-Regular' }}
//                                     >
//                                         {lang.total_words} words
//                                     </Text>
//                                     <View className="mx-1 w-1 h-1 bg-gray-400 rounded-full" />
//                                     <Text
//                                         className={`text-sm ${isSelected ? 'text-blue-600' : 'text-gray-500'
//                                             }`}
//                                         style={{ fontFamily: 'IBMPlexSans-Regular' }}
//                                     >
//                                         Tap to select
//                                     </Text>
//                                 </View>


//                             </View>




//                             {/* Selection Indicator */}
//                             <View
//                                 className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-blue-500 bg-blue-100' : 'border-gray-300'
//                                     }`}
//                             >
//                                 {isSelected && (
//                                     <View className="w-2 h-2 rounded-full bg-blue-600" />
//                                 )}
//                             </View>
//                         </TouchableOpacity>
//                     );
//                 })}
//             </View>
//         </View>
//     )
// }


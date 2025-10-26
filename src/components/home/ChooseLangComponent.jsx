
import { useMemo } from 'react';
import { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AuthService from '../../services/AuthService';
import LANGUAGES from '../../constants/Languages';

export default function ChooseLangComponent({ selectedLanguage, setSelectedLanguage }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.authSlice);

  const [nativeLangName, setNativeLangName] = useState(null);
  const [filteredLanguages, setFilteredLanguages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const languages = LANGUAGES;

  const selectedLangCodes = useMemo(
    () => user?.target_langs || [],
    [user?.target_langs]
  );

  // Load native language from SecureStore
  useEffect(() => {
    const getNativeLang = async () => {
      try {
        const native = await SecureStore.getItemAsync('native');
        setNativeLangName(native);
      } catch (error) {
        setNativeLangName(null);
      } finally {
        setIsLoading(false);
      }
    };
    getNativeLang();
  }, []);

  // Filter languages when dependencies change 
  useEffect(() => {
    if (isLoading) return;

    const filtered = languages.filter(
      (lang) =>
        !selectedLangCodes.includes(lang.code) &&
        lang.name !== nativeLangName
    );

    setFilteredLanguages(filtered);
  }, [isLoading, selectedLangCodes, nativeLangName]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Loading languages...</Text>
      </View>
    );
  }

  if (filteredLanguages.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Main Container */}
      <View style={styles.mainCard}>
        
        {/* Gradient Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Choose Your Language</Text>
          <Text style={styles.headerSubtitle}>Start your journey with just one tap</Text>
        </View>

        {/* Language Grid */}
        <View style={styles.gridContainer}>
          <View style={styles.grid}>
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
                activeOpacity={0.8}
                style={[
                  styles.languageCard,
                  selectedLanguage === lang.name ? styles.selectedCard : styles.defaultCard
                ]}
              >
                {/* Language Flag Container */}
                <View style={styles.flagContainer}>
                  <Image
                    source={lang.image}
                    style={styles.flagImage}
                    resizeMode="cover"
                  />
                </View>
                
                {/* Language Name */}
                <Text
                  style={[
                    styles.languageName,
                    selectedLanguage === lang.name ? styles.selectedText : styles.defaultText
                  ]}
                  numberOfLines={2}
                >
                  {lang.name}
                </Text>
                
                {/* Selection Indicator */}
                {selectedLanguage === lang.name && (
                  <View style={styles.selectionIndicator}>
                    <Text style={styles.checkmark}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Footer Note */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {filteredLanguages.length} languages available to learn
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = {
  container: {
    paddingHorizontal: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    color: '#6b7280',
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'IBMPlexSans-Regular',
  },
  mainCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    marginHorizontal: 8,
    marginTop: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 12,
    fontFamily: 'Poppins-Bold',
  },
  headerSubtitle: {
    fontSize: 18,
    color: '#e0e7ff',
    textAlign: 'center',
    fontFamily: 'IBMPlexSans-Regular',
  },
  gridContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  languageCard: {
    width: 112,
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
  },
  defaultCard: {
    backgroundColor: '#f9fafb',
    borderColor: '#f3f4f6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  selectedCard: {
    backgroundColor: '#eef2ff',
    borderColor: '#a5b4fc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    transform: [{ scale: 1.05 }],
  },
  flagContainer: {
    width: 80,
    height: 56,
    marginBottom: 12,
    overflow: 'hidden',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  flagImage: {
    width: '100%',
    height: '100%',
  },
  languageName: {
    fontFamily: 'IBMPlexSans-SemiBold',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
  defaultText: {
    color: '#374151',
  },
  selectedText: {
    color: '#4338ca',
  },
  selectionIndicator: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#6366f1',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  footer: {
    backgroundColor: '#f9fafb',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  footerText: {
    color: '#6b7280',
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'IBMPlexSans-Regular',
  },
};




// import { useMemo } from 'react';
// import { useEffect, useState } from 'react';
// import * as SecureStore from 'expo-secure-store';
// import { View, Text, TouchableOpacity, Image,  ActivityIndicator } from 'react-native';
// import { useDispatch, useSelector } from 'react-redux';
// import AuthService from '../../services/AuthService';

// import LANGUAGES from '../../constants/Languages';


// // export default function ChooseLangComponent({ selectedLanguage, setSelectedLanguage, nativeLanguage }) {
// export default function ChooseLangComponent({ selectedLanguage, setSelectedLanguage }) {
//   const dispatch = useDispatch();
//   const { user } = useSelector((state) => state.authSlice);

//   const [nativeLangName, setNativeLangName] = useState(null);
//   const [filteredLanguages, setFilteredLanguages] = useState([]);
//   const [isLoading, setIsLoading] = useState(true); // ← Add loading state

//   const languages = LANGUAGES;

//   // const selectedLangCodes = user?.target_langs || [];
//   const selectedLangCodes = useMemo(
//   () => user?.target_langs || [],
//   [user?.target_langs]
// );

//   // Load native language from SecureStore
//   useEffect(() => {
//     const getNativeLang = async () => {
//       try{
//         const native = await SecureStore.getItemAsync('native');
//         setNativeLangName(native);
//         setIsLoading(false); 
//       }
//       catch(error){
//         setNativeLangName(null);
        
//       }
//       finally {
//         setIsLoading(false);
//       }
//     };
//     getNativeLang();
//   }, []);
  
//   // Filter languages when dependencies change 
//   useEffect(() => {
//     if (isLoading) return; // ← Don't run until nativeLangCode is ready

//     const filtered = languages.filter(
//       (lang) =>
//         !selectedLangCodes.includes(lang.code) &&
//         lang.name !== nativeLangName
//     );

//     setFilteredLanguages(filtered);
//   }, [isLoading, selectedLangCodes, nativeLangName]);

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
//         filteredLanguages.length > 0 &&
//           <View className="bg-gray-50 px-6 py-8 rounded-2xl mt-5">
//             {/* Header */}
//             <Text
//               className="text-3xl font-bold text-gray-800 mb-2 text-center"
//               style={{ fontFamily: 'Poppins-Bold' }}
//             >
//               Choose Your Language
//             </Text>

//             <Text
//               className="text-lg text-gray-500 mb-8 text-center"
//               style={{ fontFamily: 'IBMPlexSans-Regular' }}
//             >
//               Start learning in just one tap
//             </Text>

//             {/* Language Grid */}
//               <View className="grid grid-cols-3 gap-6">
//                 {filteredLanguages.map((lang) => (
//                   <TouchableOpacity
//                   accessibilityLabel={`Select ${lang.name} language`}
//                   accessibilityRole="button"
//                     key={lang.code}
//                     onPress={() => {
//                       setSelectedLanguage(lang.name);
//                       dispatch(
//                         AuthService.setTargetLanguage({
//                           target_language_code: lang.code,
//                         })
//                       );
//                     }}
//                     activeOpacity={0.7}
//                     className={`items-center p-4 rounded-2xl border-2 ${selectedLanguage === lang.name
//                         ? 'border-blue-500 bg-blue-50 shadow-md'
//                         : 'border-gray-200 bg-white shadow-sm'
//                       }`}
                    
//                   >
//                     <View className="w-16 h-12 mb-3 overflow-hidden rounded-lg border border-gray-100">
//                       <Image
//                         source={lang.image}
//                         style={{ width: '100%', height: '100%' }}
//                         resizeMode="cover"
//                       />
//                     </View>
//                     <Text
//                       className={`font-semibold text-base ${selectedLanguage === lang.name ? 'text-blue-700' : 'text-gray-700'
//                         }`}
//                       style={{ fontFamily: 'IBMPlexSans-SemiBold' }}
//                     >
//                       {lang.name}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
            
//           </View>
          
//       }

//     </View>




//   );


// }



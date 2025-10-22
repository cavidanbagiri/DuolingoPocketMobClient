

import React, { useState, useEffect, useRef } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { Text, View, Image, Animated, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as SecureStore from 'expo-secure-store';
import { LinearGradient } from 'expo-linear-gradient';

import WordService from '../../services/WordService';

const { width: screenWidth } = Dimensions.get('window');

const COLORS = {
  primary: '#3B82F6',
  primaryLight: '#60A5FA',
  primaryLighter: '#93C5FD',
  primaryDark: '#2563EB',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  textTertiary: '#94A3B8',
  success: '#10B981',
  warning: '#F59E0B',
  border: '#E2E8F0',
};

// Language code to flag mapping
const LANGUAGE_FLAGS = {
  'en': require('../../../assets/flags/england.png'),
  'es': require('../../../assets/flags/spanish.png'),
  'ru': require('../../../assets/flags/russian.png'),
  'tr': require('../../../assets/flags/turkish.png'),
  // Add more as needed
};

// Language code to full name mapping
const LANGUAGE_NAMES = {
  'en': 'English',
  'es': 'Spanish', 
  'ru': 'Russian',
  'tr': 'Turkish',
  'fr': 'French',
  'de': 'German',
  'it': 'Italian',
  'ja': 'Japanese',
  'ko': 'Korean',
  'zh': 'Chinese',
};

export default function HeaderComponent({ username }) {

  const dispatch = useDispatch();

  const [nativeLangCode, setNativeLangCode] = useState(null);
  const [flagImage, setFlagImage] = useState(null); 
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Daily Streak State
  const [dailyStreak, setDailyStreak] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const FLAG_IMAGES = {
    English: require('../../../assets/flags/england.png'),
    Spanish: require('../../../assets/flags/spanish.png'),
    Russian: require('../../../assets/flags/russian.png'),
    Turkish: require('../../../assets/flags/turkish.png'),
  };

  useEffect(() => {
    const getNativeLang = async () => {
      try {
        const native = await SecureStore.getItemAsync('native');
        setNativeLangCode(native);

        if (native && FLAG_IMAGES[native]) {
          setFlagImage(FLAG_IMAGES[native]);
        }
      } catch (error) {
        console.error('Failed to load native language', error);
      }
    };

    getNativeLang();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const fetchDailyStreak = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await dispatch(WordService.getDailyStreak());    
      
      if (result && result.payload) {
        setDailyStreak(result.payload);
      } else {
        setError('Failed to load daily streak');
      }
    } catch (err) {
      setError('Error fetching daily streak');
      console.error('Daily streak error:', err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchDailyStreak();

      return () => {
        console.log('Header unfocused');
      };
    }, [])
  );

  // Get flag for last learned language
  const getLastLearnedFlag = () => {
    if (!dailyStreak?.last_learned_language) return null;
    return LANGUAGE_FLAGS[dailyStreak.last_learned_language] || null;
  };

  // Get display name for last learned language
  const getLastLearnedLanguageName = () => {
    if (!dailyStreak?.last_learned_language) return 'No words learned';
    return LANGUAGE_NAMES[dailyStreak.last_learned_language] || dailyStreak.last_learned_language.toUpperCase();
  };

  // Card width: full padding (32px total = 16 left + 16 right)
  const cardWidth = screenWidth - 32;

  return (
    <Animated.View
      style={[
        styles.animatedContainer,
        {
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [16, 0],
              }),
            },
          ],
        },
      ]}
    >
      {/* Hero Card */}
      <View style={[styles.card, { width: cardWidth }]}>
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.cardContent}>
            {/* Top Section: Greeting + Streak */}
            <View style={styles.topRow}>
              <View style={styles.greetingContainer}>
                <Text style={styles.greetingText}>{getGreeting()}</Text>   
                <Text style={styles.usernameText}>
                  {username ? `${username}!` : 'Language Explorer!'}
                </Text>
              </View>

              {/* Daily Streak Badge */}
              <TouchableOpacity 
                style={styles.streakBadge}
                onPress={fetchDailyStreak}
              >
                {loading ? (
                  <View style={styles.streakInner}>
                    <Text style={styles.streakCount}>...</Text>
                  </View>
                ) : error ? (
                  <View style={styles.streakInner}>
                    <Feather name="refresh-cw" size={14} color="#FFFFFF" />
                  </View>
                ) : (
                  <View style={styles.streakInner}>
                    <Feather name="book" size={14} color="#FFFFFF" />
                    <Text style={styles.streakCount}>
                      {dailyStreak?.daily_learned_words || 0}
                    </Text>
                  </View>
                )}
                <Text style={styles.streakLabel}>Today's words</Text>
              </TouchableOpacity>
            </View>

            {/* Bottom Section: Last Learned Language + Native Language */}
            <View style={styles.bottomRow}>
              {/* Last Learned Language */}
              <View style={styles.languageBadge}>
                {getLastLearnedFlag() ? (
                  <Image source={getLastLearnedFlag()} style={styles.flag} resizeMode="cover" />
                ) : (
                  <View style={styles.flagPlaceholder}>
                    <Feather name="book-open" size={16} color="#FFFFFF" />
                  </View>
                )}
                <View>
                  <Text style={styles.nativeLabel}>Last Learned</Text>
                  <Text style={styles.nativeLang} numberOfLines={1} ellipsizeMode="tail">
                    {getLastLearnedLanguageName()}
                  </Text>
                </View>
              </View>

              {/* Motivation Text */}
              <Text style={styles.motivationText} numberOfLines={1}>
                {dailyStreak?.daily_learned_words > 0 
                  ? `Great job! ${dailyStreak.daily_learned_words} words today! 🎉`
                  : 'Start learning today! 🌟'
                }
              </Text>

              <View style={styles.settingsIcon}>
                <Ionicons name="settings-outline" size={16} color="white" />
              </View>
            </View>
          </View>

          {/* Progress Bar - Show today's progress */}
          <View style={styles.progressBarBg}>
            <View style={[
              styles.progressBarFill, 
              { 
                width: dailyStreak?.daily_learned_words 
                  ? `${Math.min((dailyStreak.daily_learned_words / 20) * 100, 100)}%` 
                  : '0%' 
              }
            ]} />
          </View>
        </LinearGradient>
      </View>

      {/* Stats Row - Updated with Daily Streak Data */}
      <View style={[styles.statsRow, { width: cardWidth }]}>
        {[
          { 
            icon: '📚', 
            label: 'Today', 
            value: dailyStreak ? `${dailyStreak.daily_learned_words}` : '0', 
            color: COLORS.primary 
          },
          { 
            icon: '🌎', 
            label: 'Language', 
            value: dailyStreak?.last_learned_language ? dailyStreak.last_learned_language.toUpperCase() : '--', 
            color: COLORS.success 
          },
          { 
            icon: '⏰', 
            label: 'Updated', 
            value: dailyStreak ? 'Now' : '--', 
            color: COLORS.warning 
          },
        ].map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <View style={styles.statHeader}>
              <Text style={styles.statIcon}>{stat.icon}</Text>
              <View style={[styles.statDot, { backgroundColor: stat.color }]} />
            </View>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Error Message */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={fetchDailyStreak}>
            <Text style={styles.retryText}>Tap to retry</Text>
          </TouchableOpacity>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  animatedContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  card: {
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
    overflow: 'hidden',
  },
  gradient: {
    padding: 20,
  },
  cardContent: {
    gap: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greetingContainer: {
    flex: 1,
  },
  greetingText: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 2,
  },
  usernameText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 24,
  },
  streakBadge: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 60,
  },
  streakInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  streakCount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  streakLabel: {
    fontSize: 10,
    color: '#FFFFFF',
    opacity: 0.8,
    marginTop: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  languageBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    flex: 0,
  },
  flag: {
    width: 24,
    height: 18,
    borderRadius: 3,
  },
  flagPlaceholder: {
    width: 24,
    height: 18,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nativeLabel: {
    fontSize: 10,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  nativeLang: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    maxWidth: 80,
  },
  motivationText: {
    flex: 1,
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
    marginHorizontal: 12,
  },
  settingsIcon: {
    padding: 6,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    marginTop: 12,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statIcon: {
    fontSize: 16,
  },
  statDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  errorContainer: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    alignItems: 'center',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    textAlign: 'center',
  },
  retryText: {
    color: '#DC2626',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
});










// import React, { useState, useEffect, useRef } from 'react';
// import {useDispatch, useSelector} from 'react-redux';
// import { Text, View, Image, Animated, Dimensions, StyleSheet } from 'react-native';
// import { useFocusEffect } from '@react-navigation/native';
// import Feather from '@expo/vector-icons/Feather';
// import Ionicons from '@expo/vector-icons/Ionicons';
// import * as SecureStore from 'expo-secure-store';
// import { LinearGradient } from 'expo-linear-gradient';

// import WordService from '../../services/WordService';

// const { width: screenWidth } = Dimensions.get('window');

// const COLORS = {
//   primary: '#3B82F6',
//   primaryLight: '#60A5FA',
//   primaryLighter: '#93C5FD',
//   primaryDark: '#2563EB',
//   background: '#F8FAFC',
//   surface: '#FFFFFF',
//   textPrimary: '#1E293B',
//   textSecondary: '#64748B',
//   textTertiary: '#94A3B8',
//   success: '#10B981',
//   warning: '#F59E0B',
//   border: '#E2E8F0',
// };

// export default function HeaderComponent({ username }) {

//   const dispatch = useDispatch();

//   const [nativeLangCode, setNativeLangCode] = useState(null);
//   const [flagImage, setFlagImage] = useState(null); 
//   const [streakCount, setStreakCount] = useState(7);
//   const fadeAnim = useRef(new Animated.Value(0)).current;

//   const FLAG_IMAGES = {
//     English: require('../../../assets/flags/england.png'),
//     Spanish: require('../../../assets/flags/spanish.png'),
//     Russian: require('../../../assets/flags/russian.png'),
//     Turkish: require('../../../assets/flags/turkish.png'),
//   };

//   useEffect(() => {
//     const getNativeLang = async () => {
//       try {
//         const native = await SecureStore.getItemAsync('native');
//         setNativeLangCode(native);

//         if (native && FLAG_IMAGES[native]) {
//           setFlagImage(FLAG_IMAGES[native]);
//         }
//       } catch (error) {
//         console.error('Failed to load native language', error);
//       }
//     };

//     getNativeLang();

//     Animated.timing(fadeAnim, {
//       toValue: 1,
//       duration: 600,
//       useNativeDriver: true,
//     }).start();
//   }, []);

//   const getGreeting = () => {
//     const hour = new Date().getHours();
//     if (hour < 12) return 'Good morning';
//     if (hour < 18) return 'Good afternoon';
//     return 'Good evening';
//   };

//   // Card width: full padding (32px total = 16 left + 16 right)
//   const cardWidth = screenWidth - 32;





//   // Daily Streak Card
//   const [dailyStreak, setDailyStreak] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchDailyStreak = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       // Assuming your WordService has a method to fetch profile statistics
//       // You might need to adjust this based on your actual service implementation
//       const result = await dispatch(WordService.getDailyStreak());    
      
//       if (result && result.payload) {
//         setDailyStreak(result.payload);
//       } else {
//         setError('Failed to load statistics');
//       }
//     } catch (err) {
//       setError('Error fetching statistics');
//       console.error('Profile statistics error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useFocusEffect(
//     React.useCallback(() => {
//       console.log('Daily Streak screen focused, fetching statistics...'); 
//       fetchDailyStreak();

//       // Optional: Cleanup function
//       return () => {
//         console.log('Daily Streak screen unfocused');
//       };
//     }, []) // Add dependencies if needed
//   );

//   return (
//     <Animated.View
//       style={[
//         styles.animatedContainer,
//         {
//           opacity: fadeAnim,
//           transform: [
//             {
//               translateY: fadeAnim.interpolate({
//                 inputRange: [0, 1],
//                 outputRange: [16, 0],
//               }),
//             },
//           ],
//         },
//       ]}
//     >
//       {/* Hero Card */}
//       <View style={[styles.card, { width: cardWidth }]}>
//         <LinearGradient
//           colors={[COLORS.primary, COLORS.primaryDark]}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 1 }}
//           style={styles.gradient}
//         >
//           <View style={styles.cardContent}>
//             {/* Top Section: Greeting + Streak */}
//             <View style={styles.topRow}>
//               <View style={styles.greetingContainer}>
//                 <Text style={styles.greetingText}>{getGreeting()}</Text>   
//                 <Text style={styles.usernameText}>
//                   {username ? `${username}!` : 'Language Explorer!`'}
//                 </Text>
//               </View>

//               <View style={styles.streakBadge}>
//                 <View style={styles.streakInner}>
//                   <Feather name="zap" size={14} color="#FFFFFF" />
//                   <Text style={styles.streakCount}>{streakCount}</Text>
//                 </View>
//                 <Text style={styles.streakLabel}>Day streak</Text>
//               </View>
//             </View>

//             {/* Bottom Section: Language + Motivation */}
//             <View style={styles.bottomRow}>
//               <View style={styles.languageBadge}>
//                 {flagImage ? (
//                   <Image source={flagImage} style={styles.flag} resizeMode="cover" />
//                 ) : (
//                   <View style={styles.flagPlaceholder} />
//                 )}
//                 <View>
//                   <Text style={styles.nativeLabel}>Native</Text>
//                   <Text style={styles.nativeLang} numberOfLines={1} ellipsizeMode="tail">
//                     {nativeLangCode || 'Not set'}
//                   </Text>
//                 </View>
//               </View>

//               <Text style={styles.motivationText} numberOfLines={1}>
//                 {nativeLangCode
//                   ? `Master ${nativeLangCode} today! 🌟`
//                   : 'Set your native language! 🚀'}
//               </Text>

//               <View style={styles.settingsIcon}>
//                 <Ionicons name="settings-outline" size={16} color="white" />
//               </View>
//             </View>
//           </View>

//           {/* Progress Bar */}
//           <View style={styles.progressBarBg}>
//             <View style={[styles.progressBarFill, { width: '65%' }]} />
//           </View>
//         </LinearGradient>
//       </View>

//       {/* Stats Row */}
//       <View style={[styles.statsRow, { width: cardWidth }]}>
//         {[
//           { icon: '📚', label: 'Words', value: '1.2K', color: COLORS.primary },
//           { icon: '⏱️', label: 'Time', value: '45m', color: COLORS.success },
//           { icon: '🎯', label: 'Goal', value: '85%', color: COLORS.warning },
//         ].map((stat, index) => (
//           <View key={index} style={styles.statCard}>
//             <View style={styles.statHeader}>
//               <Text style={styles.statIcon}>{stat.icon}</Text>
//               <View style={[styles.statDot, { backgroundColor: stat.color }]} />
//             </View>
//             <Text style={styles.statValue}>{stat.value}</Text>
//             <Text style={styles.statLabel}>{stat.label}</Text>
//           </View>
//         ))}
//       </View>
//     </Animated.View>
//   );
// }

// const styles = StyleSheet.create({
//   animatedContainer: {
//     paddingHorizontal: 16,
//     marginTop: 32,
//     marginBottom: 16,
//   },
//   card: {
//     borderRadius: 24,
//     overflow: 'hidden',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.12,
//     shadowRadius: 16,
//     elevation: 8,
//   },
//   gradient: {
//     paddingTop: 24,
//     paddingBottom: 20,
//     paddingHorizontal: 20,
//   },
//   cardContent: {
//     gap: 16,
//   },
//   topRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//   },
//   greetingContainer: {
//     flex: 1,
//     marginRight: 12,
//   },
//   greetingText: {
//     fontFamily: 'IBMPlexSans-Regular',
//     fontSize: 14,
//     color: 'rgba(255, 255, 255, 0.9)',
//     marginBottom: 4,
//   },
//   usernameText: {
//     fontFamily: 'Poppins-Bold',
//     fontSize: 20,
//     color: '#FFFFFF',
//     lineHeight: 24,
//   },
//   streakBadge: {
//     alignItems: 'center',
//     minWidth: 72,
//   },
//   streakInner: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F59E0B',
//     paddingHorizontal: 8,
//     paddingVertical: 6,
//     borderRadius: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   streakCount: {
//     fontFamily: 'Poppins-SemiBold',
//     fontSize: 12,
//     color: '#FFFFFF',
//     marginLeft: 4,
//   },
//   streakLabel: {
//     fontFamily: 'IBMPlexSans-Regular',
//     fontSize: 11,
//     color: 'rgba(255, 255, 255, 0.8)',
//     marginTop: 4,
//   },
//   bottomRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flexWrap: 'wrap',
//     gap: 12,
//   },
//   languageBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//     borderRadius: 12,
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     backdropFilter: 'blur(10px)',
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.3)',
//   },
//   flag: {
//     width: 20,
//     height: 15,
//     borderRadius: 2,
//     marginRight: 6,
//   },
//   flagPlaceholder: {
//     width: 20,
//     height: 15,
//     marginRight: 6,
//   },
//   nativeLabel: {
//     fontFamily: 'IBMPlexSans-Regular',
//     fontSize: 11,
//     color: 'rgba(255, 255, 255, 0.9)',
//   },
//   nativeLang: {
//     fontFamily: 'Poppins-SemiBold',
//     fontSize: 12,
//     color: '#FFFFFF',
//     maxWidth: 100,
//   },
//   motivationText: {
//     fontFamily: 'IBMPlexSans-Regular',
//     fontSize: 12,
//     color: 'rgba(255, 255, 255, 0.9)',
//     flex: 1,
//     minWidth: 120,
//   },
//   settingsIcon: {
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//     width: 32,
//     height: 32,
//     borderRadius: 10,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.3)',
//   },
//   progressBarBg: {
//     height: 4,
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//     borderBottomLeftRadius: 24,
//     borderBottomRightRadius: 24,
//     marginTop: 12,
//   },
//   progressBarFill: {
//     height: '100%',
//     backgroundColor: 'rgba(255, 255, 255, 0.4)',
//     borderRadius: 24,
//   },
//   statsRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 16,
//   },
//   statCard: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     padding: 12,
//     width: (screenWidth - 32 - 16) / 3, // 3 cards + 16px gap
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 6,
//     elevation: 2,
//   },
//   statHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '100%',
//     marginBottom: 6,
//   },
//   statIcon: {
//     fontSize: 18,
//   },
//   statDot: {
//     width: 6,
//     height: 6,
//     borderRadius: 3,
//   },
//   statValue: {
//     fontFamily: 'Poppins-SemiBold',
//     fontSize: 14,
//     color: COLORS.textPrimary,
//     marginBottom: 2,
//   },
//   statLabel: {
//     fontFamily: 'IBMPlexSans-Regular',
//     fontSize: 11,
//     color: COLORS.textSecondary,
//   },
// });





import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import WordService from '../../services/WordService';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { setSelectedLanguage } from '../../store/word_store';

const { width } = Dimensions.get('window');

// Enhanced blue-based gradient system
const getLanguageGradient = (langCode) => {
  const gradients = {
    en: ['#3B82F6', '#60A5FA', '#93C5FD'], // English - Blue spectrum
    es: ['#2563EB', '#3B82F6', '#60A5FA'], // Spanish - Deeper blue
    fr: ['#1D4ED8', '#2563EB', '#3B82F6'], // French - Navy to blue
    de: ['#1E40AF', '#2563EB', '#3B82F6'], // German - Dark blue
    ja: ['#3730A3', '#4F46E5', '#6366F1'], // Japanese - Indigo
    ru: ['#1E3A8A', '#2563EB', '#60A5FA'], // Russian - Deep blue
    default: ['#3B82F6', '#60A5FA', '#93C5FD'], // Default blue
  };
  return gradients[langCode] || gradients.default;
};

// Color palette based on blue-500 (#3B82F6)
const COLORS = {
  primary: '#3B82F6',
  primaryLight: '#60A5FA',
  primaryLighter: '#93C5FD',
  primaryDark: '#2563EB',
  primaryDarker: '#1D4ED8',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  textTertiary: '#94A3B8',
  border: '#E2E8F0',
  success: '#10B981',
  warning: '#F59E0B',
};

export default function LanguagesStatisticsComponents() {
  const navigation = useNavigation();
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

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return COLORS.success;
    if (percentage >= 50) return COLORS.primary;
    return COLORS.warning;
  };

  const getMotivationalMessage = (learned, total) => {
    const percentage = (learned / total) * 100;
    if (percentage === 0) return "Ready to start your language journey? 🌟";
    if (percentage < 25) return "Great start! Every word counts 💪";
    if (percentage < 50) return "Making solid progress! Keep going 🚀";
    if (percentage < 75) return "You're halfway there! Amazing work 🌈";
    if (percentage < 90) return "Almost there! You're crushing it 🔥";
    return "Language master! Incredible achievement 🏆";
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>Language Progress</Text>
        <Text style={styles.subtitle}>Track your learning journey</Text>
      </View>

      {/* Stats Grid */}
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        {statistics && statistics.length > 0 ? (
          statistics.map((item, index) => {
            const progressPercentage = (item.learned_words / item.total_words) * 100;
            
            return (
              <Pressable
                key={index}
                onPress={() => {
                  navigation.navigate('Tabs', { 
                    screen: 'Word',
                  });
                  dispatch(setSelectedLanguage(item.language_code));
                }}
                style={styles.card}
              >
                {/* Card Header with Gradient */}
                <LinearGradient
                  colors={getLanguageGradient(item.language_code)}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.cardHeader}
                >
                  <View style={styles.headerContent}>
                    <View style={styles.languageInfo}>
                      <Text style={styles.languageName}>
                        {item.language_name}
                      </Text>
                      <Text style={styles.languageCode}>
                        {item.language_code.toUpperCase()}
                      </Text>
                    </View>
                    
                    {/* Progress Circle */}
                    <View style={styles.progressCircle}>
                      <Text style={styles.progressPercentage}>
                        {Math.round(progressPercentage)}%
                      </Text>
                    </View>
                  </View>

                  {/* Motivational Message */}
                  <Text style={styles.motivationalText}>
                    {getMotivationalMessage(item.learned_words, item.total_words)}
                  </Text>
                </LinearGradient>

                {/* Stats Overview */}
                <View style={styles.statsOverview}>
                  {[
                    { 
                      label: 'Total Words', 
                      value: item.total_words, 
                      icon: '📚',
                      color: COLORS.textSecondary 
                    },
                    { 
                      label: 'Learned', 
                      value: item.learned_words, 
                      icon: '✅',
                      color: COLORS.success 
                    },
                    { 
                      label: 'Starred', 
                      value: item.starred_words, 
                      icon: '⭐',
                      color: COLORS.warning 
                    },
                  ].map((stat, i) => (
                    <View key={i} style={styles.statItem}>
                      <Text style={styles.statIcon}>{stat.icon}</Text>
                      <Text style={[styles.statValue, { color: stat.color }]}>
                        {stat.value}
                      </Text>
                      <Text style={styles.statLabel}>{stat.label}</Text>
                    </View>
                  ))}
                </View>

                {/* Progress Bar */}
                <View style={styles.progressSection}>
                  <View style={styles.progressHeader}>
                    <Text style={styles.progressLabel}>Learning Progress</Text>
                    <Text style={styles.progressText}>
                      {item.learned_words} / {item.total_words} words
                    </Text>
                  </View>
                  <View style={styles.progressBarBackground}>
                    <View 
                      style={[
                        styles.progressBarFill,
                        { 
                          width: `${progressPercentage}%`,
                          backgroundColor: getProgressColor(progressPercentage)
                        }
                      ]} 
                    />
                  </View>
                </View>

                {/* CTA Button */}
                <View style={styles.ctaSection}>
                  <LinearGradient
                    colors={[COLORS.primary, COLORS.primaryDark]}
                    style={styles.ctaButton}
                  >
                    <Text style={styles.ctaText}>
                      Continue Learning →
                    </Text>
                  </LinearGradient>
                </View>
              </Pressable>
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateEmoji}>📚</Text>
            <Text style={styles.emptyStateTitle}>No Progress Yet</Text>
            <Text style={styles.emptyStateText}>
              Start learning words to see your progress here
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: COLORS.background,
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'IBMPlexSans-Regular',
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    overflow: 'hidden',
  },
  cardHeader: {
    padding: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: COLORS.surface,
    marginBottom: 2,
  },
  languageCode: {
    fontSize: 14,
    fontFamily: 'IBMPlexSans-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  progressCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  progressPercentage: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: COLORS.surface,
  },
  motivationalText: {
    fontSize: 14,
    fontFamily: 'IBMPlexSans-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
  },
  statsOverview: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: COLORS.surface,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 20,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'IBMPlexSans-Regular',
    color: COLORS.textTertiary,
    textAlign: 'center',
  },
  progressSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontFamily: 'IBMPlexSans-Regular',
    color: COLORS.textSecondary,
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: COLORS.textPrimary,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  ctaSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  ctaButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  ctaText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: COLORS.surface,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'IBMPlexSans-Regular',
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});




// import React from 'react';
// import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';

// import { useDispatch, useSelector } from 'react-redux';

// import { LinearGradient } from 'expo-linear-gradient';

// import { useNavigation } from '@react-navigation/native';

// import WordService from '../../services/WordService';

// import { useFocusEffect } from '@react-navigation/native';
// import { useCallback } from 'react';
// import { setSelectedLanguage } from '../../store/word_store';

// const getLanguageGradient = (langCode) => {
//   const gradients = {
//     en: ['#22c55e', '#BBF7D0'], // Green - English
//     es: ['#f97316', '#fed7aa'], // Orange - Spanish
//     fr: ['#3b82f6', '#bfdbfe'], // Blue - French
//     de: ['#18181b', '#a3a3a3'], // Gray - German
//     ja: ['#ec4899', '#fbcfe8'], // Pink - Japanese
//     ru: ['#ef4444', '#fecaca'], // Red - Russian
//     default: ['#8b5cf6', '#e0e7ff'], // Purple
//   };
//   return gradients[langCode] || gradients.default;
// };

// export default function LanguagesStatisticsComponents() {

//   const navigation = useNavigation();
//   const dispatch = useDispatch();

//   const { is_auth } = useSelector((state) => state.authSlice);
//   const { statistics } = useSelector((state) => state.wordSlice);

//   useFocusEffect(
//     useCallback(() => {
//       if (is_auth) {
//         dispatch(WordService.getStatisticsForDashboard());
//       }
//     }, [is_auth, dispatch])
//   );

//   return (

//     <View  className="flex-1 bg-gray-50 py-6 rounded-2xl mt-5">

//       {/* Screen Title */}
//       <Text
//         className="text-3xl font-bold text-gray-800 mb-2 text-center"
//         style={{ fontFamily: 'Poppins-Bold' }}
//       >
//         Your Progress
//       </Text>

//       <Text
//         className="text-lg text-gray-500 mb-6 text-center"
//         style={{ fontFamily: 'IBMPlexSans-Regular' }}
//       >
//         See how far you've come 🌱
//       </Text>

//       {/* Scrollable Stats */}
//       <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
//         {statistics && statistics.length > 0 ? (
//           statistics?.map((item, index) => (
//             <Pressable
//               key={index}
//               onPress={() => {
//                 // Navigate to the Word tab and pass parameters
//                 navigation.navigate('Tabs', { 
//                   screen: 'Word',
//                   // params: { selectedLanguage: item.language_code }
//                 });
//                 dispatch(setSelectedLanguage(item.language_code))
//               }}
//               className="rounded-3xl overflow-hidden mt-5 shadow-lg bg-white border border-gray-100"
//             >
//               {/* Gradient Header */}
//               <LinearGradient
//                 colors={getLanguageGradient(item.language_name)} // Dynamic by language
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 1 }}
//                 className="p-5"
//               >
//                 {/* Language Name & Code */}
//                 <View className="flex-row items-start justify-between mb-3">
//                   <Text
//                     className="text-lg text-white opacity-90"
//                     style={{ fontFamily: 'Poppins-SemiBold' }}
//                   >
//                     {item.language_name}
//                   </Text>
//                 </View>

//                 {/* Motivational Message */}
//                 <Text
//                   className="text-white text-base mb-4 leading-relaxed"
//                   style={{ fontFamily: 'IBMPlexSans-Regular' }}
//                 >
//                   🚀 You've learned{' '}
//                   <Text className="font-semibold">{item.learned_words}</Text> words!{' '}
//                   Just{' '}
//                   <Text className="font-semibold">
//                     {item.total_words - item.learned_words}
//                   </Text>{' '}
//                   to go!
//                 </Text>

//                 {/* Stats Cards */}
//                 <View className="flex-row justify-between">
//                   {[
//                     { label: 'Total', value: item.total_words, icon: '📚' },
//                     { label: 'Learned', value: item.learned_words, icon: '✅' },
//                     { label: 'Starred', value: item.starred_words, icon: '⭐' },
//                   ].map((stat, i) => (
//                     <View
//                       key={i}
//                       className="flex-1 mx-1 bg-white/20 p-3 rounded-xl backdrop-blur-sm border border-white/30"
//                     >
//                       <Text
//                         className="text-white text-xs font-medium text-center opacity-90"
//                         style={{ fontFamily: 'IBMPlexSans-Regular' }}
//                       >
//                         {stat.icon} {stat.label}
//                       </Text>
//                       <Text
//                         className="text-white text-xl font-bold text-center mt-1"
//                         style={{ fontFamily: 'Poppins-Bold' }}
//                       >
//                         {stat.value}
//                       </Text>
//                     </View>
//                   ))}
//                 </View>
//               </LinearGradient>

//               {/* Progress Bar (Optional) */}
//               <View className="p-4 bg-gray-50">
//                 <View className="flex-row justify-between mb-1">
//                   <Text
//                     className="text-xs text-gray-500"
//                     style={{ fontFamily: 'IBMPlexSans-Regular' }}
//                   >
//                     Progress
//                   </Text>
//                   <Text
//                     className="text-xs text-gray-600"
//                     style={{ fontFamily: 'IBMPlexSans-Regular' }}
//                   >
//                     {((item.learned_words / item.total_words) * 100).toFixed(2)}%
//                   </Text>
//                 </View>
//                 <View className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
//                   <View
//                     className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
//                     style={{
//                       width: `${(item.learned_words / item.total_words) * 100}%`,
//                     }}
//                   />
//                 </View>
//               </View>
//             </Pressable>
//           ))
//         ) : (
//           <View className="flex-1 justify-center items-center py-10">
//             <Text
//               className="text-gray-500 text-lg"
//               style={{ fontFamily: 'IBMPlexSans-Regular' }}
//             >
//               No stats yet. Start learning to see your progress!
//             </Text>
//           </View>
//         )}
//       </ScrollView>
//     </View >


//   );
// }



// const styles = StyleSheet.create({
//   container: {
//     marginTop: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: '600',
//     marginBottom: 5,
//   },
//   boxContainer: {
//     width: '100%',
//   },
//   langBox: {
//     height: 150,
//     width: '100%',
//     backgroundColor: '#f3f3f3',
//     borderRadius: 10,
//     marginBottom: 10,
//     paddingHorizontal: 15,
//     justifyContent: 'center',
//     shadowColor: '#000',
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 1,
//   },
//   langLeft: {
//     justifyContent: 'center',
//   },
//   langName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   stats: {
//     fontSize: 13,
//     color: '#555',
//   },
// });





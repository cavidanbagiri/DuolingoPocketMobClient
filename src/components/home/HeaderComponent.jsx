
import React, { useState, useEffect } from 'react';
import { Text, View, Image, Animated, Dimensions } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as SecureStore from 'expo-secure-store';
import { LinearGradient } from 'expo-linear-gradient';

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

export default function HeaderComponent({ username }) {
  const [nativeLangCode, setNativeLangCode] = useState(null);
  const [flagImage, setFlagImage] = useState(null);
  const [streakCount, setStreakCount] = useState(7);
  const fadeAnim = useState(new Animated.Value(0))[0];

  const FLAG_IMAGES = {
    'English': require('../../../assets/flags/england.png'),
    'Spanish': require('../../../assets/flags/spanish.png'),
    'Russian': require('../../../assets/flags/russian.png'),
    'Turkish': require('../../../assets/flags/turkish.png'),
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
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <Animated.View 
      style={{ 
        opacity: fadeAnim,
        transform: [{
          translateY: fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [20, 0],
          }),
        }],
      }}
      className="mx-5 mt-8 mb-2 "
    >
      {/* Main Header Card - Fixed Width Container */}
      <View className="w-full" style={{ width: screenWidth - 60 }}>
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="rounded-3xl shadow-2xl"
        >
          <View className="p-6">
            {/* Top Row - Profile & Greeting - FIXED LAYOUT */}
            <View className="flex-row items-start justify-between mb-4">
              {/* Left Side - Profile & Text */}
              <View className="flex-row items-center flex-1" style={{ maxWidth: '70%' }}>
                {/* Profile Avatar */}
                <View className="relative mr-4">
                  <View className="absolute -inset-1 bg-white/30 rounded-full blur-sm" />
                  <Image
                    source={require('../../../assets/avatar.webp')}
                    style={{ 
                      width: 60, 
                      height: 60, 
                      borderRadius: 30,
                      borderWidth: 3,
                      borderColor: 'rgba(255,255,255,0.3)',
                    }}
                    resizeMode="cover"
                  />
                  <View className="absolute bottom-1 right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full" />
                </View>

                {/* Greeting Text - Fixed Width */}
                <View style={{ flex: 1 }}>
                  <Text
                    className="text-white/90 text-xs font-medium mb-1"
                    style={{ fontFamily: 'IBMPlexSans-Regular' }}
                  >
                    {getGreeting()}
                  </Text>
                  <Text
                    className="text-white text-xl font-bold leading-tight"
                    style={{ fontFamily: 'Poppins-Bold' }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {username ? `${username}!` : 'Language Explorer!'}
                  </Text>
                </View>
              </View>

              {/* Right Side - Streak Badge */}
              <View className="items-center" style={{ minWidth: 60 }}>
                <View className="bg-amber-500 rounded-2xl px-3 py-2 flex-row items-center shadow-lg">
                  <Feather name="zap" size={14} color="#FFFFFF" />
                  <Text
                    className="text-white font-bold ml-1 text-xs"
                    style={{ fontFamily: 'Poppins-SemiBold' }}
                  >
                    {streakCount}
                  </Text>
                </View>
                <Text
                  className="text-white/80 text-xs mt-1"
                  style={{ fontFamily: 'IBMPlexSans-Regular' }}
                >
                  Day Streak
                </Text>
              </View>
            </View>

            {/* Bottom Row - Language Info - HORIZONTAL LAYOUT */}
            <View className="flex-row items-center justify-between">
              {/* Language Badge & Text Container */}
              <View className="flex-row items-center flex-1" style={{ maxWidth: '80%' }}>
                {/* Language Badge */}
                <View className="bg-white/20 rounded-xl px-3 py-2 flex-row items-center backdrop-blur-sm border border-white/30 mr-3">
                  {flagImage && (
                    <Image
                      source={flagImage}
                      style={{ 
                        width: 20, 
                        height: 15, 
                        borderRadius: 2,
                        marginRight: 6,
                      }}
                      resizeMode="cover"
                    />
                  )}
                  <View>
                    <Text
                      className="text-white/90 text-xs"
                      style={{ fontFamily: 'IBMPlexSans-Regular' }}
                    >
                      Native
                    </Text>
                    <Text
                      className="text-white font-semibold text-xs"
                      style={{ fontFamily: 'Poppins-SemiBold' }}
                      numberOfLines={1}
                    >
                      {nativeLangCode || 'Not set'}
                    </Text>
                  </View>
                </View>

                {/* Motivational Text - Fixed Width */}
                <View style={{ flex: 1 }}>
                  <Text
                    className="text-white/90 text-xs leading-tight"
                    style={{ fontFamily: 'IBMPlexSans-Regular' }}
                    numberOfLines={2}
                  >
                    {nativeLangCode 
                      ? `Master ${nativeLangCode} today! 🌟` 
                      : 'Set native language! 🚀'
                    }
                  </Text>
                </View>
              </View>

              {/* Settings Icon */}
              <View className="ml-2">
                <View className="bg-white/20 w-8 h-8 rounded-lg items-center justify-center backdrop-blur-sm border border-white/30">
                  <Ionicons name="settings-outline" size={16} color="white" />
                </View>
              </View>
            </View>
          </View>

          {/* Progress Indicator Bar */}
          <View className="h-1 bg-white/20 rounded-b-3xl">
            <View 
              className="h-full bg-white/40 rounded-b-3xl" 
              style={{ width: '65%' }}
            />
          </View>
        </LinearGradient>
      </View>

      {/* Daily Stats Mini Cards - PROPER HORIZONTAL LAYOUT */}
      <View className="flex-row justify-between mt-4 w-full">
        {[
          { icon: '📚', label: 'Words', value: '1.2K', color: COLORS.primary },
          { icon: '⏱️', label: 'Time', value: '45m', color: COLORS.success },
          { icon: '🎯', label: 'Goal', value: '85%', color: COLORS.warning },
        ].map((stat, index) => (
          <View 
            key={index}
            className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 mx-1"
            style={{ 
              width: (screenWidth - 80) / 3, // Calculate equal width considering margins
              minHeight: 70,
            }}
          >
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-base">{stat.icon}</Text>
              <View className="w-2 h-2 rounded-full" style={{ backgroundColor: stat.color }} />
            </View>
            <Text
              className="text-gray-800 font-bold text-sm"
              style={{ fontFamily: 'Poppins-SemiBold' }}
            >
              {stat.value}
            </Text>
            <Text
              className="text-gray-500 text-xs mt-1"
              style={{ fontFamily: 'IBMPlexSans-Regular' }}
            >
              {stat.label}
            </Text>
          </View>
        ))}
      </View>
    </Animated.View>
  );
}



// Old Code
// import React, { useState, useEffect } from 'react';

// import { Text, View, Image } from 'react-native'

// import Feather from '@expo/vector-icons/Feather';

// import * as SecureStore from 'expo-secure-store';


// export default function HeaderComponent({ username }) {


//   const [nativeLangCode, setNativeLangCode] = useState(null);
//   const [flagImage, setFlagImage] = useState(null);


//   const FLAG_IMAGES = {
//     'English': require('../../../assets/flags/england.png'),
//     'Spanish': require('../../../assets/flags/spanish.png'),
//     'Russian': require('../../../assets/flags/russian.png'),
//     'Turkish': require('../../../assets/flags/turkish.png'),
//     };
  

//     useEffect(() => {
//     const getNativeLang = async () => {
//       try {
//         const native = await SecureStore.getItemAsync('native');
//         setNativeLangCode(native);

//         // ✅ 2. Map code to image
//         if (native && FLAG_IMAGES[native]) {
//           setFlagImage(FLAG_IMAGES[native]);
//         } 
//       } catch (error) {
//         console.error('Failed to load native language', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     getNativeLang();
//   }, []);

//   return (


//     <View className='flex flex-row items-center mt-5 w-full border border-gray-100 rounded-2xl bg-white/90 px-4 py-5 shadow-sm'>
//       {/* Profile Image (Left) */}
//       <View className='relative'>
//         <Image
//           source={require('../../../assets/avatar.webp')}
//           style={{ width: 60, height: 60, borderRadius: 9999 }}
//           resizeMode='cover'
//         />
//         {/* Online indicator */}
//         <View className='absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full' />
//       </View>

//       {/* Text Content */}
//       <View className='flex-1 ml-4'>
//         <Text
//           className='text-2xl font-semibold text-gray-800'
//           style={{ fontFamily: 'Poppins-Bold' }}
//         >
//           {username ? `Hi, ${username}!` : 'Hi, Language Explorer!'}
//         </Text>

//         <Text
//           className='text-lg  text-blue-700 mt-1'
//           style={{ fontFamily: 'Poppins-Regular' }}
//         >
//           Ready to learn words?
//         </Text>

//         <View className='flex flex-row items-center mt-0.5'>
//           {/* UK Flag Badge */}


//           <Image
//             source={flagImage}
//             style={{ width: 30, height: 24, borderRadius: 4, marginRight: 6 }}
//             resizeMode='cover'
//           />
          
//           <Text
//             className='text-sm text-gray-600'
//             style={{ fontFamily: 'IBMPlexSans-Regular' }}
//           >
//             Native: {nativeLangCode}
//           </Text>
//         </View>
//       </View>

//       {/* Right-side icon (streak or menu) */}
//       <View className='mr-1'>
//         <Feather name="zap" size={20} color="#f59e0b" />
//       </View>
//     </View>

    
//   )

// }



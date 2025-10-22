

import React, {useState, useEffect} from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AuthService from '../../services/AuthService';
import { useNavigation, useFocusEffect  } from '@react-navigation/native';
import WordService from '../../services/WordService';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const { user } = useSelector((state) => state.authSlice);
  
  // Add statistics state
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const logoutHandler = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Logout", 
          style: "destructive",
          onPress: () => dispatch(AuthService.userLogout())
        }
      ]
    );
  };

  // Fetch statistics function
  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Assuming your WordService has a method to fetch profile statistics
      // You might need to adjust this based on your actual service implementation
      const result = await dispatch(WordService.profile_fetch_statistics());
      
      if (result && result.payload) {
        setStatistics(result.payload);
      } else {
        setError('Failed to load statistics');
      }
    } catch (err) {
      setError('Error fetching statistics');
      console.error('Profile statistics error:', err);
    } finally {
      setLoading(false);
    }
  };


  useFocusEffect(
    React.useCallback(() => {
      console.log('Profile screen focused, fetching statistics...');
      fetchStatistics();

      // Optional: Cleanup function
      return () => {
        console.log('Profile screen unfocused');
      };
    }, []) // Add dependencies if needed
  );


  // Format number with commas
  const formatNumber = (num) => {
    return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || '0';
  };

  // Calculate member since year
  const getMemberSinceYear = (joinDate) => {
    if (!joinDate) return '2024';
    try {
      return new Date(joinDate).getFullYear().toString();
    } catch {
      return '2024';
    }
  };

  // Real statistics data
  const realStats = [
    { 
      label: 'Words Learned', 
      value: statistics ? formatNumber(statistics.total_learned_words) : '0', 
      icon: 'book-outline' 
    },
    { 
      label: 'Days Registered', 
      value: statistics ? `${statistics.days_registered} days` : '0 days', 
      icon: 'calendar-outline' 
    },
    { 
      label: 'Member Since', 
      value: statistics ? getMemberSinceYear(statistics.join_date) : '2024', 
      icon: 'person-outline' 
    },
  ];

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center" style={{ paddingTop: insets.top }}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text className="text-gray-500 mt-4">Loading statistics...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="px-4 py-3 bg-white border-b border-gray-200">
        <Text className="text-xl font-bold text-gray-900">Profile</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* User Profile Card */}
        <View className="bg-white mx-4 my-6 rounded-2xl shadow-sm border border-gray-100">
          <View className="items-center p-6">
            <View className="w-20 h-20 bg-indigo-100 rounded-full items-center justify-center mb-4">
              <Ionicons name="person" size={32} color="#6366F1" />
            </View>
            
            {/* Username */}
            <Text className="text-xl font-semibold text-gray-900">
              {statistics?.username || user?.username || 'User Name'}
            </Text>
            
            {/* Email */}
            <Text className="text-gray-500 text-sm mt-1">
              {statistics?.email || user?.email || 'user@example.com'}
            </Text>
            
            {/* Premium Status & Join Date */}
            <Text className="text-indigo-600 text-sm mt-2">
              {user?.is_premium ? 'Premium Member' : 'Free Member'} • Since {getMemberSinceYear(statistics?.join_date)}
            </Text>
          </View>

          {/* Stats Row */}
          <View className="flex-row justify-around py-4 border-t border-gray-100">
            {realStats.map((stat, index) => (
              <View key={index} className="items-center">
                <Ionicons name={stat.icon} size={20} color="#6366F1" />
                <Text className="text-lg font-bold text-gray-900 mt-1">
                  {stat.value}
                </Text>
                <Text className="text-xs text-gray-500">
                  {stat.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Additional Statistics Card */}
        <View className="bg-white mx-4 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <Text className="text-gray-500 text-sm font-medium px-6 py-3 border-b border-gray-100">
            LEARNING STATISTICS
          </Text>
          
          <View className="px-6 py-4">
            <View className="flex-row justify-between items-center py-2">
              <Text className="text-gray-700">Total Words Learned</Text>
              <Text className="text-gray-900 font-semibold">
                {statistics ? formatNumber(statistics.total_learned_words) : '0'}
              </Text>
            </View>
            
            <View className="h-px bg-gray-100 my-2" />
            
            <View className="flex-row justify-between items-center py-2">
              <Text className="text-gray-700">Days as Member</Text>
              <Text className="text-gray-900 font-semibold">
                {statistics ? statistics.days_registered : '0'} days
              </Text>
            </View>
            
            <View className="h-px bg-gray-100 my-2" />
            
            <View className="flex-row justify-between items-center py-2">
              <Text className="text-gray-700">Join Date</Text>
              <Text className="text-gray-900 font-semibold">
                {statistics?.join_date ? new Date(statistics.join_date).toLocaleDateString() : 'N/A'}
              </Text>
            </View>
          </View>
        </View>

        {/* App Settings */}
        <View className="bg-white mx-4 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <Text className="text-gray-500 text-sm font-medium px-6 py-3 border-b border-gray-100">
            APP SETTINGS
          </Text>
          
          <View className="h-px bg-gray-100 mx-6" />
          
          <View className="flex-row items-center justify-between px-6 py-4">
            <Text className="text-gray-900">Language</Text>
            <Text className="text-gray-500">English</Text>
          </View>
        </View>

        {/* Error Display */}
        {error && (
          <View className="bg-red-50 mx-4 rounded-2xl border border-red-200 p-4 mb-6">   
            <View className="flex-row items-center">
              <Ionicons name="warning-outline" size={20} color="#EF4444" />
              <Text className="text-red-700 ml-2">{error}</Text>
            </View>
            <TouchableOpacity onPress={fetchStatistics} className="mt-2"> 
              <Text className="text-red-600 text-sm font-medium">Tap to retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Logout Button */}
        <TouchableOpacity
          className="bg-white mx-4 rounded-2xl shadow-sm border border-gray-100 mb-8"
          onPress={logoutHandler}
        >
          <View className="flex-row items-center justify-center px-6 py-4">
            <Ionicons name="log-out-outline" size={20} color="#EF4444" />
            <Text className="text-red-600 font-medium ml-2">Logout</Text>
          </View>
        </TouchableOpacity>

        {/* App Version */}
        <View className="items-center pb-8">
          <Text className="text-gray-400 text-sm">W9999 App</Text>
          <Text className="text-gray-400 text-xs mt-1">Version 1.0.0</Text>
        </View>
      </ScrollView> 
    </View>
  );
}











// import React, {useState, useEffect} from 'react';
// import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
// import { useDispatch, useSelector } from 'react-redux';
// import { Ionicons } from '@expo/vector-icons';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import AuthService from '../../services/AuthService';
// import { useNavigation } from '@react-navigation/native';
// import WordService from '../../services/WordService';

// export default function ProfileScreen() {

//   const navigation = useNavigation();
//   const dispatch = useDispatch();
//   const insets = useSafeAreaInsets();
//   const { user } = useSelector((state) => state.authSlice); // Assuming you have user data in auth slice

//   const logoutHandler = () => {
//     Alert.alert(
//       "Logout",
//       "Are you sure you want to logout?",
//       [
//         {
//           text: "Cancel",
//           style: "cancel"
//         },
//         { 
//           text: "Logout", 
//           style: "destructive",
//           onPress: () => dispatch(AuthService.userLogout())
//         }
//       ]
//     );
//   };

//   const stats = [ 
//     { label: 'Words Learned', value: '1,243', icon: 'book-outline' },
//     { label: 'Categories', value: '8', icon: 'folder-outline' },
//     { label: 'Streak', value: '12 days', icon: 'flame-outline' },
//   ];

//   useEffect(() => {
//     console.log('use effect is working')
//     dispatch(WordService.profile_fetch_statistics());
//   },);

//   return (
//     <View className="flex-1 bg-gray-50" style={{ paddingTop: insets.top }}>
//       {/* Header */}
//       <View className="px-4 py-3 bg-white border-b border-gray-200">
//         <Text className="text-xl font-bold text-gray-900">Profile</Text>
//       </View>

//       <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
//         {/* User Profile Card */}
//         <View className="bg-white mx-4 my-6 rounded-2xl shadow-sm border border-gray-100">
//           <View className="items-center p-6">
//             <View className="w-20 h-20 bg-indigo-100 rounded-full items-center justify-center mb-4">
//               <Ionicons name="person" size={32} color="#6366F1" />
//             </View>
//             <Text className="text-xl font-semibold text-gray-900">
//               {user?.name || 'User Name'}
//             </Text>
//             <Text className="text-gray-500 text-sm mt-1">
//               {user?.email || 'user@example.com'}
//             </Text>
//             <Text className="text-indigo-600 text-sm mt-2">
//               Premium Member • Since 2024
//             </Text>
//           </View>

//           {/* Stats Row */}
//           <View className="flex-row justify-around py-4 border-t border-gray-100">
//             {stats.map((stat, index) => (
//               <View key={index} className="items-center">
//                 <Ionicons name={stat.icon} size={20} color="#6366F1" />
//                 <Text className="text-lg font-bold text-gray-900 mt-1">
//                   {stat.value}
//                 </Text>
//                 <Text className="text-xs text-gray-500">
//                   {stat.label}
//                 </Text>
//               </View>
//             ))}
//           </View>
//         </View>


//         {/* App Settings */}
//         <View className="bg-white mx-4 rounded-2xl shadow-sm border border-gray-100 mb-6">
//           <Text className="text-gray-500 text-sm font-medium px-6 py-3 border-b border-gray-100">
//             APP SETTINGS
//           </Text>
          
//           <View className="h-px bg-gray-100 mx-6" />
          
//           <View className="flex-row items-center justify-between px-6 py-4">
//             <Text className="text-gray-900">Language</Text>
//             <Text className="text-gray-500">English</Text>
//           </View>
//         </View>

//         {/* Logout Button */}
//         <TouchableOpacity
//           className="bg-white mx-4 rounded-2xl shadow-sm border border-gray-100 mb-8"
//           onPress={logoutHandler}
//         >
//           <View className="flex-row items-center justify-center px-6 py-4">
//             <Ionicons name="log-out-outline" size={20} color="#EF4444" />
//             <Text className="text-red-600 font-medium ml-2">Logout</Text>
//           </View>
//         </TouchableOpacity>

//         {/* App Version */}
//         <View className="items-center pb-8">
//           <Text className="text-gray-400 text-sm">W9999 App</Text>
//           <Text className="text-gray-400 text-xs mt-1">Version 1.0.0</Text>
//         </View>
//       </ScrollView>
//     </View>
//   );
// }




  // const menuItems = [
  //   {
  //     icon: 'person-outline',
  //     title: 'Edit Profile',
  //     onPress: () => console.log('Edit Profile'),
  //     color: '#6366F1'
  //   },
  //   {
  //     icon: 'notifications-outline',
  //     title: 'Notifications',
  //     onPress: () => navigation.navigate('Notifications'),
  //     color: '#10B981'
  //   },
  //   {
  //     icon: 'shield-checkmark-outline',
  //     title: 'Privacy & Security',
  //     onPress: () => navigation.navigate('PrivacySecurity'),
  //     color: '#F59E0B'
  //   },
  //   {
  //     icon: 'help-buoy-outline',
  //     title: 'Help & Support',
  //     onPress: () => navigation.navigate('HelpSupport'),
  //     color: '#EF4444'
  //   },
  //   {
  //     icon: 'information-circle-outline',
  //     title: 'About App',
  //     onPress: () => navigation.navigate('AboutApp'),
  //     color: '#8B5CF6'
  //   },
  // ];

  
        {/* Menu Items */}
        {/* <View className="bg-white mx-4 rounded-2xl shadow-sm border border-gray-100 mb-6">
          {menuItems.map((item, index) => (
            <React.Fragment key={index}>
              <TouchableOpacity
                className="flex-row items-center px-6 py-4"
                onPress={item.onPress}
              >
                <View 
                  className="w-10 h-10 rounded-full items-center justify-center mr-4"
                  style={{ backgroundColor: item.color + '20' }}
                >
                  <Ionicons name={item.icon} size={20} color={item.color} />
                </View>
                <Text className="text-gray-900 flex-1">{item.title}</Text>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>
              {index < menuItems.length - 1 && (
                <View className="h-px bg-gray-100 mx-6" />
              )}
            </React.Fragment>
          ))}
        </View> */}
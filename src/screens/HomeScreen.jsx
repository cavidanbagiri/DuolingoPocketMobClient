

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ScrollView, StyleSheet, Text, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getFromStorage } from '../utils/storage';

export default function HomeScreen() {
  const [username, setUsername] = useState('');

  const is_auth = useSelector((state) => state.authSlice.is_auth);

  useEffect(() => {
    const loadUsername = async () => {
      const storedUsername = await getFromStorage('username');
      if (is_auth === false) {
        setUsername('');
        storedUsername = '';
      }
      setUsername(storedUsername.charAt(0).toUpperCase() + storedUsername.slice(1) || '');
    };
    loadUsername();
  }, [is_auth]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title_text}>
          {username ? `Hi, ${username}!` : 'Hi, There!'}
        </Text>

        <Image
          source={require('../../assets/HomeImage.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scroll: {
    padding: 16,
    alignItems: 'flex-start', // text and image align to the left
  },
  title_text: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 12,
  },
});



// import React, { use } from 'react';

// import { useState, useEffect } from 'react';

// import { ScrollView, StyleSheet, Text, View, Image } from 'react-native';

// import { SafeAreaView } from 'react-native-safe-area-context';
// import { getFromStorage } from '../utils/storage';

// export default function HomeScreen() {

//   const [username, setUsername] = useState('');

//   useEffect(() => {
//     const username = getFromStorage('username');
//     setUsername(username);
//   }, []);

//   return (
//     <SafeAreaView style={styles.container}>

//       {/* Title and Username Section */}
//       <View style={styles.container}>
//         {
//           username === '' ?
//             <Text style={styles.title_text}>Hi, There!</Text>
//             :
//             <Text style={styles.title_text}>Hi, {username}!</Text>
//         }
//       </View>

//       {/* Image Section */}
//       <Image
//           source={require('../../assets/HomeImage.png')}
//           style={styles.image}
//           resizeMode="contain"
//         />

//     </SafeAreaView>

//   );
// }


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'flex-start',
//     // backgroundColor: '#FFFFFF',
//     backgroundColor: '#FF4F2F',
//     padding: 10,
//   },
//   title_text: {
//     fontSize: 32,
//     fontFamily: 'Poppins-Bold',
//   },
//   image: {
//     width: '100%',
//     height: 250,
//   },

// });
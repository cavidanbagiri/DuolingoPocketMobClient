import React, { use } from 'react';

import { useState, useEffect } from 'react';

import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { getFromStorage } from '../utils/storage';

export default function HomeScreen() {

  const [username, setUsername] = useState('');

  useEffect(() => {
    setUsername(getFromStorage('username'));
  }, []);

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.container}>
        {
          username === '' ?
            <Text style={styles.title_text}>Hello, There!</Text>
            :
            <Text style={styles.title_text}>Hello, {username}!</Text>
        }
      </View>

    </SafeAreaView>

  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    padding: 10,
  },
  title_text: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
  },

});
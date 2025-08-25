

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ScrollView, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getFromStorage } from '../utils/storage';

import MsgBox from '../components/layouts/MsgBox';
import DropdownNativeLangComponent from '../components/home/DropdownNativeLangComponent';
import ChooseLangComponent from '../components/home/ChooseLangComponent';

import { setNewTargetLanguageCondFalse } from '../store/auth_store';
import LanguagesStatisticsComponents from '../components/home/LanguagesStatisticsComponents';

import { useNavigation } from '@react-navigation/native'; // 👈 Import this

export default function HomeScreen() {

  const navigation = useNavigation(); // 👈 Get navigation object

  const dispatch = useDispatch();

  const [username, setUsername] = useState('');
  const [native, setNative] = useState('');
  const [nativeLanguage, setNativeLanguage] = useState('');
  const [choosenLanguage, setChoosenLanguage] = useState('');

  const is_auth = useSelector((state) => state.authSlice.is_auth);
  const native_lang = useSelector((state) => state.authSlice.native_lang);
  const new_target_lang_cond = useSelector((state) => state.authSlice.new_target_lang_cond);

  useEffect(() => {
    setTimeout(() => {
      dispatch(setNewTargetLanguageCondFalse());
    }, 1000);
  }, [new_target_lang_cond]);


  useEffect(() => {
    const loadUsername = async () => {
      let storedUsername = await getFromStorage('username');
      if (is_auth === false) {
        setUsername('');
        storedUsername = '';
      }
      setUsername(storedUsername.charAt(0).toUpperCase() + storedUsername.slice(1) || '');
    };
    loadUsername();
  }, [is_auth]);


  useEffect(() => {
    const loadNativeLanguage = async () => {
      let storedNativeLanguage = await getFromStorage('native');
      if (is_auth === false) {
        setNativeLanguage('');
        storedNativeLanguage = '';
      }
      setNative(storedNativeLanguage);
    };
    loadNativeLanguage();
  }, [native_lang, is_auth]);


  return (

    <SafeAreaView style={styles.safeArea}>

      {
        is_auth ?
          <ScrollView contentContainerStyle={styles.scroll}>
            <Text className='text-3xl font-bold text-center'>
              {username ? `Hi, ${username}!` : 'Hi, There!'}
            </Text>

            {
              new_target_lang_cond.is_cond &&
              <MsgBox
                message={new_target_lang_cond.msg}
                visible={new_target_lang_cond.is_cond}
                type="error"
              />
            }

            {/* Wrapper View with proper width */}
            <View style={styles.dropdownMainWrapper}>

              {/* {
                native === '' && is_auth === true &&
                <View style={styles.dropdownWrapper}>
                  <DropdownNativeLangComponent
                    selectedLanguage={nativeLanguage}
                    setSelectedLanguage={setNativeLanguage}
                  />
                </View>
              } */}

              {
                is_auth === true &&
                <View>
                  <ChooseLangComponent
                    selectedLanguage={choosenLanguage}
                    setSelectedLanguage={setChoosenLanguage}
                    nativeLanguage={nativeLanguage}
                  />
                </View>
              }

              {
                is_auth === true &&
                <View>
                  <LanguagesStatisticsComponents />
                </View>
              }

            </View>

          </ScrollView>
          :

          <View className="flex-1 bg-white p-6">
            {/* Welcome Section */}
            <View className="items-center mt-20 mb-6">
              <Text
                style={{ fontFamily: 'Poppins-Regular' }}
                className="text-5xl font-bold text-gray-800"
              >
                Welcome
              </Text>
            </View>

            {/* Logo Image */}
            <View className="items-center mb-8">
              <Image
                source={require('../../assets/logo.png')}
                style={{
                  width: '70%',
                  marginTop: 20,
                  marginBottom: 20,
                  height: 100,
                  resizeMode: 'cover',
                }}
              />
            </View>

            {/* Feature Card */}
            <View
              className="bg-white p-6 rounded-2xl mb-8 "
            >
              <Text
                style={{ fontFamily: 'OpenSans-Regular' }}
                className="text-2xl text-center text-gray-800 mb-2 font-bold"
              >
                Learn Top Words
              </Text>
              <Text
                style={{ fontFamily: 'IBMPlexSans-Regular' }}
                className="text-center text-lg text-gray-600 leading-relaxed"
              >
                Master the most common words in 3 languages through real-life sentences and interactive practice.
              </Text>
            </View>

            {/* Call-to-Action Button */}
            <TouchableOpacity
              className="flex flex-row justify-center items-center mt-12 bg-blue-600 py-4 rounded-xl shadow-md"
              onPress={() => {
                  navigation.navigate('Login/Register')
                }}
              activeOpacity={0.8}
            >
              <Text
                style={{ fontFamily: 'IBMPlexSans-SemiBold' }}
                className="text-white text-lg"
              >
                Continue Learning
              </Text>
            </TouchableOpacity>

            {/* Optional: Sign Up Link (small) */}
            <View className="mt-4 items-center">
              <Text
                style={{ fontFamily: 'IBMPlexSans-Regular' }}
                className="text-sm text-gray-500"
              >
                New here?{' '}
                <Text className="text-blue-600 font-semibold"
                onPress={() => {
                  navigation.navigate('Login/Register')
                }}
                >Create an account</Text>
              </Text>
            </View>
          </View>

      }

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
  },
  dropdownMainWrapper: {
    width: '100%',
    marginBottom: 20,
  },
  dropdownWrapper: {
    flex: 1, // each takes half width
  },
});


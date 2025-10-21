

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ScrollView, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getFromStorage } from '../../utils/storage';

import MsgBox from '../../components/layouts/MsgBox';
import ChooseLangComponent from '../../components/home/ChooseLangComponent';

import Feather from '@expo/vector-icons/Feather';

import { setNewTargetLanguageCondFalse } from '../../store/auth_store';
import LanguagesStatisticsComponents from '../../components/home/LanguagesStatisticsComponents';

import HeaderComponent from '../../components/home/HeaderComponent';
import InitialPageComponent from '../../components/home/InitialPageComponent';

export default function HomeScreen() {


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

    <SafeAreaView style={styles.safeArea} className='bg-slate-100'>

      {
        is_auth ?
          <ScrollView contentContainerStyle={styles.scroll}>


            {
              new_target_lang_cond.is_cond &&
              <MsgBox
                message={new_target_lang_cond.msg}
                visible={new_target_lang_cond.is_cond}
                type="error"
              />
            }

            <HeaderComponent username={username} />


            {/* Wrapper View with proper width */}
            <View
              className='rounded-2xl'
              style={styles.dropdownMainWrapper}>


                <View>
                  <ChooseLangComponent 
                    selectedLanguage={choosenLanguage}
                    setSelectedLanguage={setChoosenLanguage} 
                    // nativeLanguage={nativeLanguage} 
                  />
                </View>

                <View >
                  <LanguagesStatisticsComponents />
                </View>

            </View>

          </ScrollView>
          :

         <InitialPageComponent />
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
    // paddingHorizontal: 16,
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


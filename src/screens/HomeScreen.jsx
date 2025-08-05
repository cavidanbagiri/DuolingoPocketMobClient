

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ScrollView, StyleSheet, Text, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getFromStorage } from '../utils/storage';

import MsgBox from '../components/layouts/MsgBox';
import DropdownNativeLangComponent from '../components/home/DropdownNativeLangComponent';
import ChooseLangComponent from '../components/home/ChooseLangComponent';

import { setNewTargetLanguageCondFalse } from '../store/auth_store';
import SelectedLanguagesBox from '../components/home/SelectedLanguagesComponents';

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
      const storedUsername = await getFromStorage('username');
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
      const storedNativeLanguage = await getFromStorage('native');
      const storedUsername = await getFromStorage('username');
      const storedTargetLang = await getFromStorage('target');
      if (is_auth === false) {
        setNativeLanguage('');
        storedNativeLanguage = '';
      }
      setNative(storedNativeLanguage);
    };
    loadNativeLanguage();
  }, [native_lang]);


  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title_text}>
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

        <Image
          source={require('../../assets/HomeImage.png')}
          style={styles.image}
          resizeMode="contain"
        />

        {/* Wrapper View with proper width */}
        <View style={styles.dropdownMainWrapper}>

          {
            native === '' && is_auth === true &&
            <View style={styles.dropdownWrapper}>
              <DropdownNativeLangComponent
                selectedLanguage={nativeLanguage}
                setSelectedLanguage={setNativeLanguage}
              />
            </View>
          }

          {
           is_auth === true &&
            <View>
              <ChooseLangComponent
                selectedLanguage={choosenLanguage}
                setSelectedLanguage={setChoosenLanguage}
              />
            </View>
          }

          {
           is_auth === true &&
            <View>
              <SelectedLanguagesBox/>
            </View>
          }

        </View>

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
  dropdownMainWrapper: {
    width: '100%',
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // gap: 10, // optional (if React Native version supports it)
    marginBottom: 20,
  },
  dropdownWrapper: {
  flex: 1, // each takes half width
},
});


import { Text, View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import WordService from '../services/WordService.js'



import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

import {setSelectedLanguage} from '../store/word_store';

import VocabCard from '../components/cards/VocabCard';
import FilterComponent from '../components/wordscreen/FilterComponent.jsx';

export default function LearnedScreen() {

  const dispatch = useDispatch();

  const { is_auth } = useSelector((state) => state.authSlice);

  const { words, words_pending, selectedLanguage, availableLanguages } = useSelector((state) => state.wordSlice);


  useFocusEffect(
    useCallback(() => {
      if (is_auth) {
        // dispatch(WordService.fetchWords({ filter: 'learned' }));
        // dispatch(WordService.handleLanguageSelect({ filter: 'learned' }, lang_code='ru'));
        console.log('selected language is ', selectedLanguage);
        dispatch(WordService.handleLanguageSelect({
          langCode: selectedLanguage,
          filter: 'learned'
        }));
      }
    }, [is_auth, dispatch])
  );



  return (
    <SafeAreaView>
      {/* <FilterComponent screen='learned'/> */}

      {availableLanguages?.length > 1 && (
        <View >
          <Text>Select Language:</Text>
          <View >
            {availableLanguages.map((lang) => (
              <TouchableOpacity
                key={lang.lang}
                onPress={() => {
                  dispatch(setSelectedLanguage(lang.lang));
                  dispatch(WordService.handleLanguageSelect({
                    filter: 'learned',
                    langCode: lang.lang
                  }))
                }}
              >
                <Text>{lang.language_name}</Text>
                <Text>({lang.total_words} words)</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {
        (selectedLanguage && words_pending) &&
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <ActivityIndicator
            size="large"
            color="#0000ff" // Change to your preferred color
          />
          <Text style={{ marginTop: 10 }}>Loading words...</Text>
        </View>
      }

      {
        (selectedLanguage && !words_pending && words?.length === 0) &&
        <Text style={{ textAlign: 'center', marginTop: 20 }}>
          There is not any learned words yet.
        </Text>
      }

      {/* Words list */}
      {
        (selectedLanguage && !words_pending && words?.length > 0) &&
        words?.map((word, index) => (
          <VocabCard word={word} key={index} />
        ))
      }

      {/* <ScrollView contentContainerStyle={styles.container}>
        {words_pending && (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
            <ActivityIndicator
              size="large"
              color="#0000ff" // Change to your preferred color
            />
            <Text style={{ marginTop: 10 }}>Loading words...</Text>
          </View>
        )}

        {!words_pending && words?.length === 0 && (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>
            There is not any learned words yet.
          </Text>
        )}

        {!words_pending && words?.length > 0 &&
          words?.map((word, index) => (
            <VocabCard word={word} key={index} />
          ))
        }
      </ScrollView> */}


    </SafeAreaView>
  )
}




const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
  },
});


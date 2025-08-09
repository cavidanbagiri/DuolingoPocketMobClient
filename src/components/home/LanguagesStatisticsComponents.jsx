import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

import { useDispatch, useSelector } from 'react-redux';

import WordService from '../../services/WordService';
import VocabCard from '../cards/VocabCard';
import FilterComponent from '../wordscreen/FilterComponent.jsx';


import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';



export default function LanguagesStatisticsComponents() {

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


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selected Languages</Text>

      <ScrollView style={styles.boxContainer}>


      {
        statistics &&
        statistics.map((item, index) => (
          <View key={index} style={styles.langBox}>
            <View style={styles.langLeft}>
              <Text style={styles.langName}>{item.language_code}</Text>
              <Text style={styles.stats}>
                Total: {item.total_words} | Learned: {item.learned_words} | ⭐ {item.starred_words}
              </Text>
            </View>
          </View>
        ))
      }



        {/* {
          statistics &&
          Object.keys(statistics).map((lang, index) => (
            <View key={index} style={styles.langBox}>
              <View style={styles.langLeft}>
                <Text style={styles.langName}>{lang[index]['language_code']} {index} </Text>
                <Text style={styles.stats}>
                  Total: {lang[index]['total_words']} | Learned: {lang.learned_words} | ⭐ {lang.starred_words} 
                </Text>
              </View>
            </View>
          ))
        } */}


        {/* {selectedLanguages.map((lang, index) => (
          <View key={index} style={styles.langBox}>
            <View style={styles.langLeft}>
              <Text style={styles.langName}>{lang.name}</Text>
              <Text style={styles.stats}>
                Total: {lang.totalWords} | Learned: {lang.learnedWords} | ⭐ {lang.starredWords}
              </Text>
            </View>
          </View>
        ))} */}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 10,
  },
  boxContainer: {
    width: '100%',
  },
  langBox: {
    height: 150,
    width: '100%',
    backgroundColor: '#f3f3f3',
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 15,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  langLeft: {
    justifyContent: 'center',
  },
  langName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  stats: {
    fontSize: 13,
    color: '#555',
  },
});

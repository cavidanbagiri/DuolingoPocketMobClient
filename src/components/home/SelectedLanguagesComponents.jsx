import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

// Dummy data for selected languages
const selectedLanguages = [
  {
    name: 'Turkish',
    totalWords: 500,
    learnedWords: 123,
    starredWords: 45,
  },
  {
    name: 'Russian',
    totalWords: 420,
    learnedWords: 89,
    starredWords: 30,
  },
  {
    name: 'English',
    totalWords: 999,
    learnedWords: 320,
    starredWords: 88,
  },
];

export default function SelectedLanguagesBox() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selected Languages</Text>

      <ScrollView style={styles.boxContainer}>
        {selectedLanguages.map((lang, index) => (
          <View key={index} style={styles.langBox}>
            <View style={styles.langLeft}>
              <Text style={styles.langName}>{lang.name}</Text>
              <Text style={styles.stats}>
                Total: {lang.totalWords} | Learned: {lang.learnedWords} | ⭐ {lang.starredWords}
              </Text>
            </View>
          </View>
        ))}
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

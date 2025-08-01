
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';


import { SafeAreaView } from 'react-native-safe-area-context';

export default function WordDetailScreen({ route }) {
  const { word } = route.params;

  return (

    <SafeAreaView style={styles.container}> 
      <View >
        <Text style={styles.en}>{word.en}</Text>
        <Text style={styles.type}>{word.type}</Text>
        <Text style={styles.ru}>{word.ru}</Text>
      </View>
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  en: { fontSize: 30, fontWeight: 'bold' },
  type: { fontSize: 20, marginVertical: 10 },
  ru: { fontSize: 26, color: '#007acc' },
});

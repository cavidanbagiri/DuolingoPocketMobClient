
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';

import { useSelector, useDispatch } from 'react-redux';

import { SafeAreaView } from 'react-native-safe-area-context';

import { clearDetail } from '../store/word_store';

import WordService from '../services/WordService';

export default function CardDetailScreen({ route }) {
  const dispatch = useDispatch();
  const { word } = route.params;

  const detail = useSelector((state) => state.wordSlice.detail);
  const loading = useSelector((state) => state.wordSlice.loading);

  useEffect(() => {
    dispatch(WordService.getDetailWord(word.id));
    return () => {
      dispatch(clearDetail());
    };
  }, [word]);

  if (loading || !detail || !Array.isArray(detail.meanings)) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (


    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>


        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            dispatch(WordService.setStatus({
              word_id: detail?.id,
              action: 'star',
            }))
            
            dispatch(WordService.getDetailWord(detail.id));
          }

          }
        >
          <Text style={styles.buttonText}>
            {detail?.is_starred ? '★ Unstar' : '☆ Star'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            dispatch(WordService.setStatus({
              word_id: detail?.id,
              action: 'learned',
            }))
            dispatch(WordService.getDetailWord(detail.id));
          }}
        >
          <Text style={styles.buttonText}>
            {detail?.is_learned ? '✅ Unlearn' : '✅ Mark as Learned'}
          </Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.word}>{detail?.text}</Text>
          <Text style={styles.translation}>
            {detail?.translations[0]?.translated_text ?? 'No translation'}
          </Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaBadge}>CEFR: {detail?.level}</Text>
            <Text style={styles.metaBadge}>Rank: {detail?.frequency_rank}</Text>
          </View>
          <View style={styles.metaRow}>
            {detail?.is_starred && <Text style={styles.star}>⭐ Starred</Text>}
            {detail?.is_learned && <Text style={styles.learned}>✅ Learned</Text>}
            {!detail?.is_learned && (
              <Text style={styles.strength}>💪 Strength: {detail?.strength}/100</Text>
            )}
          </View>
        </View>

        {/* Meanings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meanings</Text>
          {detail?.meanings?.map((m) => (
            <View key={m.id} style={styles.card}>
              <Text style={styles.pos}>{m.pos}</Text>
              <Text style={styles.example}>💬 {m.example}</Text>
              {m.sentences.length > 0 && (
                <View>
                  <Text style={styles.subTitle}>Sentences:</Text>
                  {m.sentences.map((s) => (
                    <View key={s.id} style={styles.sentenceBox}>
                      <Text>{s.text}</Text>
                      {s.translations.map((t, i) => (
                        <Text key={i} style={styles.translationText}>
                          ↳ {t.language_code}: {t.translated_text}
                        </Text>
                      ))}
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Example Sentences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Example Sentences</Text>
          {detail?.example_sentences?.map((s) => (
            <View key={s.id} style={styles.card}>
              <Text>{s.text}</Text>
              {s.translations.map((t, i) => (
                <Text key={i} style={styles.translationText}>
                  ↳ {t.language_code}: {t.translated_text}
                </Text>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scroll: {
    padding: 20,
    paddingBottom: 100,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  word: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  translation: {
    fontSize: 24,
    color: '#007acc',
    marginVertical: 5,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  metaBadge: {
    fontSize: 14,
    backgroundColor: '#eee',
    marginHorizontal: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  star: {
    color: '#f5a623',
    fontSize: 14,
    marginHorizontal: 5,
  },
  learned: {
    color: 'green',
    fontSize: 14,
    marginHorizontal: 5,
  },
  strength: {
    color: '#888',
    fontSize: 14,
    marginHorizontal: 5,
  },
  section: {
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  pos: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  example: {
    fontStyle: 'italic',
    marginBottom: 8,
  },
  subTitle: {
    fontWeight: '600',
    marginTop: 5,
    marginBottom: 3,
  },
  sentenceBox: {
    marginLeft: 10,
    marginBottom: 6,
  },
  translationText: {
    fontSize: 14,
    color: '#555',
  },
});



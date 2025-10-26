

import { Text, View, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedLanguage } from '../../store/word_store';
import WordService from '../../services/WordService';

const FLAG_IMAGES = {
  English: require('../../../assets/flags/england.png'),
  Spanish: require('../../../assets/flags/spanish.png'),
  Russian: require('../../../assets/flags/russian.png'),
  Turkish: require('../../../assets/flags/turkish.png'),
};

export default function LanguageSelected({ screen }) {
  const dispatch = useDispatch();
  const { selectedLanguage, statistics } = useSelector((state) => state.wordSlice);

  const handleLanguagePress = (langCode) => {
    dispatch(setSelectedLanguage(langCode));
    const filter = screen === 'LearnedScreen' ? 'learned' : 'all';
    dispatch(
      WordService.handleLanguageSelect({
        filter,
        langCode,
      })
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Choose Language</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {statistics?.map((lang, index) => {
          const isSelected = selectedLanguage === lang.language_code;
          const flagSource = FLAG_IMAGES[lang.language_name];
          const progress = lang.total_words > 0 
            ? (lang.learned_words / lang.total_words) 
            : 0;

          return (
            <TouchableOpacity
              key={index}
              onPress={() => handleLanguagePress(lang.language_code)}
              activeOpacity={0.85}
              style={[styles.card, isSelected ? styles.cardSelected : styles.cardDefault]}
            >
              {/* Flag */}
              <View style={styles.flagContainer}>
                {flagSource ? (
                  <Image source={flagSource} style={styles.flag} resizeMode="cover" />
                ) : (
                  <View style={styles.flagPlaceholder} />
                )}
              </View>

              {/* Language Name */}
              <Text style={[styles.languageName, isSelected && styles.languageNameSelected]}>
                {lang.language_name}
              </Text>

              {/* Progress Bar */}
              <View style={styles.progressBarBg}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${Math.round(progress * 100)}%` },
                    isSelected && { backgroundColor: '#3B82F6' }
                  ]}
                />
              </View>

              {/* Stats: Learned / Total */}
              <Text style={[styles.statText, isSelected && styles.statTextSelected]}>
                {lang.learned_words} / {lang.total_words}
              </Text>

              {/* Selection Badge */}
              {isSelected && <View style={styles.selectedBadge} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  header: {
    fontSize: 16,
    fontFamily: 'IBMPlexSans-SemiBold',
    color: '#1F2937',
    marginBottom: 12,
    marginTop: 8,
  },
  scrollContent: {
    gap: 12,
    paddingHorizontal: 4,
  },
  card: {
    width: 120,
    padding: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    position: 'relative',
  },
  cardDefault: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
  },
  cardSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  flagContainer: {
    width: 48,
    height: 36,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    marginBottom: 10,
    backgroundColor: '#F9FAFB',
  },
  flag: {
    width: '100%',
    height: '100%',
  },
  flagPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F3F4F6',
  },
  languageName: {
    fontSize: 14,
    fontFamily: 'IBMPlexSans-SemiBold',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 6,
  },
  languageNameSelected: {
    color: '#1E3A8A',
  },
  progressBarBg: {
    width: '100%',
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    marginBottom: 6,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#9CA3AF',
    borderRadius: 3,
  },
  statText: {
    fontSize: 12,
    fontFamily: 'IBMPlexSans-SemiBold',
    color: '#6B7280',
    textAlign: 'center',
  },
  statTextSelected: {
    color: '#3B82F6',
  },
  selectedBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


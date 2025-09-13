// components/LanguagePickerModal.jsx
import React, { useState } from 'react';
import {
  Modal,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Your language map
export const TRANSLATE_LANGUAGES_LIST = {
  af: 'Afrikaans',
  am: 'Amharic',
  ar: 'Arabic',
  az: 'Azerbaijani',
  ba: 'Bashkir',
  be: 'Belarusian',
  bg: 'Bulgarian',
  bn: 'Bengali',
  bs: 'Bosnian',
  ca: 'Catalan',
  cs: 'Czech',
  cy: 'Welsh',
  da: 'Danish',
  de: 'German',
  el: 'Greek',
  en: 'English',
  es: 'Spanish',
  et: 'Estonian',
  eu: 'Basque',
  fa: 'Persian',
  fi: 'Finnish',
  fr: 'French',
  ga: 'Irish',
  gl: 'Galician',
  gu: 'Gujarati',
  he: 'Hebrew',
  hi: 'Hindi',
  hr: 'Croatian',
  ht: 'Haitian',
  hu: 'Hungarian',
  hy: 'Armenian',
  id: 'Indonesian',
  is: 'Icelandic',
  it: 'Italian',
  ja: 'Japanese',
  jv: 'Javanese',
  ka: 'Georgian',
  kk: 'Kazakh',
  km: 'Khmer',
  kn: 'Kannada',
  ko: 'Korean',
  ku: 'Kurdish',
  ky: 'Kyrgyz',
  la: 'Latin',
  lb: 'Luxembourgish',
  lo: 'Lao',
  lt: 'Lithuanian',
  lv: 'Latvian',
  mg: 'Malagasy',
  mk: 'Macedonian',
  ml: 'Malayalam',
  mn: 'Mongolian',
  mr: 'Marathi',
  ms: 'Malay',
  my: 'Myanmar',
  ne: 'Nepali',
  nl: 'Dutch',
  no: 'Norwegian',
  om: 'Oromo',
  or: 'Oriya',
  pa: 'Punjabi',
  pl: 'Polish',
  pt: 'Portuguese',
  ro: 'Romanian',
  ru: 'Russian',
  sa: 'Sanskrit',
  sd: 'Sindhi',
  si: 'Sinhala',
  sk: 'Slovak',
  sl: 'Slovenian',
  so: 'Somali',
  sq: 'Albanian',
  sr: 'Serbian',
  su: 'Sundanese',
  sv: 'Swedish',
  sw: 'Swahili',
  ta: 'Tamil',
  te: 'Telugu',
  th: 'Thai',
  tk: 'Turkmen',
  tl: 'Tagalog',
  tr: 'Turkish',
  tt: 'Tatar',
  ug: 'Uyghur',
  uk: 'Ukrainian',
  ur: 'Urdu',
  uz: 'Uzbek',
  vi: 'Vietnamese',
  xh: 'Xhosa',
  yi: 'Yiddish',
  zh: 'Chinese',
  zu: 'Zulu',
};

// Convert to array for FlatList
const ALL_LANGUAGES = Object.keys(TRANSLATE_LANGUAGES_LIST).map((code) => ({
  code,
  name: TRANSLATE_LANGUAGES_LIST[code],
}));

// Optional: Add flags if you want (emojis)
const LANG_FLAGS = {
  en: '🇬🇧', es: '🇪🇸', ru: '🇷🇺', fr: '🇫🇷', de: '🇩🇪',
  it: '🇮🇹', pt: '🇵🇹', zh: '🇨🇳', ja: '🇯🇵', ko: '🇰🇷',
  ar: '🇦🇪', hi: '🇮🇳', tr: '🇹🇷', /* add more */
};

export default function LanguagePickerModal({
  visible,
  onClose,
  onSelect,
  selectedLang,
  excludeLang,
  title = 'Select Language',
}) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter languages
  const filteredLanguages = ALL_LANGUAGES.filter((lang) => {
    if (lang.code === excludeLang) return false;
    const matchesSearch = lang.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Sort: selected first, then alphabetical
  const sortedLanguages = [...filteredLanguages].sort((a, b) => {
    if (a.code === selectedLang) return -1;
    if (b.code === selectedLang) return 1;
    return a.name.localeCompare(b.name);
  });

  const handleSelect = (code) => {
    onSelect(code);
    onClose();
    setSearchQuery('');
  };

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <SafeAreaView style={styles.overlay}>
        {/* Backdrop */}
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />

        {/* Modal Card */}
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#6366F1" />
            </TouchableOpacity>
          </View>

          {/* Search Input */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={18} color="#9CA3AF" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search languages..."
              placeholderTextColor="#9CA3AF"
              style={styles.searchInput}
              autoFocus
              returnKeyType="search"
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color="#D1D5DB" />
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Language List */}
          <FlatList
            data={sortedLanguages}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => {
              const flag = LANG_FLAGS[item.code] || '';
              return (
                <TouchableOpacity
                  style={[
                    styles.languageItem,
                    item.code === selectedLang && styles.selectedItem,
                  ]}
                  onPress={() => handleSelect(item.code)}
                  activeOpacity={0.7}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    {flag ? <Text>{flag}</Text> : null}
                    <Text
                      style={[
                        styles.languageText,
                        item.code === selectedLang && styles.selectedText,
                      ]}
                    >
                      {item.name}
                    </Text>
                  </View>

                  {item.code === selectedLang && (
                    <Ionicons name="checkmark" size={20} color="#6366F1" />
                  )}
                </TouchableOpacity>
              );
            }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000080',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modal: {
    marginHorizontal: 16,
    marginTop: 100,
    marginBottom: 80,
    maxHeight: '70%',
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'IBMPlexSans-SemiBold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    fontFamily: 'IBMPlexSans-Regular',
    marginLeft: 4,
  },
  listContent: {
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    marginVertical: 2,
    backgroundColor: '#FFFFFF',
  },
  selectedItem: {
    backgroundColor: '#EEF2FF',
    borderColor: '#C7D2FE',
    borderWidth: 1,
  },
  languageText: {
    fontSize: 16,
    color: '#111827',
    fontFamily: 'IBMPlexSans-Regular',
  },
  selectedText: {
    fontWeight: '600',
    color: '#6366F1',
  },
});
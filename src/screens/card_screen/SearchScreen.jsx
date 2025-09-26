// SearchScreen.jsx
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import WordService from '../../services/WordService';
import LANGUAGES from '../../constants/Languages';

import * as SecureStore from 'expo-secure-store';
import RenderWordComponent from '../../components/search/RenderWordComponent';


export default function SearchScreen({ navigation }) {

    const insets = useSafeAreaInsets(); // ← Get safe area values

    const dispatch = useDispatch();

    const { searchResults, isLoading, error } = useSelector((state) => state.wordSlice);
    const { selectedLanguage } = useSelector((state) => state.wordSlice);
    
    const [nativeLang, setNativeLang] = useState(null);
    const [targetLanguage, setTargetLanguage] = useState(selectedLanguage);
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');


    // Debounce search to avoid too many API calls
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, 300); // 300ms delay

        return () => clearTimeout(timer);
    }, [query]);

    const handleSearch = useCallback(() => {

        
         const controller = new AbortController();

        if (debouncedQuery.trim().length > 0) {
            const data = {
                native_language: LANGUAGES.find(lang => lang.name === nativeLang)?.code,
                target_language: targetLanguage,
                query: debouncedQuery,
            };
            dispatch(WordService.getSearchResults(data, { signal: controller.signal }));
        }
        return () => controller.abort();
    }, [debouncedQuery, nativeLang, targetLanguage, dispatch]);

    // Use in useEffect
    useEffect(() => {
        handleSearch();
    }, [handleSearch]);

    useEffect(() => {
        const getNativeLang = async () => {
          try {
            const native = await SecureStore.getItemAsync('native');
            setNativeLang(native);
          } catch (error) {
            console.error('Failed to load native language', error);
          } 
        };
    
        getNativeLang();
      }, []);

      useEffect(() => {
        if (selectedLanguage) {
          setTargetLanguage(selectedLanguage);
        }
      }, [selectedLanguage]);
    

    const renderWordItem = useCallback(({ item }) => (
        <RenderWordComponent item={item} />
    ), []);

    // Add keyExtractor optimization
    const keyExtractor = useCallback((item) => item.id.toString(), []);


    return (

         <View style={styles.container}>

            {/* 🔝 Header with Search + Cancel */}
            <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
                
                {/* Search Input */}
                <View className='bg-blue-400 '
                style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#6b7280" />
                    
                    <TextInput
                        value={query}
                        onChangeText={setQuery}
                        placeholder="Search words or translations..."
                        placeholderTextColor="#9ca3af"
                        style={styles.searchInput}
                        autoFocus
                        returnKeyType="search"
                        clearButtonMode="while-editing" // iOS only
                    />

                    {query.length > 0 && (
                        <TouchableOpacity
                            onPress={() => setQuery('')}
                            style={styles.clearButton}
                            accessibilityLabel="Clear search"
                            >
                            <Ionicons name="close-circle" size={20} color="#9ca3af" />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Cancel Button */}
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.cancelButton}
                    accessibilityLabel="Cancel search"
                    >
                    <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
            </View>

            {/* 🌐 Language Filter Section */}
            <View style={styles.filterContainer}>

                {/* Label */}
                <Text style={styles.filterLabel}>Filter by language:</Text>

                {/* Horizontal Scrollable Pills */}
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.pillScrollContent}
                    keyboardDismissMode="on-drag"
                >
                    
                    {/* 'All Languages' Pill */}
                    <TouchableOpacity
                    style={[
                        styles.pill,
                        targetLanguage === 'all' && styles.pillActive
                    ]}
                    onPress={() => {
                        setTargetLanguage('all')
                        const data = {
                            native_language: LANGUAGES.find(lang => lang.name === nativeLang)?.code,
                            target_language: 'all',
                            query: debouncedQuery,
                        }
                        dispatch(WordService.getSearchResults(data));
                    }}
                    activeOpacity={0.7}
                    accessibilityLabel="Show all languages"
                    accessibilityState={{ selected: targetLanguage === 'all' }}
                    >
                    <Text style={[
                        styles.pillText,
                        targetLanguage === 'all' && styles.pillTextActive
                    ]}>
                        All Languages
                    </Text>
                    </TouchableOpacity>

                    {/* Individual Language Pills */}
                    {LANGUAGES.filter(lang => lang.name !== nativeLang).map((language) => (
                    <TouchableOpacity
                        key={language.code}
                        style={[
                        styles.pill,
                        targetLanguage === language.code && styles.pillActive
                        ]}
                        onPress={() => {
                            setTargetLanguage(language.code);
                            const data = {
                                native_language: LANGUAGES.find(lang => lang.name === nativeLang)?.code,
                                target_language: language.code,
                                query: debouncedQuery,
                            }
                            dispatch(WordService.getSearchResults(data));
                        }}
                        activeOpacity={0.7}
                        accessibilityLabel={`Show words in ${language.name}`}
                        accessibilityState={{ selected: targetLanguage === language.code }}
                    >
                        <Text style={[
                        styles.pillText,
                        targetLanguage === language.code && styles.pillTextActive
                        ]}>
                        {language.flag} {language.name}
                        </Text>
                    </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* 🔍 Results */}
            {isLoading ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color="#6366F1" />
                    <Text style={styles.loadingText}>Searching...</Text>
                </View>
            ) : error ? (
                <View style={styles.centered}>
                    <Ionicons name="alert-circle" size={28} color="#ef4444" />
                    <Text style={styles.errorText}>{error.message}</Text>
                </View>
            ) : (
                <FlatList
                data={searchResults?.results || []}
                keyExtractor={keyExtractor}
                renderItem={renderWordItem}
                ListEmptyComponent={
                    <View style={styles.centered}>
                    <Ionicons name="search-outline" size={32} color="#d1d5db" />
                    <Text style={styles.emptyText}>
                        {debouncedQuery 
                        ? 'No matching words found' 
                        : 'Start typing to discover vocabulary'
                        }
                    </Text>
                    {!debouncedQuery && (
                        <Text style={styles.tipText}>
                        Try: “hello”, “привет”, or “learned”
                        </Text>
                    )}
                    </View>
                }
                showsVerticalScrollIndicator={false}
                keyboardDismissMode="on-drag"
                contentContainerStyle={styles.listContent}
                />
            )}
    </View>
    );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 8,
  },

searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',        // This centers children vertically
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 40,                  // ≈ 20px text + 10px top/bottom space
    gap: 8,
  },

searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    fontFamily: 'IBMPlexSans-Regular',

    // 🔽 Critical for vertical centering
    textAlignVertical: 'center',   // Forces text & placeholder to center
    includeFontPadding: false,     // Removes extra top/bottom space (Android)
    
    // 🔽 Prevent any internal spacing
    paddingVertical: 0,            // Remove built-in padding
    paddingHorizontal: 0,          // Optional: let parent handle side padding
    margin: 0,                     // Reset margin

    // 🔽 Line height = font size → tight fit
    lineHeight: 20,

    // 🔽 Prevent wrapping or growth
    numberOfLines: 1,
    maxHeight: 20,
    overflow: 'hidden',
    // backgroundColor: 'rgba(255,0,0,0.1)', // Light red tint
  },
  clearButton: {
    padding: 6, // Make sure icon has tap space
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  cancelText: {
    fontSize: 16,
    color: '#6366F1',
    fontFamily: 'IBMPlexSans-SemiBold',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
  },
  wordItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    borderColor: '#F3F4F6',
    borderWidth: 1,
  },
  wordText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  translation: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginLeft: 8,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#4B5563',
    fontFamily: 'IBMPlexSans-Medium',
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    fontFamily: 'IBMPlexSans-Regular',
  },
  tipText: {
    marginTop: 8,
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    fontStyle: 'italic',
    fontFamily: 'IBMPlexSans-Italic',
  },
  filterContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 12,
    fontFamily: 'IBMPlexSans-Medium',
    marginLeft: 4,
  },
  pillScrollContent: {
    paddingHorizontal: 4,
    gap: 12, // Consistent spacing between pills
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minWidth: 100,
    justifyContent: 'center',
  },
  pillActive: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  pillText: {
    fontSize: 14,
    color: '#4B5563',
    fontFamily: 'IBMPlexSans-Regular',
  },
  pillTextActive: {
    color: '#FFFFFF',
    fontFamily: 'IBMPlexSans-SemiBold',
  },
});
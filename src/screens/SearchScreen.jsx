// SearchScreen.jsx
import React, { useState, useMemo, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import WordService from '../services/WordService';
import LANGUAGES from '../constants/Languages';

import * as SecureStore from 'expo-secure-store';
import RenderWordComponent from '../components/searchscreen/RenderWordComponent';


export default function SearchScreen({ navigation }) {

    const insets = useSafeAreaInsets(); // ← Get safe area values

    const dispatch = useDispatch();

    const { searchResults, isLoading, error } = useSelector((state) => state.wordSlice);
    const { selectedLanguage } = useSelector((state) => state.wordSlice);
    
    const [nativeLang, setNativeLang] = useState(null);
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');


    // Debounce search to avoid too many API calls
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, 300); // 300ms delay

        return () => clearTimeout(timer);
    }, [query]);

    // Trigger search when debounced query changes
    useEffect(() => {
        if (debouncedQuery.trim().length > 0) {
            const data = {
                native_language: LANGUAGES.find(lang => lang.name === nativeLang)?.code,
                target_language: selectedLanguage,
                query: debouncedQuery,
            }
            dispatch(WordService.getSearchResults(data));
        }
    }, [debouncedQuery, dispatch]);

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
    

    const renderWordItem = ({ item }) => (
        <RenderWordComponent item={item} />
    );


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
                keyExtractor={(item) => item.id.toString()}
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
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 40, // 🔒 Fixed height
    gap: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    fontFamily: 'IBMPlexSans-Regular',
    paddingVertical: 0,
    marginVertical: 0,
    lineHeight: 20,
    height: '100%',
    textAlignVertical: 'center',
    includeFontPadding: false, // Android clean-up
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
});
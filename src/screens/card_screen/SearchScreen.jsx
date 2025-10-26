



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
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import WordService from '../../services/WordService';
import VoiceButtonComponent from '../../components/layouts/VoiceButtonComponent';

import * as SecureStore from 'expo-secure-store';

const AVAILABLE_LANGUAGES = [
    { name: 'Spanish', image: require('../../../assets/flags/spanish.png'), code: 'es' },
    { name: 'Russian', image: require('../../../assets/flags/russian.png'), code: 'ru' },
    { name: 'English', image: require('../../../assets/flags/england.png'), code: 'en' },
    { name: 'Turkish', image: require('../../../assets/flags/turkish.png'), code: 'tr' },
]

export default function SearchScreen({ navigation }) {
    const insets = useSafeAreaInsets();
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
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    const handleSearch = useCallback(() => {
        const controller = new AbortController();

        if (debouncedQuery.trim().length > 0) {
            const data = {
                native_language: AVAILABLE_LANGUAGES.find(lang => lang.name === nativeLang)?.code,
                target_language: targetLanguage,
                query: debouncedQuery,
            };
            dispatch(WordService.getSearchResults(data, { signal: controller.signal }));
        }
        return () => controller.abort();
    }, [debouncedQuery, nativeLang, targetLanguage, dispatch]);

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

    const getFlagImage = (languageCode) => {
        const language = AVAILABLE_LANGUAGES.find(lang => lang.code === languageCode);
        return language ? language.image : null;
    };

    const renderWordItem = useCallback(({ item }) => (
      <TouchableOpacity
      onPress={() => navigation.navigate('CardDetail', { word: item })}
      >
        <View style={styles.wordCard}>
            {/* Header with Flag and Status */}
            <View style={styles.cardHeader}>
                <View style={styles.flagContainer}>
                    <Image 
                        source={getFlagImage(item.language_code)} 
                        style={styles.flag}
                        resizeMode="cover"
                    />
                    <Text style={styles.languageCode}>{item.language_code.toUpperCase()}</Text>
                </View>
                
                <View style={styles.statusContainer}>
                    {item.is_learned && (
                        <View style={[styles.statusBadge, styles.learnedBadge]}>
                            <Ionicons name="checkmark-circle" size={14} color="#10b981" />
                            <Text style={styles.statusText}>Learned</Text>
                        </View>
                    )}
                    {item.is_starred && (
                        <View style={[styles.statusBadge, styles.starredBadge]}>
                            <Ionicons name="star" size={14} color="#f59e0b" />
                            <Text style={styles.statusText}>Starred</Text>
                        </View>
                    )}
                </View>
            </View>

            {/* Main Content */}
            <View style={styles.cardContent}>
                <View style={styles.wordSection}>
                    <Text style={styles.wordText}>{item.text}</Text>
                    <Text style={styles.translationText}>{item.translation_to_native}</Text>
                </View>
                
                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                    {/* <TouchableOpacity style={styles.iconButton}>
                        <Ionicons name="volume-medium-outline" size={20} color="#6366f1" />
                    </TouchableOpacity> */}
                    <VoiceButtonComponent
                                        text={item.text}
                                        language={selectedLanguage}
                                        size={20}
                                      />
                    <TouchableOpacity style={styles.iconButton}>
                        <Ionicons name={item.is_starred ? "star" : "star-outline"} size={20} color="#f59e0b" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
        </TouchableOpacity>
    ), []);

    const keyExtractor = useCallback((item) => item.id.toString(), []);

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header with Search */}
            <View style={styles.header}>
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#6b7280" />
                    <TextInput
                        value={query}
                        onChangeText={setQuery}
                        placeholder="Search words or translations..."
                        placeholderTextColor="#9ca3af"
                        style={styles.searchInput}
                        autoFocus
                        returnKeyType="search"
                    />
                    {query.length > 0 && (
                        <TouchableOpacity
                            onPress={() => setQuery('')}
                            style={styles.clearButton}
                        >
                            <Ionicons name="close-circle" size={20} color="#9ca3af" />
                        </TouchableOpacity>
                    )}
                </View>

                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.cancelButton}
                >
                    <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
            </View>

            {/* Language Filter Section */}
            <View style={styles.filterContainer}>
                <Text style={styles.filterLabel}>Filter by language</Text>
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.pillScrollContent}
                >
                    <TouchableOpacity
                        style={[
                            styles.pill,
                            targetLanguage === 'all' && styles.pillActive
                        ]}
                        onPress={() => {
                            setTargetLanguage('all')
                            const data = {
                                native_language: AVAILABLE_LANGUAGES.find(lang => lang.name === nativeLang)?.code,
                                target_language: 'all',
                                query: debouncedQuery,
                            }
                            dispatch(WordService.getSearchResults(data));
                        }}
                    >
                        <Text style={[
                            styles.pillText,
                            targetLanguage === 'all' && styles.pillTextActive
                        ]}>
                            All Languages
                        </Text>
                    </TouchableOpacity>

                    {AVAILABLE_LANGUAGES.filter(lang => lang.name !== nativeLang).map((language) => (
                        <TouchableOpacity
                            key={language.code}
                            style={[
                                styles.pill,
                                targetLanguage === language.code && styles.pillActive
                            ]}
                            onPress={() => {
                                setTargetLanguage(language.code);
                                const data = {
                                    native_language: AVAILABLE_LANGUAGES.find(lang => lang.name === nativeLang)?.code,
                                    target_language: language.code,
                                    query: debouncedQuery,
                                }
                                dispatch(WordService.getSearchResults(data));
                            }}
                        >
                            <Image source={language.image} style={styles.pillFlag} />
                            <Text style={[
                                styles.pillText,
                                targetLanguage === language.code && styles.pillTextActive
                            ]}>
                                {language.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Results Section */}
            {isLoading ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color="#6366F1" />
                    <Text style={styles.loadingText}>Searching vocabulary...</Text>
                </View>
            ) : error ? (
                <View style={styles.centered}>
                    <Ionicons name="alert-circle" size={48} color="#ef4444" />
                    <Text style={styles.errorText}>Something went wrong</Text>
                    <Text style={styles.errorSubtext}>{error.message}</Text>
                </View>
            ) : (
                <FlatList
                    data={searchResults?.results || []}
                    keyExtractor={keyExtractor}
                    renderItem={renderWordItem}
                    ListEmptyComponent={
                        <View style={styles.centered}>
                            <Ionicons name="search-outline" size={64} color="#d1d5db" />
                            <Text style={styles.emptyText}>
                                {debouncedQuery 
                                    ? 'No matching words found' 
                                    : 'Search for vocabulary'
                                }
                            </Text>
                            {!debouncedQuery && (
                                <Text style={styles.tipText}>
                                    Try searching for: "hello", "gracias", or "learned"
                                </Text>
                            )}
                        </View>
                    }
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f1f5f9',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#1e293b',
        marginLeft: 8,
        paddingVertical: 4,
    },
    clearButton: {
        padding: 4,
    },
    cancelButton: {
        paddingVertical: 6,
        paddingHorizontal: 8,
    },
    cancelText: {
        fontSize: 16,
        color: '#6366f1',
        fontWeight: '500',
    },
    filterContainer: {
        backgroundColor: '#ffffff',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    filterLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#475569',
        marginBottom: 12,
    },
    pillScrollContent: {
        gap: 8,
    },
    pill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        marginRight: 8,
    },
    pillActive: {
        backgroundColor: '#6366f1',
        borderColor: '#6366f1',
    },
    pillText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#64748b',
    },
    pillTextActive: {
        color: '#ffffff',
    },
    pillFlag: {
        width: 16,
        height: 12,
        borderRadius: 2,
        marginRight: 6,
    },
    listContent: {
        padding: 16,
    },
    wordCard: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    flagContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    flag: {
        width: 24,
        height: 18,
        borderRadius: 4,
        marginRight: 8,
    },
    languageCode: {
        fontSize: 12,
        fontWeight: '600',
        color: '#64748b',
        textTransform: 'uppercase',
    },
    statusContainer: {
        flexDirection: 'row',
        gap: 6,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    learnedBadge: {
        backgroundColor: '#ecfdf5',
        borderWidth: 1,
        borderColor: '#d1fae5',
    },
    starredBadge: {
        backgroundColor: '#fffbeb',
        borderWidth: 1,
        borderColor: '#fef3c7',
    },
    statusText: {
        fontSize: 10,
        fontWeight: '500',
    },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    wordSection: {
        flex: 1,
    },
    wordText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 4,
    },
    translationText: {
        fontSize: 14,
        color: '#64748b',
        fontStyle: 'italic',
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    iconButton: {
        padding: 8,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#64748b',
    },
    errorText: {
        marginTop: 16,
        fontSize: 18,
        fontWeight: '600',
        color: '#1e293b',
    },
    errorSubtext: {
        marginTop: 8,
        fontSize: 14,
        color: '#64748b',
        textAlign: 'center',
    },
    emptyText: {
        marginTop: 16,
        fontSize: 18,
        fontWeight: '600',
        color: '#475569',
        textAlign: 'center',
    },
    tipText: {
        marginTop: 8,
        fontSize: 14,
        color: '#94a3b8',
        textAlign: 'center',
    },
});


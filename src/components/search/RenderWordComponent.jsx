import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import VoiceButtonComponent from '../layouts/VoiceButtonComponent';

import WordService from '../../services/WordService';


const RenderWordComponent = ({ item, selectedLanguage, getFlagImage }) => {

    const navigation = useNavigation();

    const dispatch = useDispatch();

    const [isStarred, setIsStarred] = useState(false);
    const [isLearned, setIsLearned] = useState(false);

    const handleToggle = useCallback(async (actionType, wordId) => {
        try {
            const res = await dispatch(WordService.setStatus({
                word_id: wordId,
                action: actionType,
            })).unwrap();

            // You might want to update the local state or refetch search results
            // Since the item data comes from Redux, it should update automatically
            //console.log('Status updated:', res);
            setIsStarred(res.is_starred);
            setIsLearned(res.is_learned);

        } catch (error) {
            console.error('Failed to update status:', error);
        }
    }, [dispatch]);

     useEffect(() => {
        setIsStarred(item.is_starred);
        setIsLearned(item.is_learned);
      }, [item.id, item.is_starred, item.is_learned]);
    

    return (
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
                        {isLearned && (
                            <View style={[styles.statusBadge, styles.learnedBadge]}>
                                <Ionicons name="checkmark-circle" size={14} color="#10b981" />
                                <Text style={styles.statusText}>Learned</Text>
                            </View>
                        )}
                        {isStarred && (
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
                        <VoiceButtonComponent
                            text={item.text}
                            language={selectedLanguage}
                            size={20}
                        />
                        <TouchableOpacity
                            onPress={(e) => {
                                e.stopPropagation(); // Prevent card navigation
                                handleToggle('star', item.id);
                            }}
                            style={styles.iconButton}
                            accessibilityLabel={item.is_starred ? "Remove from favorites" : "Add to favorites"}
                        >
                            
                            <Ionicons
                                name={isStarred ? 'star' : 'star-outline'}
                                size={20}
                                color={isStarred ? '#facc15' : '#4B5563'}
                            />

                        </TouchableOpacity>
                        {/* Learned Toggle */}
                                  <TouchableOpacity
                                    onPress={(e) => {
                                      e.stopPropagation(); // Prevent card navigation
                                      handleToggle('learned', item.id);
                                    }}
                                    className="p-2"
                                    accessibilityLabel={isLearned ? "Mark as not learned" : "Mark as learned"}
                                  >
                                    <Ionicons
                                      name={isLearned ? 'checkmark-circle' : 'checkmark-circle-outline'}
                                      size={20}
                                      color={isLearned ? '#4ade80' : '#4B5563'}
                                    />
                                  </TouchableOpacity>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

// Copy the exact styles from your SearchScreen
const styles = StyleSheet.create({
    wordCard: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 6,
        marginVertical: 6,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#f3f4f6',
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
        gap: 8,
    },
    flag: {
        width: 24,
        height: 18,
        borderRadius: 3,
    },
    languageCode: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6b7280',
        textTransform: 'uppercase',
    },
    statusContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    learnedBadge: {
        backgroundColor: '#ecfdf5',
    },
    starredBadge: {
        backgroundColor: '#fffbeb',
    },
    statusText: {
        fontSize: 12,
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
        color: '#1f2937',
        marginBottom: 4,
    },
    translationText: {
        fontSize: 14,
        color: '#6b7280',
    },
    actionButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconButton: {
        padding: 4,
    },
});

export default RenderWordComponent;
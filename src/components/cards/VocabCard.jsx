

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { useDispatch } from 'react-redux';

import WordService from '../../services/WordService';

export default function VocabCard({ word }) {

    const dispatch = useDispatch();

    const navigation = useNavigation();

    const [isStarred, setIsStarred] = useState(false);
    const [isLearned, setIsLearned] = useState(false);

    const handleToggle = async (actionType) => {
        try {
            const res = await dispatch(WordService.setStatus({
                word_id: word.id,
                action: actionType,
            })).unwrap();

            // Update local state from backend
            setIsStarred(res.is_starred);
            setIsLearned(res.is_learned);

        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };


    return (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('CardDetail', { word })}
            activeOpacity={0.9}
        >
            {/* Word Text */}
            <View style={styles.header}>
                <Text style={styles.word}>{word.text}</Text>
                <Text style={styles.level}>Level {word.level ?? '-'}</Text>
            </View>

            {/* POS and Translation */}
            <View style={styles.body}>
                <Text style={styles.pos}>{word.pos ?? '-'}</Text>
                <Text style={styles.translation}>{word.translation_to_native ?? '-'}</Text>
            </View>

            {/* Bottom row: freq + icons */}
            <View style={styles.footer}>
                <Text style={styles.frequency}># {word.frequency_rank ?? '-'}</Text>
                <View style={styles.iconGroup}>
                    <TouchableOpacity onPress={() => {
                        handleToggle('star');
                        // dispatch(WordService.setStatus({ word_id: word.id, 'action': 'star' }));
                        // setIsStarred(!isStarred);
                    }}>
                        <Ionicons
                            name={isStarred ? 'star' : 'star-outline'}
                            size={22}
                            color={isStarred ? '#facc15' : '#9ca3af'}
                            style={styles.icon}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        handleToggle('learned');
                        // dispatch(WordService.setStatus({ word_id: word.id, 'action': 'learned' }));
                        // setIsLearned(!isLearned);
                    }}>
                        <Ionicons
                            name={isLearned ? 'checkmark-circle' : 'checkmark-circle-outline'}
                            size={22}
                            color={isLearned ? '#4ade80' : '#9ca3af'}
                            style={styles.icon}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
}


const styles = StyleSheet.create({
    card: {
        width: '90%',
        backgroundColor: '#f9fafb',
        borderRadius: 16,
        padding: 16,
        marginVertical: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
    },
    word: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1f2937',
    },
    level: {
        fontSize: 14,
        color: '#6b7280',
        fontWeight: '500',
    },
    body: {
        marginVertical: 10,
    },
    pos: {
        fontSize: 16,
        color: '#4b5563',
        fontWeight: '500',
        marginBottom: 4,
    },
    translation: {
        fontSize: 18,
        color: '#2563eb',
        fontStyle: 'italic',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    frequency: {
        fontSize: 12,
        color: '#9ca3af',
    },
    iconGroup: {
        flexDirection: 'row',
    },
    icon: {
        marginLeft: 12,
    },
});




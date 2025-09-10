

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';

const RenderWordComponent = ({ item }) => {
  return (
     <TouchableOpacity
            style={styles.wordItem}
            onPress={() => console.log('Open word:', item.text)}
            activeOpacity={0.7}
        >
            {/* Word */}
            <View style={{ flex: 1 }}>
            <Text style={styles.wordText} numberOfLines={1}>
                {item.text}
            </Text>
            <Text style={styles.translation} numberOfLines={1}>
                {item.translation_to_native || 'No translation'}
            </Text>
            </View>

            {/* Status Icons */}
            <View style={styles.statusIcons}>
            {item.is_starred && (
                <Ionicons name="star" size={16} color="#facc15" />
            )}
            {item.is_learned && (
                <Ionicons name="checkmark-circle" size={20} color="#4ade80" />
            )}
            </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        backgroundColor: '#f9fafb',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#111',
        fontFamily: 'IBMPlexSans-Regular',
        marginLeft: 10,
        paddingVertical: 0,
    },
    wordItem: {
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    wordText: {
        fontSize: 17,
        fontWeight: '600',
        color: '#111',
    },
    translation: {
        fontSize: 14,
        color: '#6b7280',
        marginTop: 4,
    },
    empty: {
        textAlign: 'center',
        color: '#9ca3af',
        marginTop: 40,
        fontSize: 16,
        fontFamily: 'IBMPlexSans-Regular',
    },
})

export default RenderWordComponent
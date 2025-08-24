// components/LanguageSelector.jsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const LanguageSelector = ({ languages, selectedLanguage, onSelectLanguage }) => {
    if (!languages || languages.length <= 1) return null;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Select Language:</Text>
            <View style={styles.buttonsContainer}>
                {languages.map((langCode) => (
                    <TouchableOpacity
                        key={langCode}
                        style={[
                            styles.button,
                            selectedLanguage === langCode && styles.selectedButton
                        ]}
                        onPress={() => onSelectLanguage(langCode)}
                    >
                        <Text style={[
                            styles.buttonText,
                            selectedLanguage === langCode && styles.selectedButtonText
                        ]}>
                            {getLanguageName(langCode)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const getLanguageName = (code) => {
    const langMap = {
        'ru': 'Russian',
        'en': 'English',
        'tr': 'Turkish',
        'es': 'Spanish'
    };
    return langMap[code] || code;
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#f5f5f5',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: 10,
    },
    button: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#007AFF',
        borderRadius: 20,
        minWidth: 100,
    },
    selectedButton: {
        backgroundColor: '#007AFF',
    },
    buttonText: {
        color: '#007AFF',
        textAlign: 'center',
        fontWeight: '500',
    },
    selectedButtonText: {
        color: '#ffffff',
    },
});

export default LanguageSelector;
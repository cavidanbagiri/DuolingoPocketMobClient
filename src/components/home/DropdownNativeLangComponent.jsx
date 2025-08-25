
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import AuthService from '../../services/AuthService';

import { useDispatch } from 'react-redux';

export default function DropdownNativeLangComponent({ selectedLanguage, setSelectedLanguage }) {

    const dispatch = useDispatch()

    return (


        <View style={styles.pickerContainer}>
            <Picker
                selectedValue={selectedLanguage}
                onValueChange={(itemValue) => {
                    // dispatch(AuthService.setNativeLanguage({ native: itemValue }));
                    setSelectedLanguage(itemValue)
                }}
                style={styles.picker}
                dropdownIconColor="#000000"
                mode="dropdown" // Add this for better Android appearance
            >
                <Picker.Item label="Select Native" value="" />
                <Picker.Item label="English" value="English" />
                <Picker.Item label="Russian" value="Russian" />
                <Picker.Item label="Spanish" value="Spanish" />
            </Picker>
        </View>
    );
}

const styles = StyleSheet.create({
    pickerContainer: {
        marginTop: 10,
        width: '100%',
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#ccc',
        overflow: 'hidden', // Important for Android
        backgroundColor: 'white', // Ensure background is visible
    },
    picker: {
        // width: '50%',
        height: 60,
    },
});

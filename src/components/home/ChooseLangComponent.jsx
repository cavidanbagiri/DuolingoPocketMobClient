
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

import AuthService from '../../services/AuthService';
import { useDispatch } from 'react-redux';

export default function ChooseLangComponent({ selectedLanguage, setSelectedLanguage }) {


  const dispatch = useDispatch();

  const languages = [
    { name: 'Turkish', image: require('../../../assets/flags/turkish.png') },
    { name: 'Russian', image: require('../../../assets/flags/russian.png') },
    { name: 'English', image: require('../../../assets/flags/england.png') },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose language for learning</Text>

      <View style={styles.flagsRow}>
        {languages.map((lang) => (
          <TouchableOpacity
            key={lang.name}
            onPress={() => {
              setSelectedLanguage(lang.name);
              dispatch(AuthService.setTargetLanguage({ target_language_code: lang.name }));
            }}
            style={[
              styles.flagWrapper,
              selectedLanguage === lang.name && styles.selectedFlag,
            ]}
          >
            <Image source={lang.image} style={styles.flagImage} />
            <Text style={styles.flagLabel}>{lang.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 10,
  },
  flagsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  flagWrapper: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedFlag: {
    borderColor: '#FF4F2F',
    backgroundColor: '#FFF0EC',
  },
  flagImage: {
    width: 80,
    height: 60,
    resizeMode: 'contain',
  },
  flagLabel: {
    marginTop: 5,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
});



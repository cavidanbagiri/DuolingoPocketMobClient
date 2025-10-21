import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const LanguageModalComponent = ({ selectedLanguage, setSelectedLanguage }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const languages = [
    { code: 'English', label: 'English', flag: '🇺🇸' },
    { code: 'Russian', label: 'Russian', flag: '🇷🇺' },
    { code: 'Spanish', label: 'Spanish', flag: '🇪🇸' },
    { code: 'Turkish', label: 'Turkish', flag: '🇹🇷' },
  ];

  const selectedLang = languages.find(lang => lang.code === selectedLanguage);

  return (
    <View style={styles.container}>
      <Text
       style={styles.label}>Native Language</Text>
      <TouchableOpacity
        style={styles.trigger}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.triggerContent}>
          {selectedLang ? (
            <>
              <Text style={styles.flag}>{selectedLang.flag}</Text>
              <Text style={styles.triggerText}>{selectedLang.label}</Text>
            </>
          ) : (
            <Text style={styles.placeholder}>Select your language</Text>
          )}
          <Icon name="arrow-drop-down" size={24} color="#666" />
        </View>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Language</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={languages}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    selectedLanguage === item.code && styles.modalItemSelected
                  ]}
                  onPress={() => {
                    setSelectedLanguage(item.code);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.modalFlag}>{item.flag}</Text>
                  <Text style={[
                    styles.modalItemText,
                    selectedLanguage === item.code && styles.modalItemTextSelected
                  ]}>
                    {item.label}
                  </Text>
                  {selectedLanguage === item.code && (
                    <Icon name="check" size={20} color="#007AFF" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    width: '100%',
  },
  label: {
    fontFamily: 'IBMPlexSans-Regular',
    fontSize: 12,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
    paddingHorizontal: 4,
    // textAlign: 'center',
  },
  trigger: {
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 12,
    backgroundColor: 'white',
    padding: 16,
  },
  triggerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  triggerText: {
    fontFamily: 'IBMPlexSans-Regular',
    fontSize: 16,
    color: '#333',
    flex: 1,
    marginLeft: 12,
  },
  placeholder: {
    fontFamily: 'IBMPlexSans-Regular',
    fontSize: 16,
    color: '#999',
    flex: 1,
  },
  flag: {
    fontSize: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F4',
  },
  modalTitle: {
    fontFamily: 'IBMPlexSans-Regular',
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F4',
  },
  modalItemSelected: {
    backgroundColor: '#F8F9FA',
  },
  modalFlag: {
    fontSize: 20,
    marginRight: 12,
  },
  modalItemText: {
    fontFamily: 'IBMPlexSans-Regular',
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  modalItemTextSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
});

export default LanguageModalComponent;
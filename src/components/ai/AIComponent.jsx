

import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Share, RefreshControl, SafeAreaView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import React, { useCallback, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';
import AIService from '../../services/AIService';
import LANGUAGES from '../../constants/Languages';
import AIScreenChat from '../../components/ai/ChatScreen';
import { clearAIResponse, setAIResponse, clearConversation } from '../../store/ai_store';
import TRANSLATE_LANGUAGES_LIST from '../../constants/TranslateLanguagesList';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AIComponent({bottomInset=0}) {

      // const insets = useSafeAreaInsets(); 

      const buttonBottom = 24 + bottomInset; 
    
      const dispatch = useDispatch();
      const { currentWord, aiResponse, isLoading, error, cache } = useSelector((state) => state.aiSlice);
      const [nativeLang, setNativeLang] = useState(null);
      const [refreshing, setRefreshing] = useState(false);
      const [activeTab, setActiveTab] = useState('overview');
      const [previousWordId, setPreviousWordId] = useState(null);
    
    
      // For user text ai component
      const [isChatOpen, setIsChatOpen] = useState(false);
    
      // Memoized function to generate and send payload
      const generatePayload = useCallback(() => {
        if (!currentWord || !nativeLang) {
          return null;
        }
        
        let target_language = LANGUAGES.find(lang => lang.code === currentWord.language_code)?.name;
        
        if (!target_language) {
          target_language = TRANSLATE_LANGUAGES_LIST[currentWord.language_code];
        }
        
        if (!target_language) {
          return null;
        }
        
        
        const payload = {
          text: currentWord.text,
          language: target_language,
          native: nativeLang,
        };
        
        dispatch(AIService.generateAIWord(payload));
        return payload;
      }, [currentWord, nativeLang, dispatch]);
    
    
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
      }, [currentWord]);
    
    
      // Reset everything when a new word is selected
      useFocusEffect(
        useCallback(() => {
          if (currentWord && nativeLang) {
    
            if (currentWord.id !== previousWordId) {
              setPreviousWordId(currentWord.id);
              setActiveTab('overview');
              setRefreshing(false);
    
              // Check if we have cached data for this word
              const cachedData = cache[currentWord.id];
              if (cachedData) {
                dispatch(setAIResponse(cachedData)); // Use cached data
                return; // Skip API call
              }
    
              // No cache found, make API call
              dispatch(clearAIResponse());
              generatePayload();
            } else {
              // console.log('Same word, no action needed');
            }
          } else {
            // console.log('Waiting for currentWord or nativeLangCode...');
          }
        }, [currentWord, previousWordId, cache, dispatch, nativeLang, generatePayload])
      );
    
    
      const onRefresh = useCallback(() => {
        setRefreshing(true);
    
        // Clear cache for this word and force new API call
        dispatch(clearAIResponse());
        generatePayload();
    
        setTimeout(() => setRefreshing(false), 1000);
      }, [currentWord, generatePayload, dispatch]);
    
    
    
      //  Clear the conversation when currentWord changes
      useEffect(() => {
        if (currentWord) {
          dispatch(clearConversation());
        }
      }, [currentWord, dispatch]);
    
    
      const shareContent = async () => {
        try {
          await Share.share({
            message: `Learning "${aiResponse.word}": ${aiResponse.definition}\n\nExamples:\n${aiResponse.examples.slice(0, 2).join('\n')}`,
            title: `Learn ${aiResponse.word} - Language App`,
          });
        } catch (error) {
          console.error('Error sharing:', error);
        }
      };
    
      const renderTabContent = () => {
        if (!aiResponse) return null;
    
        switch (activeTab) {
          case 'examples':
            return (
              <View style={styles.tabContent}>
                <Text style={styles.sectionTitle}>Examples</Text>
                {aiResponse.examples.map((example, index) => (
                  <View key={index} style={styles.exampleCard}>
                    <Text style={styles.exampleText}>{example.split(' - ')[0]}</Text>
                    <Text style={styles.translationText}>{example.split(' - ')[1]}</Text>
                  </View>
                ))}
              </View>
            );
    
          case 'grammar':
            return (
              <View style={styles.tabContent}>
                <Text style={styles.sectionTitle}>Grammar Tips</Text>
                {aiResponse.grammar_tips.map((tip, index) => (
                  <View key={index} style={styles.tipCard}>
                    <Ionicons name="bulb-outline" size={20} color="#6366F1" />
                    <Text style={styles.tipText}>{tip}</Text>
                  </View>
                ))}
    
                <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Common Phrases</Text>
                {aiResponse.common_phrases.map((phrase, index) => (
                  <View key={index} style={styles.phraseCard}>
                    <Text style={styles.phraseText}>{phrase}</Text>
                  </View>
                ))}
              </View>
            );
    
          case 'usage':
            return (
              <View style={styles.tabContent}>
                <Text style={styles.sectionTitle}>Usage Contexts</Text>
                {aiResponse.usage_contexts.map((context, index) => (
                  <View key={index} style={styles.contextCard}>
                    <Ionicons name="location-outline" size={18} color="#10B981" />
                    <Text style={styles.contextText}>{context}</Text>
                  </View>
                ))}
    
                {aiResponse.additional_insights && (
                  <>
                    <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Additional Insights</Text>
                    <View style={styles.insightsCard}>
                      {Object.entries(aiResponse.additional_insights).map(([key, value], index) => (
                        <View key={index} style={styles.insightItem}>
                          <Text style={styles.insightKey}>{key}:</Text>
                          <Text style={styles.insightValue}>
                            {typeof value === 'object' ? JSON.stringify(value, null, 2) : value}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </>
                )}
              </View>
            );
    
          default: // overview
            return (
              <View style={styles.tabContent}>
                <View style={styles.definitionCard}>
                  <Text style={styles.definitionText}>{aiResponse.definition}</Text>
                  {aiResponse.pronunciation && (
                    <Text style={styles.pronunciationText}>
                      Pronunciation: {aiResponse.pronunciation}
                    </Text>
                  )}
                  <Text style={styles.partOfSpeech}>
                    {aiResponse.part_of_speech}
                  </Text>
                </View>
    
                <Text style={styles.sectionTitle}>Quick Examples</Text>
                {aiResponse.examples.slice(0, 2).map((example, index) => (
                  <View key={index} style={styles.quickExampleCard}>
                    <Text style={styles.exampleText}>{example}</Text>
                  </View>
                ))}
    
                <Text style={styles.sectionTitle}>Top Usage Contexts</Text>
                {aiResponse.usage_contexts.slice(0, 2).map((context, index) => (
                  <View key={index} style={styles.quickContextCard}>
                    <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                    <Text style={styles.contextText}>{context}</Text>
                  </View>
                ))}
              </View>
            );
        }
      };
    
    
      if (isLoading && !aiResponse) {
        return (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#6366F1" />
            <Text style={styles.loadingText}>Analyzing "{currentWord?.text}"...</Text>
          </View>
        );
      }
    
      if (error) {
        return (
          <View style={styles.centerContainer}>
            <Ionicons name="alert-circle" size={48} color="#EF4444" />
            <Text style={styles.errorText}>Failed to generate AI content</Text>
            <Text style={styles.errorSubtext}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={generatePayload}>
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        );
      }
    
      if (!aiResponse) {
        return (
          <View style={styles.centerContainer}>
            <Text>Select a word to get started</Text>
          </View>
        );
      }
    


  return (
    <View style={styles.container} >
    
          {!isChatOpen ?
            <ScrollView
            // contentContainerStyle={{ paddingTop: insets.top }} 
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            >
              {/* Header */}
              <View style={styles.header}>
                <View>
                  <Text style={styles.wordText}>{aiResponse.word}</Text>
                  <Text style={styles.languageText}>
                    {aiResponse.target_language} → {aiResponse.native_language}
                  </Text>
                </View>
                <TouchableOpacity onPress={shareContent} style={styles.shareButton}>
                  <Ionicons name="share-outline" size={24} color="#6366F1" />
                </TouchableOpacity>
              </View>
    
              {/* Tab Navigation */}
              <View style={styles.tabContainer}>
                {['overview', 'examples', 'grammar', 'usage'].map((tab) => (
                  <TouchableOpacity
                    key={tab}
                    style={[styles.tab, activeTab === tab && styles.activeTab]}
                    onPress={() => setActiveTab(tab)}
                  >
                    <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
    
              {/* Content */}
              {renderTabContent()}
            </ScrollView>
            :
            <AIScreenChat currentWord={currentWord} nativeLang={nativeLang} onClose={() => setIsChatOpen(false)} />
          }
          {!isChatOpen && (
            <TouchableOpacity
              style={{
            position: 'absolute',
            bottom: buttonBottom,
            right: 24,
          }}
              onPress={() => setIsChatOpen(true)}
              className="absolute bottom-6 right-6 w-16 h-16 bg-indigo-500 rounded-full items-center justify-center shadow-lg"
            >
              <Ionicons name="chatbubble-ellipses" size={24} color="white" />
            </TouchableOpacity>
          )}
    
        </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748B',
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  retryText: {
    color: 'white',
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    // backgroundColor: 'white',
    // borderBottomWidth: 1,
    // borderBottomColor: '#E2E8F0',
  },
  wordText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1F2937',
  },
  languageText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  shareButton: {
    padding: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    // borderBottomWidth: 1,
    // borderBottomColor: '#E2E8F0',
  },
  tab: {
    flex: 1,
    paddingHorizontal:5,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#6366F1',
  },
  tabText: {
    color: '#64748B',
    fontWeight: '400',
  },
  activeTabText: {
    color: '#6366F1',
    fontWeight: '600',
  },
  tabContent: {
    padding: 20,
  },
  definitionCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  definitionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#374151',
  },
  pronunciationText: {
    fontSize: 14,
    color: '#6366F1',
    marginTop: 8,
    fontStyle: 'italic',
  },
  partOfSpeech: {
    fontSize: 12,
    color: '#8B5CF6',
    marginTop: 8,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  exampleCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#6366F1',
  },
  quickExampleCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  exampleText: {
    fontSize: 15,
    color: '#1F2937',
    marginBottom: 4,
  },
  translationText: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0F9FF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: '#0C4A6E',
    marginLeft: 12,
    flex: 1,
  },
  phraseCard: {
    backgroundColor: '#F1F5F9',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  phraseText: {
    fontSize: 14,
    color: '#334155',
  },
  contextCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  quickContextCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  contextText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 12,
    flex: 1,
  },
  insightsCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
  },
  insightItem: {
    marginBottom: 12,
  },
  insightKey: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  insightValue: {
    fontSize: 13,
    color: '#4B5563',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 6,
  },
});


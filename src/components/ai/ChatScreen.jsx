import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, useRef } from 'react';
import AIService from '../../services/AIService';
import LANGUAGES from '../../constants/Languages';
import { addChatMessage, setChatLoading, clearConversation } from '../../store/ai_store';

export default function AIScreenChat({ currentWord, nativeLang, onClose }) {

    const dispatch = useDispatch();
    const [message, setMessage] = useState('');

    // 🔥 UPDATED: Get conversation state from Redux
    const { conversation, error } = useSelector((state) => state.aiSlice);
    const { messages, isChatLoading } = conversation;

    // Example prompts
    const quickPrompts = [
        `Can you use "${currentWord?.text}" in a formal sentence?`,
        `What's the most common way to use "${currentWord?.text}"?`,
        `Give me lots of information about "${currentWord?.text}".`,
        `How do I pronounce "${currentWord?.text}" correctly?`,
    ];

    const handlePromptPress = (prompt) => {
        setMessage(prompt);
    };

    const handleSubmit = () => {

        if (!message.trim()) return;

        // 🔥 UPDATED: Optimistically add user message to UI immediately
        dispatch(addChatMessage({
            role: 'user',
            content: message.trim()
        }));

        dispatch(AIService.generateAITextWithQuestion({
            word: currentWord.text,
            message: message,
            native: nativeLang,
            language: LANGUAGES.find(lang => lang.code === currentWord.language_code)?.name,
        })).unwrap();

        setMessage('');
    };

    // 🔥 NEW: Scroll to bottom when new messages arrive
    const scrollViewRef = useRef();
    useEffect(() => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: true });
        }
    }, [messages]);

    return (


        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            style={{ flex: 1 }}
        >

           
            <ScrollView
                // contentContainerStyle={{
                //     flexGrow: 1,
                //     padding: 16,
                //     paddingBottom: 80, // Space for input
                // }}
                // showsVerticalScrollIndicator={false}
                // keyboardDismissMode="interactive"
                ref={scrollViewRef}
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: 16 }}
                onContentSizeChange={() => 
                    scrollViewRef.current?.scrollToEnd({ animated: true })
                }
            >

                {/* Show empty state only if no messages */}
                {messages.length === 0 ? (
                    <View style={{ alignItems: 'center', paddingTop: 40 }}>
                        {/* ... your beautiful empty state code here ... */}
                        <View style={{ 
                            width: 72, height: 72, 
                            backgroundColor: '#ede9fe', 
                            borderRadius: 36, 
                            justifyContent: 'center', 
                            alignItems: 'center', 
                            marginBottom: 24 
                        }}>
                            <Ionicons name="sparkles" size={36} color="#7c3aed" />
                        </View>
                        <Text style={{ 
                            fontSize: 22, 
                            fontWeight: '700', 
                            marginBottom: 8,
                            textAlign: 'center'
                        }}>
                            Your Personal Language Coach
                        </Text>
                        <Text style={{ 
                            color: '#4b5563', 
                            textAlign: 'center', 
                            marginBottom: 32,
                            lineHeight: 22 
                        }}>
                            Ask anything about{" "}
                            <Text style={{ fontWeight: '600', color: '#7c3aed' }}>
                                "{currentWord?.text}"
                            </Text>
                        </Text>

                        {/* Quick Prompts */}
                        <View style={{ width: '100%', gap: 10 }}>
                            {quickPrompts.map((prompt, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => handlePromptPress(prompt)}
                                    style={{
                                        backgroundColor: '#f9fafb',
                                        borderWidth: 1,
                                        borderColor: '#e5e7eb',
                                        borderRadius: 14,
                                        padding: 16,
                                    }}
                                >
                                    <Text>{prompt}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                ) : (
                    /* Show conversation history */
                    <View style={{ gap: 1 }}>
                        {messages.map((msg, index) => (
                            <View
                                key={index}
                                style={{
                                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                    backgroundColor: msg.role === 'user' ? '#7c3aed' : '#f3f4f6',
                                    padding: 12,
                                    borderRadius: 18,
                                    borderBottomRightRadius: msg.role === 'user' ? 4 : 18,
                                    borderBottomLeftRadius: msg.role === 'user' ? 18 : 4,
                                    maxWidth: '90%',
                                }}
                            >
                                <Text style={{
                                    color: msg.role === 'user' ? 'white' : '#111827',
                                }}>
                                    {msg.content}
                                </Text>
                            </View>
                        ))}
                        
                        {/* Show loading indicator when AI is thinking */}
                        {isChatLoading && (
                            <View
                                style={{
                                    alignSelf: 'flex-start',
                                    backgroundColor: '#f3f4f6',
                                    padding: 12,
                                    borderRadius: 18,
                                    borderBottomLeftRadius: 4,
                                }}
                            >
                                <Text>Thinking...</Text>
                            </View>
                        )}
                    </View>
                )}

                

            </ScrollView>


            {/* Input Bar */}
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    backgroundColor: '#ffffff',
                    borderTopWidth: 1,
                    borderTopColor: '#e5e7eb',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 6,
                    elevation: 5,
                }}
            >
                <TextInput
                    value={message}
                    onChangeText={setMessage}
                    placeholder={`Ask about "${currentWord?.text}"...`}
                    placeholderTextColor="#9ca3af"
                    style={{
                        flex: 1,
                        backgroundColor: '#f3f4f6',
                        borderRadius: 24,
                        paddingHorizontal: 16,
                        paddingVertical: 10,
                        fontSize: 15,
                        color: '#111827',
                        fontFamily: 'Inter-Regular',
                    }}
                    multiline={false}
                    returnKeyType="send"
                    onSubmitEditing={handleSubmit}
                    accessibilityLabel="Type your message to AI tutor"
                />

                <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={!message.trim()}
                    style={{
                        width: 44,
                        height: 44,
                        marginLeft: 8,
                        backgroundColor: message.trim() ? '#7c3aed' : '#d1d5db',
                        borderRadius: 22,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Ionicons name="send" size={20} color="#ffffff" />
                </TouchableOpacity>
            </View>

        </KeyboardAvoidingView>


    );
}
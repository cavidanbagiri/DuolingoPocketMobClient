import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, useRef } from 'react';
import AIService from '../../services/AIService';
import LANGUAGES from '../../constants/Languages';
import TRANSLATE_LANGUAGES_LIST from '../../constants/TranslateLanguagesList';
import { addChatMessage, setChatLoading, clearConversation } from '../../store/ai_store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AIScreenChat({ currentWord, nativeLang, onClose }) {

    const insets = useSafeAreaInsets(); // ←

    const dispatch = useDispatch();
    const [message, setMessage] = useState('');

    // 🔥 UPDATED: Get conversation state from Redux
    const { conversation } = useSelector((state) => state.aiSlice);
    const { messages, isChatLoading } = conversation;

    const quickPrompts = [
    `Give me a detailed explanation of "${currentWord?.text}"`,
    `What's the difference between "${currentWord?.text}" and similar words?`,
    `Provide real-life scenarios using "${currentWord?.text}"`,
    `How can I remember "${currentWord?.text}" more easily?`,
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

        let target_language = LANGUAGES.find(lang => lang.code === currentWord.language_code)?.name;
        if (!target_language) {
            target_language = TRANSLATE_LANGUAGES_LIST[currentWord.language_code];
        }

        dispatch(AIService.generateAITextWithQuestion({
            word: currentWord.text,
            message: message,
            native: nativeLang,
            language: target_language,
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

        <View style={{ flex: 1 }}>

            <View style={{ paddingTop: insets.top, flex: 1, backgroundColor: '#F8FAFC' }}>
                {/* 🔝 Absolute Positioned Close Button */}
                <TouchableOpacity
                    onPress={onClose}
                    style={{
                        position: 'absolute',
                        right: 16,
                        top: 10,
                        zIndex: 10, // Ensure it's above content
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: '#ffffff',
                        justifyContent: 'center',
                        alignItems: 'center',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 3,
                    }}
                    accessibilityLabel="Close AI assistant"
                    activeOpacity={0.7}
                >
                <Ionicons name="close" size={24} color="#4B5563" />
                </TouchableOpacity>
                <ScrollView
                    ref={scrollViewRef}
                    style={{ flex: 1 }}
                    contentContainerStyle={{ paddingHorizontal: 16 }}
                    onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                >
                    {/* Show empty state only if no messages */}
                    {messages.length === 0 ? (
                        <View style={{ alignItems: 'center', paddingTop: 10 }}>
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
                        <View style={{ gap: 1 }}>
                            {messages.map((msg, index) => (
                                <View
                                    key={index}
                                    style={{
                                        alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                        backgroundColor: msg.role === 'user' ? '#7c3aed' : '#f3f4f6',
                                        padding: 12,
                                        borderRadius: 18,
                                        marginVertical: 8,
                                        borderBottomRightRadius: msg.role === 'user' ? 4 : 18,
                                        borderBottomLeftRadius: msg.role === 'user' ? 18 : 4,
                                        maxWidth: '90%',
                                    }}
                                >
                                    <Text style={{
                                        color: msg.role === 'user' ? 'white' : '#111827', fontSize: 16,
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
            </View>


            {/* Input Bar */}
            <View style={{ paddingHorizontal: 16, paddingVertical: 12, paddingBottom: insets.bottom + 12 }}>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TextInput
                    value={message}
                    onChangeText={setMessage}
                    placeholder={`Ask about "${currentWord?.text}"...`}
                    placeholderTextColor="#9CA3AF"
                    style={{
                        flex: 1,
                        backgroundColor: '#F3F4F6',
                        borderRadius: 24,
                        paddingHorizontal: 16,
                        paddingVertical: 10,
                        fontSize: 15,
                    }}
                    multiline={false}
                    returnKeyType="send"
                    onSubmitEditing={handleSubmit}
                    />
                    <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={!message.trim()}
                    style={{
                        width: 44,
                        height: 44,
                        backgroundColor: message.trim() ? '#7C3AED' : '#D1D5DB',
                        borderRadius: 22,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    >
                    <Ionicons name="send" size={20} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

        </View>


    );
}
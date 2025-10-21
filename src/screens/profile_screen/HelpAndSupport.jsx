import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  TextInput,
  Alert,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';

const COLORS = {
  primary: '#3B82F6',
  primaryLight: '#60A5FA',
  primaryLighter: '#93C5FD',
  primaryDark: '#2563EB',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  textTertiary: '#94A3B8',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  border: '#E2E8F0',
};

export default function HelpSupportScreen() {
  const [activeFAQ, setActiveFAQ] = useState(null);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const faqData = [
    {
      id: 1,
      question: "How do I change my native language?",
      answer: "Go to your Profile settings, tap on 'Native Language', and select your preferred language from the list. Your progress will be preserved."
    },
    {
      id: 2,
      question: "Can I learn multiple languages at once?",
      answer: "Yes! You can switch between languages in the 'Languages' tab. However, we recommend focusing on one language at a time for better learning outcomes."
    },
    {
      id: 3,
      question: "How does the streak system work?",
      answer: "Your streak increases when you complete at least one learning session per day. Missing a day will reset your streak to zero."
    },
    {
      id: 4,
      question: "Is my progress saved offline?",
      answer: "Yes, your progress is saved locally on your device. When you're online, it syncs with our servers to backup your data."
    },
    {
      id: 5,
      question: "How can I reset my password?",
      answer: "Go to Login screen, tap 'Forgot Password', and enter your email. You'll receive instructions to reset your password."
    }
  ];

  const contactMethods = [
    {
      icon: 'mail-outline',
      name: 'Email Support',
      description: 'Get detailed help from our team',
      action: () => Linking.openURL('mailto:support@yourapp.com?subject=Help Request'),
      color: COLORS.primary,
    },
    {
      icon: 'chatbubble-outline',
      name: 'Live Chat',
      description: 'Instant help during business hours',
      action: () => Alert.alert('Live Chat', 'Live chat is available 9AM-6PM EST. Would you like to continue?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue', onPress: () => console.log('Open chat') },
      ]),
      color: COLORS.success,
    },
    {
      icon: 'call-outline',
      name: 'Call Us',
      description: 'Speak directly with support',
      action: () => Linking.openURL('tel:+1234567890'),
      color: COLORS.warning,
    },
  ];

  const handleSubmitSupportRequest = async () => {
    if (!message.trim()) {
      Alert.alert('Error', 'Please enter your message');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setMessage('');
      Alert.alert(
        'Message Sent!',
        'We\'ve received your support request and will get back to you within 24 hours.',
        [{ text: 'OK' }]
      );
    }, 1500);
  };

  const toggleFAQ = (id) => {
    setActiveFAQ(activeFAQ === id ? null : id);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryDark]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Help & Support</Text>
        <Text style={styles.headerSubtitle}>
          We're here to help you succeed
        </Text>
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Get Help Quickly</Text>
          <View style={styles.contactGrid}>
            {contactMethods.map((method, index) => (
              <TouchableOpacity
                key={index}
                style={styles.contactCard}
                onPress={method.action}
              >
                <View style={[styles.contactIcon, { backgroundColor: method.color }]}>
                  <Ionicons name={method.icon} size={24} color="white" />
                </View>
                <Text style={styles.contactName}>{method.name}</Text>
                <Text style={styles.contactDescription}>{method.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <View style={styles.faqContainer}>
            {faqData.map((item) => (
              <View key={item.id} style={styles.faqItem}>
                <TouchableOpacity
                  style={styles.faqQuestion}
                  onPress={() => toggleFAQ(item.id)}
                >
                  <Text style={styles.faqQuestionText}>{item.question}</Text>
                  <Ionicons
                    name={activeFAQ === item.id ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={COLORS.textSecondary}
                  />
                </TouchableOpacity>
                {activeFAQ === item.id && (
                  <View style={styles.faqAnswer}>
                    <Text style={styles.faqAnswerText}>{item.answer}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Contact Form */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Send us a Message</Text>
          <View style={styles.contactForm}>
            <TextInput
              style={styles.messageInput}
              multiline
              numberOfLines={6}
              placeholder="Describe your issue or question in detail..."
              placeholderTextColor={COLORS.textTertiary}
              value={message}
              onChangeText={setMessage}
              textAlignVertical="top"
            />
            <TouchableOpacity
              style={[
                styles.submitButton,
                isSubmitting && styles.submitButtonDisabled
              ]}
              onPress={handleSubmitSupportRequest}
              disabled={isSubmitting}
            >
              <LinearGradient
                colors={[COLORS.primary, COLORS.primaryDark]}
                style={styles.submitGradient}
              >
                {isSubmitting ? (
                  <Feather name="loader" size={20} color="white" />
                ) : (
                  <>
                    <Ionicons name="send-outline" size={20} color="white" />
                    <Text style={styles.submitButtonText}>Send Message</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Additional Resources */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resources</Text>
          <View style={styles.resourcesGrid}>
            <TouchableOpacity style={styles.resourceCard}>
              <MaterialIcons name="menu-book" size={24} color={COLORS.primary} />
              <Text style={styles.resourceTitle}>User Guide</Text>
              <Text style={styles.resourceDescription}>
                Complete app documentation
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.resourceCard}>
              <Ionicons name="videocam-outline" size={24} color={COLORS.primary} />
              <Text style={styles.resourceTitle}>Video Tutorials</Text>
              <Text style={styles.resourceDescription}>
                Learn with video guides
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.resourceCard}>
              <Ionicons name="megaphone-outline" size={24} color={COLORS.primary} />
              <Text style={styles.resourceTitle}>Community</Text>
              <Text style={styles.resourceDescription}>
                Join other learners
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.resourceCard}>
              <MaterialIcons name="update" size={24} color={COLORS.primary} />
              <Text style={styles.resourceTitle}>What's New</Text>
              <Text style={styles.resourceDescription}>
                Latest features & updates
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer Info */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Typically respond within 24 hours
          </Text>
          <Text style={styles.footerSubtext}>
            Available Monday - Friday, 9AM - 6PM EST
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'IBMPlexSans-Regular',
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    marginTop: -20,
  },
  section: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  contactGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contactCard: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  contactIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactName: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  contactDescription: {
    fontSize: 12,
    fontFamily: 'IBMPlexSans-Regular',
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  faqContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  faqQuestionText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'IBMPlexSans-Regular',
    color: COLORS.textPrimary,
    marginRight: 12,
  },
  faqAnswer: {
    paddingBottom: 16,
    paddingHorizontal: 4,
  },
  faqAnswerText: {
    fontSize: 14,
    fontFamily: 'IBMPlexSans-Regular',
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  contactForm: {
    marginTop: 8,
  },
  messageInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'IBMPlexSans-Regular',
    color: COLORS.textPrimary,
    backgroundColor: COLORS.background,
    minHeight: 120,
    marginBottom: 16,
  },
  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    marginLeft: 8,
  },
  resourcesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  resourceCard: {
    width: '48%',
    backgroundColor: COLORS.background,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  resourceTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: COLORS.textPrimary,
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  resourceDescription: {
    fontSize: 12,
    fontFamily: 'IBMPlexSans-Regular',
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    padding: 20,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'IBMPlexSans-Regular',
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    fontFamily: 'IBMPlexSans-Regular',
    color: COLORS.textTertiary,
  },
});
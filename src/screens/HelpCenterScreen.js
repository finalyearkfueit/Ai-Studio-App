import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Linking, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { COLORS, SIZES } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import CustomButton from '../components/Button';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const FAQ_ITEMS = [
  {
    question: "How does AI Cloth Swap work?",
    answer: "Upload a clear photo of yourself and select an outfit from our curated catalog or upload your own image. Our deep neural networks automatically segment the body layout, remove the previous garments, and reconstruct the new cloth texture realistically."
  },
  {
    question: "Why is processing stuck or taking too long?",
    answer: "AI image rendering runs on dedicated high-performance cloud GPUs. During peak hours, generation can take 10-20 seconds. If you want to bypass the queue entirely, consider upgrading to AI Studio Elite for priority processing."
  },
  {
    question: "Are my uploaded photos safe and secure?",
    answer: "Absolutely. We value user privacy. All uploaded source photos and temporary AI generations are processed over HTTPS, securely stored in private instances, and permanently deleted from our servers within 24 hours."
  },
  {
    question: "How can I restore my Pro subscription?",
    answer: "If you change devices, navigate to the Premium screen and tap 'Restore Purchase' at the bottom. Our app will query your Google Play or App Store receipt to instantly reactivate your Elite membership."
  }
];

export default function HelpCenterScreen() {
  const { colors, gradients, isDarkMode } = useTheme();
  const [expandedIndex, setExpandedIndex] = useState(null);
  
  // Feedback Form State
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleExpand = (idx) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  const handleContactLink = (type, value) => {
    let url = '';
    if (type === 'tel') url = `tel:${value}`;
    if (type === 'email') url = `mailto:${value}`;
    if (type === 'whatsapp') url = `https://wa.me/${value}`;

    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert("Error", `Could not open contact channel for ${type}`);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleFeedbackSubmit = () => {
    if (!subject.trim() || !message.trim()) {
      Alert.alert("Required Fields", "Please complete both the subject and message fields.");
      return;
    }

    setLoading(true);
    // Mock API request
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        "Feedback Received! 🚀",
        "Thank you for reaching out. Our AI support engineering team will review your report and respond within 24 hours.",
        [
          {
            text: "Done",
            onPress: () => {
              setSubject('');
              setMessage('');
            }
          }
        ]
      );
    }, 1500);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={gradients.dark}
        style={styles.backgroundGrad}
      />
      
      <Header title="Help Center" />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Support Channels */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Direct Support Channels</Text>
        <View style={styles.supportRow}>
          
          {/* WhatsApp support */}
          <TouchableOpacity 
            style={[styles.supportCard, { backgroundColor: colors.card, borderColor: colors.border }]} 
            onPress={() => handleContactLink('whatsapp', '15550192831')}
            activeOpacity={0.8}
          >
            <View style={[styles.supportIconBg, { backgroundColor: 'rgba(80, 250, 123, 0.15)' }]}>
              <Ionicons name="logo-whatsapp" size={24} color="#50FA7B" />
            </View>
            <Text style={[styles.supportCardTitle, { color: colors.text }]}>WhatsApp Support</Text>
            <Text style={[styles.supportCardSub, { color: colors.textSecondary }]}>Available 24/7</Text>
          </TouchableOpacity>

          {/* Email Support */}
          <TouchableOpacity 
            style={[styles.supportCard, { backgroundColor: colors.card, borderColor: colors.border }]} 
            onPress={() => handleContactLink('email', 'support@aistudio.ai')}
            activeOpacity={0.8}
          >
            <View style={[styles.supportIconBg, { backgroundColor: 'rgba(139, 92, 246, 0.15)' }]}>
              <Ionicons name="mail-outline" size={24} color={colors.primary} />
            </View>
            <Text style={[styles.supportCardTitle, { color: colors.text }]}>Email Support</Text>
            <Text style={[styles.supportCardSub, { color: colors.textSecondary }]}>Reply under 12 hrs</Text>
          </TouchableOpacity>

        </View>

        {/* Accordion FAQ Section */}
        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 24 }]}>Frequently Asked Questions</Text>
        <View style={[styles.faqCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {FAQ_ITEMS.map((item, idx) => {
            const isExpanded = expandedIndex === idx;
            return (
              <View 
                key={idx} 
                style={[
                  styles.faqItem, 
                  { borderBottomColor: colors.border },
                  idx === FAQ_ITEMS.length - 1 && { borderBottomWidth: 0 }
                ]}
              >
                <TouchableOpacity 
                  style={styles.faqHeader} 
                  onPress={() => toggleExpand(idx)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.faqQuestion, { color: colors.text }]}>{item.question}</Text>
                  <Ionicons 
                    name={isExpanded ? "chevron-up" : "chevron-down"} 
                    size={18} 
                    color={colors.textSecondary} 
                  />
                </TouchableOpacity>

                {isExpanded && (
                  <View style={styles.faqAnswerContainer}>
                    <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>{item.answer}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Feedback / Report Form */}
        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 24 }]}>Submit Support Ticket</Text>
        <View style={[styles.feedbackCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          
          <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Feedback Subject</Text>
          <TextInput 
            value={subject}
            onChangeText={setSubject}
            placeholder="e.g. Generation Error, Payment issue..."
            placeholderTextColor={colors.textMuted}
            style={[
              styles.inputField, 
              { 
                backgroundColor: colors.background, 
                borderColor: colors.border,
                color: colors.text
              }
            ]}
          />

          <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Detail Message</Text>
          <TextInput 
            value={message}
            onChangeText={setMessage}
            placeholder="Describe the issue or feedback in detail..."
            placeholderTextColor={colors.textMuted}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={[
              styles.inputField, 
              styles.messageInput,
              { 
                backgroundColor: colors.background, 
                borderColor: colors.border,
                color: colors.text
              }
            ]}
          />

          <CustomButton 
            title={loading ? "Sending Ticket..." : "Submit Feedback"} 
            onPress={handleFeedbackSubmit}
            disabled={loading}
            style={styles.submitBtn}
          />
        </View>

        <View style={{ height: 60 }} />

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  backgroundGrad: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 14,
  },
  supportRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  supportCard: {
    flex: 0.48,
    borderRadius: SIZES.radius,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  supportIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  supportCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  supportCardSub: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  faqCard: {
    borderRadius: SIZES.radius,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  faqItem: {
    borderBottomWidth: 1,
    paddingVertical: 14,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    fontSize: 13,
    fontWeight: '700',
    flex: 0.9,
  },
  faqAnswerContainer: {
    marginTop: 10,
    paddingRight: 10,
  },
  faqAnswer: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
  },
  feedbackCard: {
    borderRadius: SIZES.radius,
    padding: 20,
    borderWidth: 1,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
  },
  inputField: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 18,
  },
  messageInput: {
    height: 100,
  },
  submitBtn: {
    marginTop: 6,
    height: 48,
  }
});

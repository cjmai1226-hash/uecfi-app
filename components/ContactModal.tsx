import React from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../hooks';
import Ionicons from '@expo/vector-icons/Ionicons';
import { createPreferencesStyles } from '../assets/styles';

interface ContactModalProps {
  visible: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ visible, onClose }) => {
  const { colors } = useTheme();
  const prefStyles = createPreferencesStyles(colors);

  const handleEmailPress = () => {
    Linking.openURL('mailto:uecfiapps@gmail.com?subject=UECFI Prayer App - Support Request');
  };

  return (
    <Modal animationType="slide" transparent={false} visible={visible} onRequestClose={onClose}>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: colors.background,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          }}>
          <TouchableOpacity
            onPress={onClose}
            style={{ marginRight: 16, padding: 8 }}
            accessibilityLabel="Close"
            accessibilityRole="button">
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: '800', color: colors.text, flex: 1 }}>
            Contact Us
          </Text>
        </View>

        {/* Content */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}>
          {/* Welcome Section */}
          <View style={prefStyles.groupCard}>
            <View style={prefStyles.row}>
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={18}
                color={colors.textMuted}
                style={{ marginRight: 8 }}
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={{ fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 4 }}>
                  Get in Touch
                </Text>
                <Text style={{ color: colors.textMuted, fontSize: 14, lineHeight: 20 }}>
                  We&apos;d love to hear from you! Whether you have questions, feedback, or need
                  support, our team is here to help.
                </Text>
              </View>
            </View>
          </View>

          {/* Contact Methods */}
          <View style={[prefStyles.groupCard, { marginTop: 12 }]}>
            <View style={prefStyles.row}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text }}>
                Contact Information
              </Text>
            </View>
            <View style={prefStyles.rowDivider} />
            {/* Email */}
            <TouchableOpacity onPress={handleEmailPress} style={prefStyles.row}>
              <View style={[prefStyles.iconArea, { backgroundColor: colors.primary }]}>
                <Ionicons name="mail" size={20} color="#ffffff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={prefStyles.rowTitle}>Email Support</Text>
                <Text style={prefStyles.rowSubtitle}>uecfiapps@gmail.com</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </TouchableOpacity>
            <View style={prefStyles.rowDivider} />
          </View>

          {/* Support Topics */}
          <View style={[prefStyles.groupCard, { marginTop: 12 }]}>
            <View style={prefStyles.row}>
              <Ionicons
                name="help-circle-outline"
                size={18}
                color={colors.textMuted}
                style={{ marginRight: 8 }}
              />
              <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text }}>
                How Can We Help?
              </Text>
            </View>
            <View style={prefStyles.rowDivider} />
            <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
              <Text
                style={{ color: colors.itemText, fontSize: 14, lineHeight: 22, marginBottom: 6 }}>
                • Technical support and troubleshooting
              </Text>
              <Text
                style={{ color: colors.itemText, fontSize: 14, lineHeight: 22, marginBottom: 6 }}>
                • Questions about prayers or songs content
              </Text>
              <Text
                style={{ color: colors.itemText, fontSize: 14, lineHeight: 22, marginBottom: 6 }}>
                • Suggestions for new features or improvements
              </Text>
              <Text
                style={{ color: colors.itemText, fontSize: 14, lineHeight: 22, marginBottom: 6 }}>
                • Feedback about the app experience
              </Text>
              <Text
                style={{ color: colors.itemText, fontSize: 14, lineHeight: 22, marginBottom: 6 }}>
                • Translation corrections or additions
              </Text>
              <Text style={{ color: colors.itemText, fontSize: 14, lineHeight: 22 }}>
                • General inquiries about UECFI
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

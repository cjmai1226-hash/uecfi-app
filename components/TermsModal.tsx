import React from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../hooks';
import Ionicons from '@expo/vector-icons/Ionicons';
import { createPreferencesStyles } from '../assets/styles';

interface TermsModalProps {
  visible: boolean;
  onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ visible, onClose }) => {
  const { colors } = useTheme();
  const prefStyles = createPreferencesStyles(colors);

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
            Terms & Agreement
          </Text>
        </View>

        {/* Content */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}>
          {/* Intro card */}
          <View style={prefStyles.groupCard}>
            <View style={prefStyles.row}>
              <Ionicons
                name="document-text-outline"
                size={18}
                color={colors.textMuted}
                style={{ marginRight: 8 }}
              />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text }}>
                  Terms and Conditions of Use
                </Text>
                <Text style={{ color: colors.textMuted, fontSize: 13, marginTop: 4 }}>
                  Last updated: September 18, 2025
                </Text>
              </View>
            </View>
          </View>

          {/* Terms content */}
          <View style={[prefStyles.groupCard, { marginTop: 12 }]}>
            {/* 1 */}
            <View style={prefStyles.row}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text }}>
                1. Agreement to Terms
              </Text>
            </View>
            <View style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
              <Text style={{ color: colors.itemText, lineHeight: 22 }}>
                By accessing or using this app (the &quot;Service&quot;), you agree to be bound by
                these Terms and Conditions (the &quot;Terms&quot;). If you do not agree, do not use
                the Service.
              </Text>
            </View>
            <View style={prefStyles.rowDivider} />

            {/* 2 */}
            <View style={prefStyles.row}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text }}>
                2. Changes to Terms
              </Text>
            </View>
            <View style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
              <Text style={{ color: colors.itemText, lineHeight: 22 }}>
                We may update these Terms at any time. Changes will be effective when posted in the
                app. Your continued use of the Service after changes are posted constitutes
                acceptance of the updated Terms.
              </Text>
            </View>
            <View style={prefStyles.rowDivider} />

            {/* 3 */}
            <View style={prefStyles.row}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text }}>
                3. Eligibility
              </Text>
            </View>
            <View style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
              <Text style={{ color: colors.itemText, lineHeight: 22 }}>
                You represent that you are legally permitted to use the Service in your jurisdiction
                and that you will comply with all applicable laws and regulations.
              </Text>
            </View>
            <View style={prefStyles.rowDivider} />

            {/* 4 */}
            <View style={prefStyles.row}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text }}>
                4. User Conduct
              </Text>
            </View>
            <View style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
              <Text style={{ color: colors.itemText, lineHeight: 22 }}>
                You agree not to misuse the Service. Prohibited conduct includes, but is not limited
                to:
              </Text>
              <View style={{ marginTop: 6 }}>
                <Text style={{ color: colors.itemText, lineHeight: 22 }}>
                  • Attempting to interfere with or disrupt the Service.
                </Text>
                <Text style={{ color: colors.itemText, lineHeight: 22 }}>
                  • Accessing the Service using automated means not approved by us.
                </Text>
                <Text style={{ color: colors.itemText, lineHeight: 22 }}>
                  • Uploading or sharing content that is unlawful, harmful, or infringing.
                </Text>
                <Text style={{ color: colors.itemText, lineHeight: 22 }}>
                  • Reverse engineering or attempting to derive source code from the Service.
                </Text>
              </View>
            </View>
            <View style={prefStyles.rowDivider} />

            {/* 5 */}
            <View style={prefStyles.row}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text }}>
                5. Content and Intellectual Property
              </Text>
            </View>
            <View style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
              <Text style={{ color: colors.itemText, lineHeight: 22 }}>
                All content and materials in the Service, including text, graphics, and logos, are
                owned by their respective owners and protected by intellectual property laws. You
                are granted a limited, non-exclusive, non-transferable license to use the Service
                for personal, non-commercial purposes.
              </Text>
            </View>
            <View style={prefStyles.rowDivider} />

            {/* 6 */}
            <View style={prefStyles.row}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text }}>
                6. Third-Party Links and Services
              </Text>
            </View>
            <View style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
              <Text style={{ color: colors.itemText, lineHeight: 22 }}>
                The Service may contain links to third-party websites or services. We are not
                responsible for the content, policies, or practices of third parties and you access
                them at your own risk.
              </Text>
            </View>
            <View style={prefStyles.rowDivider} />

            {/* 7 */}
            <View style={prefStyles.row}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text }}>
                7. Disclaimer of Warranties
              </Text>
            </View>
            <View style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
              <Text style={{ color: colors.itemText, lineHeight: 22 }}>
                The Service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis,
                without warranties of any kind, whether express or implied, including, but not
                limited to, implied warranties of merchantability, fitness for a particular purpose,
                and non-infringement.
              </Text>
            </View>
            <View style={prefStyles.rowDivider} />

            {/* 8 */}
            <View style={prefStyles.row}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text }}>
                8. Limitation of Liability
              </Text>
            </View>
            <View style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
              <Text style={{ color: colors.itemText, lineHeight: 22 }}>
                To the maximum extent permitted by law, in no event shall we be liable for any
                indirect, incidental, special, consequential, or punitive damages, or any loss of
                profits or revenues, whether incurred directly or indirectly, or any loss of data,
                use, goodwill, or other intangible losses, resulting from your use of or inability
                to use the Service.
              </Text>
            </View>
            <View style={prefStyles.rowDivider} />

            {/* 9 */}
            <View style={prefStyles.row}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text }}>
                9. Indemnification
              </Text>
            </View>
            <View style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
              <Text style={{ color: colors.itemText, lineHeight: 22 }}>
                You agree to defend, indemnify, and hold harmless the app developers and
                contributors from and against any claims, liabilities, damages, losses, and expenses
                (including reasonable attorneys&apos; fees) arising out of or in any way connected
                with your use of the Service or violation of these Terms.
              </Text>
            </View>
            <View style={prefStyles.rowDivider} />

            {/* 10 */}
            <View style={prefStyles.row}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text }}>
                10. Termination
              </Text>
            </View>
            <View style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
              <Text style={{ color: colors.itemText, lineHeight: 22 }}>
                We may suspend or terminate your access to the Service at any time, for any reason,
                including if we reasonably believe you have violated these Terms.
              </Text>
            </View>
            <View style={prefStyles.rowDivider} />

            {/* 11 */}
            <View style={prefStyles.row}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text }}>
                11. Governing Law
              </Text>
            </View>
            <View style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
              <Text style={{ color: colors.itemText, lineHeight: 22 }}>
                These Terms shall be governed by and construed in accordance with the laws of your
                local jurisdiction, without regard to its conflict of law principles.
              </Text>
            </View>
            <View style={prefStyles.rowDivider} />

            {/* 12 */}
            <View style={prefStyles.row}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text }}>
                12. Contact Us
              </Text>
            </View>
            <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
              <Text style={{ color: colors.itemText, lineHeight: 22 }}>
                If you have any questions about these Terms, please contact us at:
                uecfiappsupport@gmail.com.
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

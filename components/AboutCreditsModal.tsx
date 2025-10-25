import React from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../hooks';
import { createPreferencesStyles } from '../assets/styles';

interface AboutCreditsModalProps {
  visible: boolean;
  onClose: () => void;
}

const AboutCreditsModal: React.FC<AboutCreditsModalProps> = ({ visible, onClose }) => {
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
          <TouchableOpacity onPress={onClose} style={{ marginRight: 16, padding: 8 }}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: '800', color: colors.text, flex: 1 }}>
            About & Credits
          </Text>
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          <View style={prefStyles.groupCard}>
            <View style={prefStyles.row}>
              <Ionicons
                name="heart-outline"
                size={18}
                color={colors.textMuted}
                style={{ marginRight: 8 }}
              />
              <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text }}>
                Dedication
              </Text>
            </View>
            <View style={prefStyles.rowDivider} />
            <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
              <Text style={{ color: colors.itemText ?? colors.text, fontSize: 14, lineHeight: 20 }}>
                This app is dedicated to inspiring prayer, uplifting worship through song, and
                strengthening missions.
              </Text>
            </View>
          </View>

          <View style={[prefStyles.groupCard, { marginTop: 12 }]}>
            <View style={prefStyles.row}>
              <Ionicons
                name="code-slash-outline"
                size={18}
                color={colors.textMuted}
                style={{ marginRight: 8 }}
              />
              <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text }}>
                Development & Funding
              </Text>
            </View>
            <View style={prefStyles.rowDivider} />

            <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  source={require('../assets/images/adaptive-icon.png')}
                  resizeMode="contain"
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 12,
                    marginRight: 12,
                  }}
                />
                <Text
                  style={{
                    flex: 1,
                    color: colors.itemText ?? colors.text,
                    fontSize: 14,
                    lineHeight: 20,
                  }}>
                  Ads in the app support the developer for updating and maintaining the app.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

export default AboutCreditsModal;

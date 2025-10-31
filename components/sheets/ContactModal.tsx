import React, { useEffect, useMemo, useRef } from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks';
import Ionicons from '@expo/vector-icons/Ionicons';
import { createBottomSheetStyles } from '../../assets/styles';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';

interface ContactModalProps {
  visible: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ visible, onClose }) => {
  const { colors } = useTheme();
  const sheetStyles = createBottomSheetStyles(colors);
  const sheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['45%', '70%'], []);

  const handleEmailPress = () => {
    Linking.openURL('mailto:uecfiapps@gmail.com?subject=UECFI Prayer App - Support Request');
  };

  useEffect(() => {
    if (visible) {
      sheetRef.current?.present();
    } else {
      sheetRef.current?.dismiss();
    }
  }, [visible]);

  return (
    <BottomSheetModal
      ref={sheetRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose
      onDismiss={onClose}
      backdropComponent={(props) => (
        <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} pressBehavior="close" />
      )}
      handleIndicatorStyle={{ backgroundColor: colors.border }}
      backgroundStyle={{ backgroundColor: colors.background }}
    >
      <SafeAreaView edges={['bottom']} style={{ flex: 1, backgroundColor: colors.background }}>
        <BottomSheetScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 6, paddingBottom: 60 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Small title row */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 2,
              paddingTop: 2,
              paddingBottom: 6,
            }}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={18}
              color={colors.textMuted}
              style={{ marginRight: 8 }}
            />
            <Text style={{ fontSize: 14, fontWeight: '700', color: colors.text }}>
              Contact Us
            </Text>
          </View>

          {/* Welcome Section */}
          <View style={[sheetStyles.groupCard, { marginTop: 0 }]}> 
            <View style={sheetStyles.row}>
              <Ionicons
                name="sparkles-outline"
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
          <View style={[sheetStyles.groupCard, { marginTop: 8 }]}> 
            <View style={sheetStyles.row}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text }}>
                Contact Information
              </Text>
            </View>
            <View style={sheetStyles.rowDivider} />
            {/* Email */}
            <TouchableOpacity onPress={handleEmailPress} style={sheetStyles.row}>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                  backgroundColor: colors.primary,
                }}>
                <Ionicons name="mail" size={18} color="#ffffff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text }}>Email Support</Text>
                <Text style={{ fontSize: 13, color: colors.textMuted }}>uecfiapps@gmail.com</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
        </BottomSheetScrollView>
      </SafeAreaView>
    </BottomSheetModal>
  );
};

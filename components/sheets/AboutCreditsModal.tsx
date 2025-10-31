import React, { useEffect, useMemo, useRef } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../../hooks';
import { createBottomSheetStyles } from '../../assets/styles';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';

interface AboutCreditsModalProps {
  visible: boolean;
  onClose: () => void;
}

const AboutCreditsModal: React.FC<AboutCreditsModalProps> = ({ visible, onClose }) => {
  const { colors } = useTheme();
  const sheetStyles = createBottomSheetStyles(colors);
  const sheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['60%', '90%'], []);

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
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 6, paddingBottom: 80 }}>
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
              name="information-circle-outline"
              size={18}
              color={colors.textMuted}
              style={{ marginRight: 8 }}
            />
            <Text style={{ fontSize: 14, fontWeight: '700', color: colors.text }}>
              About & Credits
            </Text>
          </View>
          <View style={[sheetStyles.groupCard, { marginTop: 0 }]}>
            <View style={sheetStyles.row}>
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
            <View style={sheetStyles.rowDivider} />
            <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
              <Text style={{ color: colors.itemText ?? colors.text, fontSize: 14, lineHeight: 20 }}>
                This app is dedicated to inspiring prayer, uplifting worship through song, and
                strengthening missions.
              </Text>
            </View>
          </View>

          <View style={[sheetStyles.groupCard, { marginTop: 8 }]}> 
            <View style={sheetStyles.row}>
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
            <View style={sheetStyles.rowDivider} />

            <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  source={require('../../assets/images/adaptive-icon.png')}
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
        </BottomSheetScrollView>
      </SafeAreaView>
    </BottomSheetModal>
  );
};

export default AboutCreditsModal;

import React, { useEffect, useMemo, useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme, useFontSize, FontSizeOption } from '../../hooks';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createBottomSheetStyles } from '../../assets/styles';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';

interface FontSizeModalProps {
  visible: boolean;
  onClose: () => void;
}

export const FontSizeModal: React.FC<FontSizeModalProps> = ({ visible, onClose }) => {
  const { colors } = useTheme();
  const { fontSize, setFontSize } = useFontSize();
  const sheetStyles = createBottomSheetStyles(colors);
  const sheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['55%', '60%'], []);

  const fontSizeOptions: { value: FontSizeOption; label: string; description: string }[] = [
    { value: 'small', label: 'Small', description: 'Compact text for more content' },
    { value: 'medium', label: 'Medium', description: 'Default reading size' },
    { value: 'large', label: 'Large', description: 'Comfortable reading' },
    { value: 'extra-large', label: 'Extra Large', description: 'Maximum readability' },
  ];

  const handleSelectSize = (size: FontSizeOption) => {
    setFontSize(size);
    onClose();
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
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 6, paddingBottom: 40 }}>
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
              name="text-outline"
              size={18}
              color={colors.textMuted}
              style={{ marginRight: 8 }}
            />
            <Text style={{ fontSize: 14, fontWeight: '700', color: colors.text }}>
              Choose Text Size
            </Text>
          </View>

          {/* Options group */}
          <View style={[sheetStyles.groupCard, { marginTop: 0 }]}> 
            {fontSizeOptions.map((option, idx) => (
              <View key={option.value}>
                <TouchableOpacity
                  onPress={() => handleSelectSize(option.value)}
                  style={[
                    sheetStyles.row,
                    {
                      justifyContent: 'space-between',
                      backgroundColor: fontSize === option.value ? colors.surface : 'transparent',
                    },
                  ]}>
                  <View style={{ flex: 1, paddingRight: 12 }}>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 2 }}>
                      {option.label}
                    </Text>
                    <Text style={{ fontSize: 13, color: colors.textMuted }}>{option.description}</Text>
                  </View>
                  {fontSize === option.value && (
                    <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
                  )}
                </TouchableOpacity>
                {idx < fontSizeOptions.length - 1 && <View style={sheetStyles.rowDivider} />}
              </View>
            ))}
          </View>
        </BottomSheetScrollView>
      </SafeAreaView>
    </BottomSheetModal>
  );
};

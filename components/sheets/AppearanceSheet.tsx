import React, { useEffect, useMemo, useRef } from 'react';
import { View, Text, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../../hooks';
import { createBottomSheetStyles } from '../../assets/styles';

interface AppearanceSheetProps {
  visible: boolean;
  onClose: () => void;
}

export const AppearanceSheet: React.FC<AppearanceSheetProps> = ({ visible, onClose }) => {
  const { colors, brand, setBrand, isDark, toggleTheme } = useTheme();
  const styles = createBottomSheetStyles(colors);
  const sheetRef = useRef<BottomSheetModal>(null);
  // Compact heights: fits brand choices + dark mode comfortably
  const snapPoints = useMemo(() => ['55%', '90%'], []);

  useEffect(() => {
    if (visible) {
      sheetRef.current?.present();
    } else {
      sheetRef.current?.dismiss();
    }
  }, [visible]);

  const BrandRow = ({ keyId, label }: { keyId: 'facebook' | 'telegram'; label: string }) => {
    const selected = brand === keyId;
    const swatch = keyId === 'facebook' ? '#1877F2' : '#229ED9';
    return (
      <TouchableOpacity
        onPress={() => {
          if (!selected) setBrand(keyId as any);
          onClose();
        }}
        activeOpacity={0.7}
        style={styles.row}
      >
        <View style={{ width: 28, alignItems: 'center', marginRight: 12 }}>
          <Ionicons name={selected ? 'radio-button-on' : 'radio-button-off'} size={20} color={colors.text} />
        </View>
        <Text style={styles.title}>{label}</Text>
        <View style={{ flex: 1 }} />
        <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: swatch, borderWidth: 1, borderColor: colors.border }} />
      </TouchableOpacity>
    );
  };

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
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 6, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 2, paddingVertical: 6 }}>
            <Ionicons name="color-palette-outline" size={18} color={colors.text} style={{ marginRight: 8 }} />
            <Text style={{ fontSize: 14, fontWeight: '700', color: colors.text }}>Appearance</Text>
          </View>

          {/* Brand selection */}
          <View style={[styles.groupCard, { marginTop: 8 }]}> 
            <BrandRow keyId="telegram" label="Gentle Blue" />
            <View style={styles.rowDivider} />
            <BrandRow keyId="facebook" label="Strong Blue" />
          </View>

          {/* Dark mode toggle */}
          <View style={[styles.groupCard, { marginTop: 12 }]}> 
            <View style={[styles.row, { justifyContent: 'space-between' }]}> 
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 28, alignItems: 'center', marginRight: 12 }}>
                  <Ionicons name={isDark ? 'moon' : 'sunny'} size={18} color={colors.text} />
                </View>
                <Text style={styles.title}>Dark Mode</Text>
              </View>
              <Switch
                value={isDark}
                onValueChange={() => {
                  toggleTheme();
                }}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.background}
              />
            </View>
          </View>
        </BottomSheetScrollView>
      </SafeAreaView>
    </BottomSheetModal>
  );
};

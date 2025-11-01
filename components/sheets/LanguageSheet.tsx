import React, { useEffect, useMemo, useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useLanguage, useTheme } from '../../hooks';
import { createBottomSheetStyles } from '../../assets/styles';

interface LanguageSheetProps {
  visible: boolean;
  onClose: () => void;
}

export const LanguageSheet: React.FC<LanguageSheetProps> = ({ visible, onClose }) => {
  const { colors } = useTheme();
  const { language, setLanguage } = useLanguage();
  const styles = createBottomSheetStyles(colors);
  const sheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['55%', '90%'], []);

  useEffect(() => {
    if (visible) {
      sheetRef.current?.present();
    } else {
      sheetRef.current?.dismiss();
    }
  }, [visible]);

  const LangRow = ({ code, label }: { code: 'ilo' | 'tag'; label: string }) => {
    const selected = language === code;
    return (
      <TouchableOpacity
        onPress={() => {
          setLanguage(code);
          onClose();
        }}
        activeOpacity={0.7}
        style={styles.row}
      >
        <View style={{ width: 28, alignItems: 'center', marginRight: 12 }}>
          <Ionicons name={selected ? 'radio-button-on' : 'radio-button-off'} size={20} color={colors.text} />
        </View>
        <Text style={styles.title}>{label}</Text>
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
            <Ionicons name="globe-outline" size={18} color={colors.text} style={{ marginRight: 8 }} />
            <Text style={{ fontSize: 14, fontWeight: '700', color: colors.text }}>Prayer Language</Text>
          </View>

          <View style={[styles.groupCard, { marginTop: 8 }]}> 
            <LangRow code="ilo" label="Ilokano" />
            <View style={styles.rowDivider} />
            <LangRow code="tag" label="Tagalog" />
          </View>
        </BottomSheetScrollView>
      </SafeAreaView>
    </BottomSheetModal>
  );
};

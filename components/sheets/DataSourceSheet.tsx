import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks';
import { createBottomSheetStyles } from '../../assets/styles';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { getCounts } from '../../sql/sqlite';

interface DataSourceSheetProps {
  visible: boolean;
  onClose: () => void;
}

export const DataSourceSheet: React.FC<DataSourceSheetProps> = ({ visible, onClose }) => {
  const { colors } = useTheme();
  const sheetStyles = createBottomSheetStyles(colors);
  const sheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['55%', '90%'], []);

  const [songsCount, setSongsCount] = useState(0);
  const [prayersCount, setPrayersCount] = useState(0);
  const [centersCount, setCentersCount] = useState(0);

  const loadStatus = async () => {
    const { songs, prayers, centers } = await getCounts();
    setSongsCount(songs);
    setPrayersCount(prayers);
    setCentersCount(centers);
  };

  useEffect(() => {
    if (visible) {
      loadStatus();
      sheetRef.current?.present();
    } else {
      sheetRef.current?.dismiss();
    }
  }, [visible]);

  const StatRow = ({ label, count, tint, icon }: { label: string; count: number; tint: string; icon: any }) => (
    <View style={sheetStyles.row}>
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 12,
          backgroundColor: `${tint}22`,
        }}>
        <Ionicons name={icon} size={18} color={tint} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.text, fontSize: 16, fontWeight: '700' }}>{label}</Text>
        <Text style={{ color: colors.textMuted, fontSize: 12 }}>{count} items</Text>
      </View>
      <View
        style={{
          borderWidth: 1,
          borderColor: colors.textMuted,
          borderRadius: 8,
          paddingHorizontal: 10,
          paddingVertical: 6,
        }}>
        <Text style={{ color: colors.textMuted, fontSize: 12, fontWeight: '600' }}>Bundled</Text>
      </View>
    </View>
  );

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
            <Ionicons name="cloud-offline-outline" size={18} color={colors.textMuted} style={{ marginRight: 8 }} />
            <Text style={{ fontSize: 14, fontWeight: '700', color: colors.text }}>Data Source</Text>
          </View>

          {/* Stats card */}
          <View style={[sheetStyles.groupCard, { marginTop: 0 }]}> 
            <StatRow label="Songs" count={songsCount} tint="#D32F2F" icon="musical-notes-outline" />
            <View style={sheetStyles.rowDivider} />
            <StatRow label="Prayers" count={prayersCount} tint="#388E3C" icon="book-outline" />
            <View style={sheetStyles.rowDivider} />
            <StatRow label="Centers" count={centersCount} tint="#0288D1" icon="business-outline" />
          </View>

          <View style={{ marginTop: 12, paddingHorizontal: 2 }}>
            <Text style={{ color: colors.textMuted, fontSize: 12 }}>
              Content is bundled with the app and loaded locally.
            </Text>
          </View>
        </BottomSheetScrollView>
      </SafeAreaView>
    </BottomSheetModal>
  );
};

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../../hooks';
import { createBottomSheetStyles } from '../../assets/styles';
import { addCentroContact } from '../../firebase/firebase';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetScrollView, BottomSheetTextInput } from '@gorhom/bottom-sheet';

export type CenterContactForm = {
  centerName: string;
  name: string;
  role?: string;
  phone?: string;
};

interface AddCenterContactModalProps {
  visible: boolean;
  centerName: string;
  centerAddress?: string;
  onClose: () => void;
}

const AddCenterContactModal: React.FC<AddCenterContactModalProps> = ({
  visible,
  onClose,
  centerName,
  centerAddress,
}) => {
  const { colors } = useTheme();
  const sheetStyles = createBottomSheetStyles(colors);
  const sheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['65%', '90%'], []);

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [phone, setPhone] = useState('');

  const isValid = useMemo(() => name.trim().length > 0, [name]);

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async () => {
    if (!isValid) {
      Alert.alert('Missing Name', 'Please enter the contact name.');
      return;
    }
    try {
      const payload = {
        name: name.trim(),
        number: phone.trim() || undefined,
        role: role.trim() || undefined,
        center: centerName || '—',
        address: centerAddress || undefined,
      };
      const newId = await addCentroContact(payload);
      Alert.alert('Saved', `Center contact submitted successfully.\nID: ${newId}`, [
        { text: 'OK', onPress: onClose },
      ]);
      // reset form after success
      setName('');
      setRole('');
      setPhone('');
    } catch (e: any) {
      const message = e?.message || String(e);
      Alert.alert('Error', `Failed to submit contact.\n${message}`);
    }
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
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      onDismiss={handleClose}
      backdropComponent={(props) => (
        <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} pressBehavior="close" />
      )}
      handleIndicatorStyle={{ backgroundColor: colors.border }}
      backgroundStyle={{ backgroundColor: colors.background }}
    >
      <SafeAreaView edges={['bottom']} style={{ flex: 1, backgroundColor: colors.background }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={8}
        >
          <BottomSheetScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 6, paddingBottom: 80, flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
            automaticallyAdjustKeyboardInsets>
              
          {/* Intro */}
          <View style={[sheetStyles.groupCard, { marginTop: 0 }]}>
            <View style={sheetStyles.row}>
              <Ionicons
                name="people-outline"
                size={18}
                color={colors.textMuted}
                style={{ marginRight: 8 }}
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={{ fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 4 }}>
                  Center Contacts
                </Text>
                <Text style={{ color: colors.textMuted, fontSize: 14, lineHeight: 20 }}>
                  Add a person we can reach out to for this center. Make sure to have their consent.
                </Text>
              </View>
            </View>
          </View>

          {/* Center (read-only) */}
          <View style={[sheetStyles.groupCard, { marginTop: 8 }]}> 
            <View style={sheetStyles.row}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, color: colors.text, marginBottom: 6 }}>Center</Text>
                <View
                  style={{
                    backgroundColor: colors.background,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                  }}>
                  <Text style={{ color: colors.text, fontSize: 16 }}>{centerName || '—'}</Text>
                </View>
              </View>
            </View>
            <View style={sheetStyles.rowDivider} />

            {/* Name */}
            <View style={sheetStyles.row}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, color: colors.text, marginBottom: 6 }}>
                  Contact Name *
                </Text>
                <BottomSheetTextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter full name"
                  placeholderTextColor={colors.textMuted}
                  style={{
                    backgroundColor: colors.background,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    fontSize: 16,
                    color: colors.text,
                  }}
                />
              </View>
            </View>
            <View style={sheetStyles.rowDivider} />

            {/* Role */}
            <View style={sheetStyles.row}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, color: colors.text, marginBottom: 6 }}>
                  Role (optional)
                </Text>
                <BottomSheetTextInput
                  value={role}
                  onChangeText={setRole}
                  placeholder="e.g., Center Officer, Coordinator"
                  placeholderTextColor={colors.textMuted}
                  style={{
                    backgroundColor: colors.background,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    fontSize: 16,
                    color: colors.text,
                  }}
                />
              </View>
            </View>
            <View style={sheetStyles.rowDivider} />

            {/* Phone */}
            <View style={sheetStyles.row}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, color: colors.text, marginBottom: 6 }}>
                  Phone (optional)
                </Text>
                <BottomSheetTextInput
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="e.g., +63 912 345 6789"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="phone-pad"
                  style={{
                    backgroundColor: colors.background,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    fontSize: 16,
                    color: colors.text,
                  }}
                />
              </View>
            </View>
            <View style={sheetStyles.rowDivider} />

            {/* Email and Notes removed per new requirements */}
          </View>

          {/* Actions */}
          <View style={{ marginTop: 16 }}>
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={!isValid}
              style={{
                backgroundColor: !isValid ? colors.border : colors.primary,
                paddingHorizontal: 16,
                paddingVertical: 14,
                borderRadius: 12,
                alignItems: 'center',
              }}>
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>Save</Text>
            </TouchableOpacity>
            {/* Optional: leave sheet closable via pan/backdrop; header removed per request */}
          </View>
          </BottomSheetScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </BottomSheetModal>
  );
};

export default AddCenterContactModal;

import React, { useMemo, useState } from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../hooks';
import { createPreferencesStyles } from '../assets/styles';
import { addCentroContact } from '../firebase/firebase';

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
  const prefStyles = createPreferencesStyles(colors);

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

  return (
    <Modal animationType="slide" transparent={false} visible={visible} onRequestClose={handleClose}>
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
          <TouchableOpacity onPress={handleClose} style={{ marginRight: 16, padding: 8 }}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: '800', color: colors.text, flex: 1 }}>
            Add Center Contact
          </Text>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!isValid}
            style={{
              backgroundColor: !isValid ? colors.border : colors.primary,
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
            }}>
            <Text style={{ color: '#fff', fontWeight: '600' }}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          {/* Intro */}
          <View style={prefStyles.groupCard}>
            <View style={prefStyles.row}>
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
          <View style={[prefStyles.groupCard, { marginTop: 12 }]}>
            <View style={prefStyles.row}>
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
            <View style={prefStyles.rowDivider} />

            {/* Name */}
            <View style={prefStyles.row}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, color: colors.text, marginBottom: 6 }}>
                  Contact Name *
                </Text>
                <TextInput
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
            <View style={prefStyles.rowDivider} />

            {/* Role */}
            <View style={prefStyles.row}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, color: colors.text, marginBottom: 6 }}>
                  Role (optional)
                </Text>
                <TextInput
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
            <View style={prefStyles.rowDivider} />

            {/* Phone */}
            <View style={prefStyles.row}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, color: colors.text, marginBottom: 6 }}>
                  Phone (optional)
                </Text>
                <TextInput
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
            <View style={prefStyles.rowDivider} />

            {/* Email and Notes removed per new requirements */}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

export default AddCenterContactModal;

import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { useTheme, useFontSize, FontSizeOption } from '../hooks';
import Ionicons from '@expo/vector-icons/Ionicons';

interface FontSizeModalProps {
  visible: boolean;
  onClose: () => void;
}

export const FontSizeModal: React.FC<FontSizeModalProps> = ({ visible, onClose }) => {
  const { colors } = useTheme();
  const { fontSize, setFontSize } = useFontSize();

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

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}>
        <View
          style={{
            backgroundColor: colors.background,
            borderRadius: 16,
            padding: 20,
            width: '100%',
            maxWidth: 400,
            borderWidth: 1,
            borderColor: colors.border,
          }}>
          {/* Header */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 20,
            }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: '600',
                color: colors.text,
              }}>
              Choose Text Size
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Font Size Options */}
          {fontSizeOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => handleSelectSize(option.value)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 16,
                paddingHorizontal: 16,
                borderRadius: 12,
                backgroundColor: fontSize === option.value ? colors.surface : 'transparent',
                marginBottom: 8,
                borderWidth: fontSize === option.value ? 2 : 1,
                borderColor: fontSize === option.value ? colors.primary : colors.border,
              }}>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '500',
                    color: colors.text,
                    marginBottom: 4,
                  }}>
                  {option.label}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.textMuted,
                    marginBottom: 8,
                  }}>
                  {option.description}
                </Text>
                {/* Sample Text */}
                <Text
                  style={{
                    fontSize:
                      option.value === 'small'
                        ? 15
                        : option.value === 'medium'
                          ? 17
                          : option.value === 'large'
                            ? 19
                            : 22,
                    color: colors.text,
                    lineHeight:
                      option.value === 'small'
                        ? 22
                        : option.value === 'medium'
                          ? 26
                          : option.value === 'large'
                            ? 28
                            : 32,
                  }}>
                  Sample prayer text to preview size
                </Text>
              </View>
              {fontSize === option.value && (
                <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
};

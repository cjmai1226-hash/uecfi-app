import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks';
import Ionicons from '@expo/vector-icons/Ionicons';
import { addSubmission } from '../../firebase/firebase';
import { createBottomSheetStyles } from '../../assets/styles';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetScrollView, BottomSheetTextInput } from '@gorhom/bottom-sheet';

interface SubmitSongModalProps {
  visible: boolean;
  onClose: () => void;
}

export const SubmitSongModal: React.FC<SubmitSongModalProps> = ({ visible, onClose }) => {
  const { colors } = useTheme();
  const sheetStyles = createBottomSheetStyles(colors);
  const sheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['70%', '95%'], []);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isValid = useMemo(
    () => title.trim().length > 0 && author.trim().length > 0 && content.trim().length > 0,
    [title, author, content]
  );

  const resetForm = () => {
    setTitle('');
    setAuthor('');
    setContent('');
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    // Validate form
    if (!title.trim()) {
      Alert.alert('Missing Song Title', 'Please enter a title for your song before submitting.', [
        { text: 'Okay' },
      ]);
      return;
    }
    if (!author.trim()) {
      Alert.alert(
        'Missing Author Information',
        'Please enter the author or composer name for proper attribution.',
        [{ text: 'Okay' }]
      );
      return;
    }
    if (!content.trim()) {
      Alert.alert(
        'Missing Song Content',
        'Please enter the song lyrics or content. This is the main part of your submission.',
        [{ text: 'Okay' }]
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit to Firebase Firestore
      await addSubmission({
        title: title.trim(),
        author: author.trim(),
        content: content.trim(),
        submittedAt: new Date(),
        type: 'song',
      });

      Alert.alert(
        '🎵 Song Submitted Successfully!',
        'Thank you for your contribution to our worship music collection!\n\nYour song has been submitted and will be reviewed by our team. Once approved, it will be added to the app for everyone to enjoy.\n\nWe appreciate your heart for worship and sharing with our community.',
        [
          {
            text: 'Okay',
            style: 'default',
            onPress: () => {
              resetForm();
              onClose();
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error('Error submitting song:', error);
      Alert.alert(
        'Submission Failed',
        'We encountered an issue while submitting your song. Please check your internet connection and try again.\n\nIf the problem persists, please contact us through the Contact Us section in preferences.',
        [{ text: 'Okay' }]
      );
    } finally {
      setIsSubmitting(false);
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
          {/* Content */}
          <BottomSheetScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 6, paddingBottom: 100, flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
            automaticallyAdjustKeyboardInsets>
          {/* Small title row */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 2,
              paddingTop: 2,
              paddingBottom: 6,
            }}>
            <Ionicons name="musical-notes-outline" size={18} color={colors.textMuted} style={{ marginRight: 8 }} />
            <Text style={{ fontSize: 14, fontWeight: '700', color: colors.text }}>Submit New Song</Text>
          </View>
          {/* Composer intro card */}
          <View style={[sheetStyles.groupCard, { marginTop: 0 }]}>
            <View style={sheetStyles.row}>
              <View style={{ flex: 1 }}>
                <Text
                  style={{ fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 4 }}>
                  Submit a New Song
                </Text>
                <Text style={{ color: colors.textMuted, fontSize: 14, lineHeight: 20 }}>
                  Help expand our song collection. Your submission will be reviewed before being
                  added to the app.
                </Text>
              </View>
            </View>
          </View>

          {/* Form group */}
          <View style={[sheetStyles.groupCard, { marginTop: 8 }]}> 
            {/* Title */}
            <View style={sheetStyles.row}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, color: colors.text, marginBottom: 6 }}>
                  Song Title *
                </Text>
                <BottomSheetTextInput
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Enter the song title"
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

            {/* Author */}
            <View style={sheetStyles.row}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, color: colors.text, marginBottom: 6 }}>
                  Author/Composer *
                </Text>
                <BottomSheetTextInput
                  value={author}
                  onChangeText={setAuthor}
                  placeholder="Enter the author or composer name"
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
          </View>

          {/* Lyrics group */}
          <View style={[sheetStyles.groupCard, { marginTop: 8 }]}> 
            <View style={sheetStyles.row}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, color: colors.text, marginBottom: 6 }}>
                  Lyrics/Content *
                </Text>
                <BottomSheetTextInput
                  value={content}
                  onChangeText={setContent}
                  placeholder="Enter the song lyrics or content..."
                  placeholderTextColor={colors.textMuted}
                  multiline
                  numberOfLines={8}
                  textAlignVertical="top"
                  style={{
                    backgroundColor: colors.background,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    fontSize: 16,
                    color: colors.text,
                    minHeight: 120,
                  }}
                />
                <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 6 }}>
                  Include verses, chorus, and any other parts of the song
                </Text>
              </View>
            </View>
          </View>
          {/* Actions */}
          <View style={{ marginTop: 16 }}>
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isSubmitting || !isValid}
              style={{
                backgroundColor: !isValid || isSubmitting ? colors.border : colors.primary,
                paddingHorizontal: 16,
                paddingVertical: 14,
                borderRadius: 12,
                alignItems: 'center',
              }}>
              <Text style={{ color: '#ffffff', fontWeight: '700', fontSize: 16 }}>
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Text>
            </TouchableOpacity>
          </View>
        </BottomSheetScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </BottomSheetModal>
  );
};

import React, { useMemo, useState } from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../hooks';
import Ionicons from '@expo/vector-icons/Ionicons';
import { addSubmission } from '../firebase/firebase';
import { createPreferencesStyles } from '../assets/styles';

interface SubmitSongModalProps {
  visible: boolean;
  onClose: () => void;
}

export const SubmitSongModal: React.FC<SubmitSongModalProps> = ({ visible, onClose }) => {
  const { colors } = useTheme();
  const prefStyles = createPreferencesStyles(colors);
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
          <TouchableOpacity
            onPress={handleClose}
            style={{
              marginRight: 16,
              padding: 8,
            }}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>

          <Text
            style={{
              fontSize: 18,
              fontWeight: '800',
              color: colors.text,
              flex: 1,
              textAlign: 'left',
            }}>
            Submit New Song
          </Text>

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isSubmitting || !isValid}
            style={{
              backgroundColor: !isValid || isSubmitting ? colors.border : colors.primary,
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
            }}>
            <Text
              style={{
                color: '#ffffff',
                fontWeight: '600',
                fontSize: 14,
              }}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            padding: 16,
            paddingBottom: 40,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {/* Composer intro card */}
          <View style={prefStyles.groupCard}>
            <View style={prefStyles.row}>
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
          <View style={[prefStyles.groupCard, { marginTop: 12 }]}>
            {/* Title */}
            <View style={prefStyles.row}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, color: colors.text, marginBottom: 6 }}>
                  Song Title *
                </Text>
                <TextInput
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
            <View style={prefStyles.rowDivider} />

            {/* Author */}
            <View style={prefStyles.row}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, color: colors.text, marginBottom: 6 }}>
                  Author/Composer *
                </Text>
                <TextInput
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
          <View style={[prefStyles.groupCard, { marginTop: 12 }]}>
            <View style={prefStyles.row}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, color: colors.text, marginBottom: 6 }}>
                  Lyrics/Content *
                </Text>
                <TextInput
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

          {/* Guidelines */}
          <View style={[prefStyles.groupCard, { marginTop: 12 }]}>
            <View style={prefStyles.row}>
              <Ionicons
                name="information-circle-outline"
                size={18}
                color={colors.textMuted}
                style={{ marginRight: 8 }}
              />
              <Text style={{ fontSize: 14, fontWeight: '700', color: colors.text }}>
                Submission Guidelines
              </Text>
            </View>
            <View style={prefStyles.rowDivider} />
            <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
              <Text
                style={{ color: colors.textMuted, fontSize: 13, lineHeight: 18, marginBottom: 4 }}>
                • Ensure the song is appropriate for worship
              </Text>
              <Text
                style={{ color: colors.textMuted, fontSize: 13, lineHeight: 18, marginBottom: 4 }}>
                • Provide accurate author/composer information
              </Text>
              <Text
                style={{ color: colors.textMuted, fontSize: 13, lineHeight: 18, marginBottom: 4 }}>
                • Include complete lyrics with proper formatting
              </Text>
              <Text style={{ color: colors.textMuted, fontSize: 13, lineHeight: 18 }}>
                • Submissions will be reviewed before publication
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

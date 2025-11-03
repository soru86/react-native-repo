import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../../utils/constants';
import { MainStackParamList } from '../../navigation/MainNavigator';
import ApiService from '../../services/api';

type UploadRecordingScreenNavigationProp = StackNavigationProp<MainStackParamList, 'UploadRecording'>;

const UploadRecordingScreen: React.FC<{ navigation: UploadRecordingScreenNavigationProp }> = ({
  navigation,
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to access your media library');
        return false;
      }
    }
    return true;
  };

  const pickVideo = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        uploadVideo(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick video');
    }
  };

  const recordVideo = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        uploadVideo(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to record video');
    }
  };

  const uploadVideo = async (videoUri: string) => {
    setIsUploading(true);
    try {
      const data = await ApiService.uploadVideo(videoUri);
      Alert.alert('Success', 'Video uploaded successfully!', [
        {
          text: 'View Feedback',
          onPress: () => navigation.navigate('VideoFeedback', { videoId: data.videoId }),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Upload Failed', error.message || 'Please try again');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Upload a Recording</Text>
          <Text style={styles.subtitle}>Share your performance for personalized feedback</Text>
        </View>

        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={styles.optionCard}
            onPress={pickVideo}
            disabled={isUploading}
          >
            <View style={[styles.optionIcon, { backgroundColor: COLORS.primary + '20' }]}>
              <Ionicons name="folder-open" size={32} color={COLORS.primary} />
            </View>
            <Text style={styles.optionText}>Choose from Library</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionCard}
            onPress={recordVideo}
            disabled={isUploading}
          >
            <View style={[styles.optionIcon, { backgroundColor: COLORS.accent + '20' }]}>
              <Ionicons name="videocam" size={32} color={COLORS.accent} />
            </View>
            <Text style={styles.optionText}>Record New Video</Text>
          </TouchableOpacity>
        </View>

        {isUploading && (
          <View style={styles.uploadingContainer}>
            <Text style={styles.uploadingText}>Uploading video...</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: SPACING.lg },
  header: { marginBottom: SPACING.xl },
  title: { fontSize: FONT_SIZES.xxl, fontWeight: 'bold', color: COLORS.text, marginBottom: SPACING.xs },
  subtitle: { fontSize: FONT_SIZES.md, color: COLORS.textSecondary },
  optionsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: SPACING.xl },
  optionCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    marginHorizontal: SPACING.xs,
  },
  optionIcon: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.md },
  optionText: { fontSize: FONT_SIZES.md, fontWeight: '500', color: COLORS.text, textAlign: 'center' },
  uploadingContainer: { marginTop: SPACING.xl, alignItems: 'center' },
  uploadingText: { fontSize: FONT_SIZES.md, color: COLORS.textSecondary },
});

export default UploadRecordingScreen;

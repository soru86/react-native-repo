import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../../utils/constants';
import { MainStackParamList } from '../../navigation/MainNavigator';
import ApiService from '../../services/api';

type VideoFeedbackScreenNavigationProp = StackNavigationProp<MainStackParamList, 'VideoFeedback'>;
type VideoFeedbackScreenRouteProp = RouteProp<MainStackParamList, 'VideoFeedback'>;

const VideoFeedbackScreen: React.FC<{
  navigation: VideoFeedbackScreenNavigationProp;
  route: VideoFeedbackScreenRouteProp;
}> = ({ navigation, route }) => {
  const { videoId } = route.params;
  const [feedback, setFeedback] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeedback();
  }, [videoId]);

  const loadFeedback = async () => {
    try {
      const data = await ApiService.getVideoFeedback(videoId);
      setFeedback(data);
    } catch (error) {
      console.error('Failed to load feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.loadingText}>Loading feedback...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!feedback) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Ionicons name="document-text-outline" size={64} color={COLORS.textTertiary} />
          <Text style={styles.emptyText}>No feedback available yet</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Feedback on Your Video</Text>
        </View>

        {feedback.rating && (
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingLabel}>Rating</Text>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                  key={star}
                  name={star <= feedback.rating ? 'star' : 'star-outline'}
                  size={24}
                  color={COLORS.accent}
                />
              ))}
              <Text style={styles.ratingValue}>{feedback.rating}/5</Text>
            </View>
          </View>
        )}

        {feedback.comments && (
          <View style={styles.commentsContainer}>
            <Text style={styles.commentsLabel}>Coach Comments</Text>
            <Text style={styles.commentsText}>{feedback.comments}</Text>
          </View>
        )}

        {feedback.improvements && feedback.improvements.length > 0 && (
          <View style={styles.improvementsContainer}>
            <Text style={styles.improvementsLabel}>Areas for Improvement</Text>
            {feedback.improvements.map((improvement: string, index: number) => (
              <View key={index} style={styles.improvementItem}>
                <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
                <Text style={styles.improvementText}>{improvement}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: SPACING.lg },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: SPACING.xxl },
  loadingText: { fontSize: FONT_SIZES.md, color: COLORS.textSecondary },
  emptyText: { fontSize: FONT_SIZES.md, color: COLORS.textSecondary, marginTop: SPACING.md },
  backButton: { marginBottom: SPACING.md },
  header: { marginBottom: SPACING.xl },
  title: { fontSize: FONT_SIZES.xxl, fontWeight: 'bold', color: COLORS.text },
  ratingContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  ratingLabel: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginBottom: SPACING.sm },
  stars: { flexDirection: 'row', alignItems: 'center' },
  ratingValue: { fontSize: FONT_SIZES.md, fontWeight: '600', color: COLORS.text, marginLeft: SPACING.sm },
  commentsContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  commentsLabel: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginBottom: SPACING.sm },
  commentsText: { fontSize: FONT_SIZES.md, color: COLORS.text, lineHeight: 22 },
  improvementsContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
  },
  improvementsLabel: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginBottom: SPACING.md },
  improvementItem: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm },
  improvementText: { fontSize: FONT_SIZES.md, color: COLORS.text, marginLeft: SPACING.sm, flex: 1 },
});

export default VideoFeedbackScreen;

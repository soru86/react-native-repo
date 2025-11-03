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
import { CoachStackParamList } from '../../navigation/CoachNavigator';
import ApiService from '../../services/api';

type SessionDetailsScreenNavigationProp = StackNavigationProp<CoachStackParamList, 'SessionDetails'>;
type SessionDetailsScreenRouteProp = RouteProp<CoachStackParamList, 'SessionDetails'>;

const SessionDetailsScreen: React.FC<{
  navigation: SessionDetailsScreenNavigationProp;
  route: SessionDetailsScreenRouteProp;
}> = ({ navigation, route }) => {
  const { sessionId } = route.params;
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSession();
  }, [sessionId]);

  const loadSession = async () => {
    try {
      const data = await ApiService.getSessionById(sessionId);
      setSession(data);
    } catch (error) {
      console.error('Failed to load session:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.loadingText}>Loading session...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!session) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>Session not found</Text>
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
          <Text style={styles.title}>Session Details</Text>
        </View>

        <View style={styles.detailsCard}>
          <Text style={styles.dateText}>
            {new Date(session.date).toLocaleDateString()} at {session.time}
          </Text>
          <Text style={styles.typeText}>
            {session.type === 'individual' ? 'Individual' : 'Group'} Session
          </Text>
          {session.type === 'group' && (
            <Text style={styles.participantsText}>
              {session.currentParticipants || 0}/{session.maxParticipants} participants
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: SPACING.lg },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: FONT_SIZES.md, color: COLORS.textSecondary },
  emptyText: { fontSize: FONT_SIZES.md, color: COLORS.textSecondary },
  backButton: { marginBottom: SPACING.md },
  header: { marginBottom: SPACING.xl },
  title: { fontSize: FONT_SIZES.xxl, fontWeight: 'bold', color: COLORS.text },
  detailsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
  },
  dateText: { fontSize: FONT_SIZES.lg, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.xs },
  typeText: { fontSize: FONT_SIZES.md, color: COLORS.textSecondary, marginBottom: SPACING.xs },
  participantsText: { fontSize: FONT_SIZES.sm, color: COLORS.primary, fontWeight: '500' },
});

export default SessionDetailsScreen;

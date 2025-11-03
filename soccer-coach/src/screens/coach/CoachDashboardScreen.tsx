import React, { useEffect } from 'react';
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
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../../utils/constants';
import { CoachStackParamList } from '../../navigation/CoachNavigator';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchSessions } from '../../store/slices/sessionSlice';
import ApiService from '../../services/api';

type CoachDashboardScreenNavigationProp = StackNavigationProp<CoachStackParamList, 'CoachTabs'>;

const CoachDashboardScreen: React.FC<{ navigation: CoachDashboardScreenNavigationProp }> = ({
  navigation,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { sessions } = useSelector((state: RootState) => state.sessions);
  const [dashboardData, setDashboardData] = React.useState<any>(null);

  // Load data on mount
  useEffect(() => {
    loadDashboard();
    // Always fetch all sessions for dashboard (no filters)
    // This ensures dashboard shows correct data regardless of Sessions screen filters
    dispatch(fetchSessions({}));
  }, [dispatch]);

  // Refresh when screen comes into focus (e.g., returning from Sessions tab)
  useFocusEffect(
    React.useCallback(() => {
      loadDashboard();
      dispatch(fetchSessions({}));
    }, [dispatch])
  );

  const loadDashboard = async () => {
    try {
      const data = await ApiService.getCoachDashboard();
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    }
  };

  const upcomingSessions = sessions.filter((s) => s.status === 'confirmed').slice(0, 3);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Panel de Entrenador</Text>
            <Text style={styles.userName}>{user?.name || 'Coach'}</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="people" size={24} color={COLORS.primary} />
            <Text style={styles.statNumber}>{dashboardData?.totalStudents || 0}</Text>
            <Text style={styles.statLabel}>Students</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="calendar" size={24} color={COLORS.success} />
            <Text style={styles.statNumber}>{upcomingSessions.length}</Text>
            <Text style={styles.statLabel}>Sessions</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="videocam" size={24} color={COLORS.accent} />
            <Text style={styles.statNumber}>{dashboardData?.pendingVideos || 0}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Sessions</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Sessions')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {upcomingSessions.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={48} color={COLORS.textTertiary} />
              <Text style={styles.emptyStateText}>No upcoming sessions</Text>
            </View>
          ) : (
            upcomingSessions.map((session) => (
              <TouchableOpacity
                key={session.id}
                style={styles.sessionCard}
                onPress={() => navigation.navigate('SessionDetails', { sessionId: session.id })}
              >
                <View style={styles.sessionInfo}>
                  <Text style={styles.sessionDate}>
                    {new Date(session.date).toLocaleDateString()} at {session.time}
                  </Text>
                  <Text style={styles.sessionType}>
                    {session.type === 'individual' ? 'Individual' : 'Group'} Session
                  </Text>
                  {session.type === 'group' && (
                    <Text style={styles.participants}>
                      {session.currentParticipants || 0}/{session.maxParticipants} participants
                    </Text>
                  )}
                </View>
                <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: SPACING.lg },
  header: { marginBottom: SPACING.xl },
  greeting: { fontSize: FONT_SIZES.md, color: COLORS.textSecondary },
  userName: { fontSize: FONT_SIZES.xxl, fontWeight: 'bold', color: COLORS.text, marginTop: SPACING.xs },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.xl },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    marginHorizontal: SPACING.xs,
  },
  statNumber: { fontSize: FONT_SIZES.xxl, fontWeight: 'bold', color: COLORS.text, marginTop: SPACING.xs },
  statLabel: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginTop: SPACING.xs },
  section: { marginBottom: SPACING.xl },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  sectionTitle: { fontSize: FONT_SIZES.xl, fontWeight: 'bold', color: COLORS.text },
  seeAll: { fontSize: FONT_SIZES.sm, color: COLORS.primary, fontWeight: '500' },
  emptyState: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.xl, alignItems: 'center' },
  emptyStateText: { fontSize: FONT_SIZES.md, color: COLORS.textSecondary, marginTop: SPACING.md },
  sessionCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    alignItems: 'center',
  },
  sessionInfo: { flex: 1 },
  sessionDate: { fontSize: FONT_SIZES.lg, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.xs },
  sessionType: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginBottom: SPACING.xs },
  participants: { fontSize: FONT_SIZES.sm, color: COLORS.primary, fontWeight: '500' },
});

export default CoachDashboardScreen;

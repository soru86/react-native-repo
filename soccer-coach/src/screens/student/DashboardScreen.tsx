import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../../utils/constants';
import { MainStackParamList } from '../../navigation/MainNavigator';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { fetchSessions } from '../../store/slices/sessionSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';

type DashboardScreenNavigationProp = StackNavigationProp<MainStackParamList, 'MainTabs'>;

interface Props {
  navigation: DashboardScreenNavigationProp;
}

const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { sessions } = useSelector((state: RootState) => state.sessions);

  useEffect(() => {
    dispatch(fetchSessions({ status: 'confirmed' }));
  }, [dispatch]);

  const upcomingSessions = sessions
    .filter((s) => s.status === 'confirmed')
    .slice(0, 3);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.userName}>{user?.name || 'Student'}</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <View style={styles.avatar}>
              {user?.avatar ? (
                <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
              ) : (
                <Ionicons name="person" size={24} color={COLORS.primary} />
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="calendar" size={24} color={COLORS.primary} />
            <Text style={styles.statNumber}>{upcomingSessions.length}</Text>
            <Text style={styles.statLabel}>Upcoming</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
            <Text style={styles.statNumber}>
              {sessions.filter((s) => s.status === 'completed').length}
            </Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="videocam" size={24} color={COLORS.accent} />
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Recordings</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('ChooseMentor')}
            >
              <View style={[styles.actionIcon, { backgroundColor: COLORS.primary + '20' }]}>
                <Ionicons name="search" size={24} color={COLORS.primary} />
              </View>
              <Text style={styles.actionText}>Find a Mentor</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('UploadRecording')}
            >
              <View style={[styles.actionIcon, { backgroundColor: COLORS.accent + '20' }]}>
                <Ionicons name="videocam" size={24} color={COLORS.accent} />
              </View>
              <Text style={styles.actionText}>Upload Video</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Upcoming Sessions */}
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
              <TouchableOpacity
                style={styles.emptyStateButton}
                onPress={() => navigation.navigate('ChooseMentor')}
              >
                <Text style={styles.emptyStateButtonText}>Book a Session</Text>
              </TouchableOpacity>
            </View>
          ) : (
            upcomingSessions.map((session) => (
              <TouchableOpacity
                key={session.id}
                style={styles.sessionCard}
                onPress={() => navigation.navigate('BookSession', { mentorId: session.mentorId })}
              >
                <View style={styles.sessionInfo}>
                  <Text style={styles.sessionMentor}>{session.mentorName}</Text>
                  <Text style={styles.sessionDate}>
                    {new Date(session.date).toLocaleDateString()} at {session.time}
                  </Text>
                  <Text style={styles.sessionType}>
                    {session.type === 'individual' ? 'Individual' : 'Group'} Session
                  </Text>
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
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  greeting: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  userName: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: SPACING.xs,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    marginHorizontal: SPACING.xs,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  statNumber: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: SPACING.xs,
  },
  statLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  seeAll: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    marginHorizontal: SPACING.xs,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  actionText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
    color: COLORS.text,
    textAlign: 'center',
  },
  sessionCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  sessionInfo: {
    flex: 1,
  },
  sessionMentor: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  sessionDate: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  sessionType: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.primary,
    fontWeight: '500',
  },
  emptyState: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  emptyStateButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  emptyStateButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.surface,
  },
});

export default DashboardScreen;

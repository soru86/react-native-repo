import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../../utils/constants';
import { CoachStackParamList } from '../../navigation/CoachNavigator';
import ApiService from '../../services/api';
import { Session } from '../../store/slices/sessionSlice';

type CoachSessionsScreenNavigationProp = StackNavigationProp<CoachStackParamList, 'CoachTabs'>;

type FilterOption = 'all' | 'confirmed' | 'pending' | 'completed' | 'cancelled';

const CoachSessionsScreen: React.FC<{ navigation: CoachSessionsScreenNavigationProp }> = ({
  navigation,
}) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>('all');

  useEffect(() => {
    loadSessions();
  }, [selectedFilter]);

  const loadSessions = async () => {
    setIsLoading(true);
    try {
      const params: any = {};
      if (selectedFilter !== 'all') {
        params.status = selectedFilter;
      }
      const response = await ApiService.getSessions(params);
      const sessionsList = response.sessions || response || [];
      setSessions(sessionsList);
    } catch (error) {
      console.error('Failed to load sessions:', error);
      setSessions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Sort sessions: upcoming first (by date), then past
  const sortedSessions = [...sessions].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateA.getTime() - dateB.getTime();
  });

  const filterOptions: { label: string; value: FilterOption; icon: string }[] = [
    { label: 'All', value: 'all', icon: 'list' },
    { label: 'Confirmed', value: 'confirmed', icon: 'checkmark-circle' },
    { label: 'Pending', value: 'pending', icon: 'time' },
    { label: 'Completed', value: 'completed', icon: 'checkmark-done' },
    { label: 'Cancelled', value: 'cancelled', icon: 'close-circle' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return COLORS.success;
      case 'pending':
        return COLORS.warning;
      case 'completed':
        return COLORS.primary;
      case 'cancelled':
        return COLORS.error;
      default:
        return COLORS.textSecondary;
    }
  };

  const formatDate = (dateString: string, timeString: string) => {
    const date = new Date(`${dateString}T${timeString}`);
    const now = new Date();
    const isPast = date < now;

    if (isPast) {
      return {
        dateText: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        timeText: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        isPast: true,
      };
    } else {
      return {
        dateText: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        timeText: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        isPast: false,
      };
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sessions</Text>
      </View>

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {filterOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.filterTab,
              selectedFilter === option.value && styles.filterTabActive,
            ]}
            onPress={() => setSelectedFilter(option.value)}
          >
            <Ionicons
              name={option.icon as any}
              size={16}
              color={selectedFilter === option.value ? COLORS.primary : COLORS.textSecondary}
            />
            <Text
              style={[
                styles.filterText,
                selectedFilter === option.value && styles.filterTextActive,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Sessions List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={loadSessions} />
        }
      >
        {sortedSessions.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={64} color={COLORS.textTertiary} />
            <Text style={styles.emptyStateText}>
              {selectedFilter === 'all'
                ? 'No sessions found'
                : `No ${selectedFilter} sessions`}
            </Text>
            <Text style={styles.emptyStateSubtext}>
              Sessions you create or manage will appear here
            </Text>
          </View>
        ) : (
          sortedSessions.map((session) => {
            const dateInfo = formatDate(session.date, session.time);
            return (
              <TouchableOpacity
                key={session.id}
                style={[
                  styles.sessionCard,
                  dateInfo.isPast && styles.sessionCardPast,
                ]}
                onPress={() =>
                  navigation.navigate('SessionDetails', { sessionId: session.id })
                }
              >
                <View style={styles.sessionHeader}>
                  <View style={styles.sessionDateContainer}>
                    <Ionicons
                      name="calendar"
                      size={20}
                      color={dateInfo.isPast ? COLORS.textSecondary : COLORS.primary}
                    />
                    <View style={styles.dateTimeContainer}>
                      <Text style={styles.sessionDateText}>{dateInfo.dateText}</Text>
                      <Text style={styles.sessionTimeText}>{dateInfo.timeText}</Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(session.status) + '20' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        { color: getStatusColor(session.status) },
                      ]}
                    >
                      {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                    </Text>
                  </View>
                </View>

                <View style={styles.sessionDetails}>
                  <View style={styles.sessionTypeContainer}>
                    <Ionicons
                      name={session.type === 'individual' ? 'person' : 'people'}
                      size={16}
                      color={COLORS.textSecondary}
                    />
                    <Text style={styles.sessionTypeText}>
                      {session.type === 'individual' ? 'Individual' : 'Group'} Session
                    </Text>
                    {session.duration && (
                      <Text style={styles.sessionDurationText}>
                        • {session.duration} min
                      </Text>
                    )}
                  </View>

                  {session.type === 'group' && (
                    <View style={styles.participantsContainer}>
                    <Ionicons name="people" size={16} color={COLORS.primary} />
                    <Text style={styles.participantsText}>
                      {session.currentParticipants || 0}/{session.maxParticipants || 0}{' '}
                      participants
                    </Text>
                  </View>
                  )}

                  {session.studentName && (
                    <View style={styles.studentContainer}>
                      <Ionicons name="person-outline" size={16} color={COLORS.textSecondary} />
                      <Text style={styles.studentText}>{session.studentName}</Text>
                    </View>
                  )}

                  {session.price && (
                    <View style={styles.priceContainer}>
                      <Text style={styles.priceText}>${session.price}</Text>
                    </View>
                  )}
                </View>

                <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  filterContainer: {
    maxHeight: 60,
  },
  filterContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginRight: SPACING.sm,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.surface,
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
  filterTabActive: {
    backgroundColor: COLORS.primary + '20',
  },
  filterText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
    fontWeight: '500',
  },
  filterTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingTop: SPACING.md,
  },
  sessionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
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
  sessionCardPast: {
    opacity: 0.7,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  sessionDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dateTimeContainer: {
    marginLeft: SPACING.sm,
  },
  sessionDateText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  sessionTimeText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
  },
  statusText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  sessionDetails: {
    marginTop: SPACING.xs,
  },
  sessionTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  sessionTypeText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    marginLeft: SPACING.xs,
    fontWeight: '500',
  },
  sessionDurationText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
  },
  participantsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  participantsText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    marginLeft: SPACING.xs,
    fontWeight: '500',
  },
  studentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  studentText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
  },
  priceContainer: {
    marginTop: SPACING.xs,
  },
  priceText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.success,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyStateText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: SPACING.md,
  },
  emptyStateSubtext: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
});

export default CoachSessionsScreen;


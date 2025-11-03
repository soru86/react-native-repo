import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../../utils/constants';
import { MainStackParamList } from '../../navigation/MainNavigator';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchSessions, joinSession } from '../../store/slices/sessionSlice';

type JoinGroupSessionScreenNavigationProp = StackNavigationProp<MainStackParamList, 'JoinGroupSession'>;

const JoinGroupSessionScreen: React.FC<{ navigation: JoinGroupSessionScreenNavigationProp }> = ({
  navigation,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { sessions, isLoading } = useSelector((state: RootState) => state.sessions);

  useEffect(() => {
    dispatch(fetchSessions({ type: 'group', status: 'confirmed' }));
  }, [dispatch]);

  const handleJoin = async (sessionId: string) => {
    try {
      await dispatch(joinSession(sessionId)).unwrap();
      Alert.alert('Success', 'You have joined the group session!');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error || 'Failed to join session');
    }
  };

  const availableSessions = sessions.filter(
    (s) => s.type === 'group' && s.status === 'confirmed' && (s.currentParticipants || 0) < (s.maxParticipants || 0)
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Join a Group Session</Text>
        </View>

        {availableSessions.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={64} color={COLORS.textTertiary} />
            <Text style={styles.emptyText}>No available group sessions</Text>
          </View>
        ) : (
          availableSessions.map((session) => (
            <TouchableOpacity
              key={session.id}
              style={styles.sessionCard}
              onPress={() => handleJoin(session.id)}
            >
              <View style={styles.sessionInfo}>
                <Text style={styles.mentorName}>{session.mentorName}</Text>
                <Text style={styles.sessionDate}>
                  {new Date(session.date).toLocaleDateString()} at {session.time}
                </Text>
                <Text style={styles.participants}>
                  {session.currentParticipants || 0}/{session.maxParticipants} participants
                </Text>
              </View>
              <Ionicons name="add-circle" size={24} color={COLORS.primary} />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: SPACING.lg },
  backButton: { marginBottom: SPACING.md },
  header: { marginBottom: SPACING.xl },
  title: { fontSize: FONT_SIZES.xxl, fontWeight: 'bold', color: COLORS.text },
  emptyState: { alignItems: 'center', paddingVertical: SPACING.xxl },
  emptyText: { fontSize: FONT_SIZES.md, color: COLORS.textSecondary, marginTop: SPACING.md },
  sessionCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    alignItems: 'center',
  },
  sessionInfo: { flex: 1 },
  mentorName: { fontSize: FONT_SIZES.lg, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.xs },
  sessionDate: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginBottom: SPACING.xs },
  participants: { fontSize: FONT_SIZES.sm, color: COLORS.primary, fontWeight: '500' },
});

export default JoinGroupSessionScreen;

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../../utils/constants';
import { CoachStackParamList } from '../../navigation/CoachNavigator';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import ApiService from '../../services/api';

type ManageUsersScreenNavigationProp = StackNavigationProp<CoachStackParamList, 'ManageUsers'>;

const ManageUsersScreen: React.FC<{ navigation: ManageUsersScreenNavigationProp }> = ({
  navigation,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, [searchQuery]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getCoachUsers({ search: searchQuery });
      setUsers(data.users || data);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Manage Users</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={COLORS.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search users..."
          placeholderTextColor={COLORS.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <View style={styles.centerContainer}>
            <Text style={styles.loadingText}>Loading users...</Text>
          </View>
        ) : users.length === 0 ? (
          <View style={styles.centerContainer}>
            <Ionicons name="people-outline" size={64} color={COLORS.textTertiary} />
            <Text style={styles.emptyText}>No users found</Text>
          </View>
        ) : (
          users.map((user) => (
            <TouchableOpacity key={user.id} style={styles.userCard}>
              <View style={styles.userAvatar}>
                {user.avatar ? (
                  <Text>Avatar</Text>
                ) : (
                  <Ionicons name="person" size={24} color={COLORS.primary} />
                )}
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
                <Text style={styles.userRole}>{user.role || 'student'}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: SPACING.lg, paddingBottom: SPACING.md },
  title: { fontSize: FONT_SIZES.xxl, fontWeight: 'bold', color: COLORS.text },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
    height: 48,
  },
  searchIcon: { marginRight: SPACING.sm },
  searchInput: { flex: 1, fontSize: FONT_SIZES.md, color: COLORS.text },
  scrollContent: { padding: SPACING.lg },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: SPACING.xxl },
  loadingText: { fontSize: FONT_SIZES.md, color: COLORS.textSecondary },
  emptyText: { fontSize: FONT_SIZES.md, color: COLORS.textSecondary, marginTop: SPACING.md },
  userCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    alignItems: 'center',
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  userInfo: { flex: 1 },
  userName: { fontSize: FONT_SIZES.lg, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.xs },
  userEmail: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginBottom: SPACING.xs },
  userRole: { fontSize: FONT_SIZES.xs, color: COLORS.primary, fontWeight: '500' },
});

export default ManageUsersScreen;

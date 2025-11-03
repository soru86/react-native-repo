import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../../utils/constants';
import { MainStackParamList } from '../../navigation/MainNavigator';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchMentors, setSelectedMentor } from '../../store/slices/userSlice';

type ChooseMentorScreenNavigationProp = StackNavigationProp<MainStackParamList, 'ChooseMentor'>;

interface Props {
  navigation: ChooseMentorScreenNavigationProp;
}

const ChooseMentorScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { mentors, isLoading } = useSelector((state: RootState) => state.users);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchMentors({ search: searchQuery }));
  }, [dispatch, searchQuery]);

  const handleSelectMentor = (mentor: any) => {
    dispatch(setSelectedMentor(mentor));
    navigation.navigate('BookSession', { mentorId: mentor.id });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Find the Right Coach</Text>
        <Text style={styles.subtitle}>Choose a mentor for your journey</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={COLORS.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search mentors..."
          placeholderTextColor={COLORS.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View style={styles.centerContainer}>
            <Text style={styles.loadingText}>Loading mentors...</Text>
          </View>
        ) : mentors.length === 0 ? (
          <View style={styles.centerContainer}>
            <Ionicons name="people-outline" size={64} color={COLORS.textTertiary} />
            <Text style={styles.emptyText}>No mentors found</Text>
          </View>
        ) : (
          mentors.map((mentor) => (
            <TouchableOpacity
              key={mentor.id}
              style={styles.mentorCard}
              onPress={() => handleSelectMentor(mentor)}
            >
              <View style={styles.mentorAvatar}>
                {mentor.avatar ? (
                  <Image source={{ uri: mentor.avatar }} style={styles.avatarImage} />
                ) : (
                  <Ionicons name="person" size={32} color={COLORS.primary} />
                )}
              </View>
              <View style={styles.mentorInfo}>
                <Text style={styles.mentorName}>{mentor.name}</Text>
                {mentor.bio && (
                  <Text style={styles.mentorBio} numberOfLines={2}>
                    {mentor.bio}
                  </Text>
                )}
                <View style={styles.mentorDetails}>
                  {mentor.rating && (
                    <View style={styles.ratingContainer}>
                      <Ionicons name="star" size={16} color={COLORS.accent} />
                      <Text style={styles.rating}>{mentor.rating.toFixed(1)}</Text>
                    </View>
                  )}
                  {mentor.price && (
                    <Text style={styles.price}>${mentor.price}/session</Text>
                  )}
                </View>
                {mentor.specialties && mentor.specialties.length > 0 && (
                  <View style={styles.specialtiesContainer}>
                    {mentor.specialties.slice(0, 2).map((specialty, index) => (
                      <View key={index} style={styles.specialtyTag}>
                        <Text style={styles.specialtyText}>{specialty}</Text>
                      </View>
                    ))}
                  </View>
                )}
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
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
    height: 48,
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
  searchIcon: {
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingTop: SPACING.md,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  loadingText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
  },
  mentorCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    alignItems: 'center',
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
  mentorAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  mentorInfo: {
    flex: 1,
  },
  mentorName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  mentorBio: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  mentorDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  rating: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
    color: COLORS.text,
    marginLeft: SPACING.xs,
  },
  price: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.primary,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACING.xs,
  },
  specialtyTag: {
    backgroundColor: COLORS.primary + '20',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  specialtyText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.primary,
    fontWeight: '500',
  },
});

export default ChooseMentorScreen;

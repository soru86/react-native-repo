import React, { useState } from 'react';
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
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import DatePicker from 'react-native-date-picker';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../../utils/constants';
import { MainStackParamList } from '../../navigation/MainNavigator';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { createSession } from '../../store/slices/sessionSlice';
import ApiService from '../../services/api';

type BookSessionScreenNavigationProp = StackNavigationProp<MainStackParamList, 'BookSession'>;
type BookSessionScreenRouteProp = RouteProp<MainStackParamList, 'BookSession'>;

interface Props {
  navigation: BookSessionScreenNavigationProp;
  route: BookSessionScreenRouteProp;
}

const BookSessionScreen: React.FC<Props> = ({ navigation, route }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedMentor } = useSelector((state: RootState) => state.users);
  const mentorId = route.params?.mentorId || selectedMentor?.id;

  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [duration, setDuration] = useState(60);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleBookSession = async () => {
    if (!mentorId) {
      Alert.alert('Error', 'Please select a mentor first');
      navigation.goBack();
      return;
    }

    setIsLoading(true);
    try {
      await dispatch(
        createSession({
          mentorId,
          type: 'individual',
          date: date.toISOString().split('T')[0],
          time: time.toTimeString().slice(0, 5),
          duration,
        })
      ).unwrap();

      // Create payment
      const payment = await ApiService.createPayment({
        sessionId: selectedMentor?.id || mentorId,
        amount: selectedMentor?.price || 50,
      });

      navigation.navigate('PaymentSuccess', {
        sessionId: selectedMentor?.id || mentorId,
        amount: selectedMentor?.price || 50,
      });
    } catch (error: any) {
      Alert.alert('Error', error || 'Failed to book session');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Book Your Mentoring Session</Text>
          <Text style={styles.subtitle}>Choose a Mentor and Start Improving Today</Text>
        </View>

        {selectedMentor && (
          <View style={styles.mentorCard}>
            <Text style={styles.mentorName}>{selectedMentor.name}</Text>
            {selectedMentor.price && (
              <Text style={styles.price}>${selectedMentor.price}/session</Text>
            )}
          </View>
        )}

        <View style={styles.form}>
          <TouchableOpacity
            style={styles.inputContainer}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons name="calendar-outline" size={20} color={COLORS.textSecondary} />
            <View style={styles.inputContent}>
              <Text style={styles.inputLabel}>Date</Text>
              <Text style={styles.inputValue}>
                {date.toLocaleDateString()}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.inputContainer}
            onPress={() => setShowTimePicker(true)}
          >
            <Ionicons name="time-outline" size={20} color={COLORS.textSecondary} />
            <View style={styles.inputContent}>
              <Text style={styles.inputLabel}>Time</Text>
              <Text style={styles.inputValue}>
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.durationContainer}>
            <Text style={styles.durationLabel}>Duration: {duration} minutes</Text>
            <View style={styles.durationButtons}>
              {[30, 60, 90].map((dur) => (
                <TouchableOpacity
                  key={dur}
                  style={[
                    styles.durationButton,
                    duration === dur && styles.durationButtonActive,
                  ]}
                  onPress={() => setDuration(dur)}
                >
                  <Text
                    style={[
                      styles.durationButtonText,
                      duration === dur && styles.durationButtonTextActive,
                    ]}
                  >
                    {dur} min
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.bookButton, isLoading && styles.bookButtonDisabled]}
          onPress={handleBookSession}
          disabled={isLoading}
        >
          <Text style={styles.bookButtonText}>
            {isLoading ? 'Booking...' : `Book Session - $${selectedMentor?.price || 50}`}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <DatePicker
        modal
        open={showDatePicker}
        date={date}
        mode="date"
        minimumDate={new Date()}
        onConfirm={(selectedDate) => {
          setDate(selectedDate);
          setShowDatePicker(false);
        }}
        onCancel={() => setShowDatePicker(false)}
      />

      <DatePicker
        modal
        open={showTimePicker}
        date={time}
        mode="time"
        onConfirm={(selectedTime) => {
          setTime(selectedTime);
          setShowTimePicker(false);
        }}
        onCancel={() => setShowTimePicker(false)}
      />
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
  },
  backButton: {
    marginBottom: SPACING.md,
  },
  header: {
    marginBottom: SPACING.xl,
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
  mentorCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
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
  mentorName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  price: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.primary,
  },
  form: {
    marginBottom: SPACING.xl,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
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
  inputContent: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  inputLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  inputValue: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    fontWeight: '500',
  },
  durationContainer: {
    marginTop: SPACING.md,
  },
  durationLabel: {
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  durationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  durationButton: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginHorizontal: SPACING.xs,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  durationButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  durationButtonText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  durationButtonTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  bookButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.lg,
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
  bookButtonDisabled: {
    opacity: 0.6,
  },
  bookButtonText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.surface,
  },
});

export default BookSessionScreen;

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import DatePicker from 'react-native-date-picker';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../../utils/constants';
import { MainStackParamList } from '../../navigation/MainNavigator';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { createSession } from '../../store/slices/sessionSlice';

type CreateGroupSessionScreenNavigationProp = StackNavigationProp<MainStackParamList, 'CreateGroupSession'>;

const CreateGroupSessionScreen: React.FC<{ navigation: CreateGroupSessionScreenNavigationProp }> = ({
  navigation,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedMentor } = useSelector((state: RootState) => state.users);

  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [maxParticipants, setMaxParticipants] = useState('8');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    if (!selectedMentor?.id) {
      Alert.alert('Error', 'Please select a mentor first');
      navigation.goBack();
      return;
    }

    setIsLoading(true);
    try {
      await dispatch(
        createSession({
          mentorId: selectedMentor.id,
          type: 'group',
          date: date.toISOString().split('T')[0],
          time: time.toTimeString().slice(0, 5),
          maxParticipants: parseInt(maxParticipants),
        })
      ).unwrap();
      Alert.alert('Success', 'Group session created!');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error || 'Failed to create session');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Create a Group Session</Text>
        </View>

        <View style={styles.form}>
          <TouchableOpacity style={styles.inputContainer} onPress={() => setShowDatePicker(true)}>
            <Ionicons name="calendar-outline" size={20} color={COLORS.textSecondary} />
            <View style={styles.inputContent}>
              <Text style={styles.inputLabel}>Date</Text>
              <Text style={styles.inputValue}>{date.toLocaleDateString()}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.inputContainer} onPress={() => setShowTimePicker(true)}>
            <Ionicons name="time-outline" size={20} color={COLORS.textSecondary} />
            <View style={styles.inputContent}>
              <Text style={styles.inputLabel}>Time</Text>
              <Text style={styles.inputValue}>
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.inputContainer}>
            <Ionicons name="people-outline" size={20} color={COLORS.textSecondary} />
            <TextInput
              style={styles.textInput}
              placeholder="Max Participants"
              value={maxParticipants}
              onChangeText={setMaxParticipants}
              keyboardType="numeric"
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleCreate}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>{isLoading ? 'Creating...' : 'Create Session'}</Text>
        </TouchableOpacity>
      </ScrollView>

      <DatePicker
        modal
        open={showDatePicker}
        date={date}
        mode="date"
        minimumDate={new Date()}
        onConfirm={(d) => {
          setDate(d);
          setShowDatePicker(false);
        }}
        onCancel={() => setShowDatePicker(false)}
      />

      <DatePicker
        modal
        open={showTimePicker}
        date={time}
        mode="time"
        onConfirm={(t) => {
          setTime(t);
          setShowTimePicker(false);
        }}
        onCancel={() => setShowTimePicker(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: SPACING.lg },
  backButton: { marginBottom: SPACING.md },
  header: { marginBottom: SPACING.xl },
  title: { fontSize: FONT_SIZES.xxl, fontWeight: 'bold', color: COLORS.text },
  form: { marginBottom: SPACING.xl },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  inputContent: { flex: 1, marginLeft: SPACING.md },
  inputLabel: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginBottom: SPACING.xs },
  inputValue: { fontSize: FONT_SIZES.md, color: COLORS.text, fontWeight: '500' },
  textInput: { flex: 1, marginLeft: SPACING.md, fontSize: FONT_SIZES.md, color: COLORS.text },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { fontSize: FONT_SIZES.lg, fontWeight: '600', color: COLORS.surface },
});

export default CreateGroupSessionScreen;

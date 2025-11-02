import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export const FilterDialog = ({ visible, onClose, onApplyFilters, currentFilters }) => {
  const [filters, setFilters] = useState(currentFilters || {
    sortBy: 'SYMBOL',
    order: 'ASC',
    filterBy: 'ALL',
    minValue: '',
    maxValue: '',
  });

  // Sync filters when dialog opens with current filters
  useEffect(() => {
    if (visible && currentFilters) {
      setFilters(currentFilters);
    }
  }, [visible, currentFilters]);

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters = {
      sortBy: 'SYMBOL',
      order: 'ASC',
      filterBy: 'ALL',
      minValue: '',
      maxValue: '',
    };
    setFilters(resetFilters);
    onApplyFilters(resetFilters);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.dialog}>
              <View style={styles.header}>
                <Text style={styles.title}>Advanced Filters</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Ionicons name="close" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Sort By */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Sort By</Text>
                  <View style={styles.optionGroup}>
                    {[
                      { label: 'Symbol', value: 'SYMBOL' },
                      { label: 'Quantity', value: 'QUANTITY' },
                      { label: 'Invested', value: 'INVESTED' },
                      { label: 'P&L', value: 'PNL' },
                      { label: 'P&L %', value: 'PNL_PERCENT' },
                    ].map(option => (
                      <TouchableOpacity
                        key={option.value}
                        style={[
                          styles.option,
                          filters.sortBy === option.value && styles.optionActive,
                        ]}
                        onPress={() => setFilters({ ...filters, sortBy: option.value })}
                      >
                        <Text style={[
                          styles.optionText,
                          filters.sortBy === option.value && styles.optionTextActive,
                        ]}>
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Order */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Order</Text>
                  <View style={styles.optionGroup}>
                    <TouchableOpacity
                      style={[
                        styles.option,
                        filters.order === 'ASC' && styles.optionActive,
                      ]}
                      onPress={() => setFilters({ ...filters, order: 'ASC' })}
                    >
                      <Text style={[
                        styles.optionText,
                        filters.order === 'ASC' && styles.optionTextActive,
                      ]}>
                        <Ionicons name="arrow-up" size={14} color={filters.order === 'ASC' ? '#007AFF' : colors.textSecondary} /> Ascending
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.option,
                        filters.order === 'DESC' && styles.optionActive,
                      ]}
                      onPress={() => setFilters({ ...filters, order: 'DESC' })}
                    >
                      <Text style={[
                        styles.optionText,
                        filters.order === 'DESC' && styles.optionTextActive,
                      ]}>
                        <Ionicons name="arrow-down" size={14} color={filters.order === 'DESC' ? '#007AFF' : colors.textSecondary} /> Descending
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Filter By */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Filter By</Text>
                  <View style={styles.optionGroup}>
                    {[
                      { label: 'All', value: 'ALL' },
                      { label: 'Gains', value: 'GAINS' },
                      { label: 'Losses', value: 'LOSSES' },
                      { label: 'Events', value: 'EVENTS' },
                    ].map(option => (
                      <TouchableOpacity
                        key={option.value}
                        style={[
                          styles.option,
                          filters.filterBy === option.value && styles.optionActive,
                        ]}
                        onPress={() => setFilters({ ...filters, filterBy: option.value })}
                      >
                        <Text style={[
                          styles.optionText,
                          filters.filterBy === option.value && styles.optionTextActive,
                        ]}>
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </ScrollView>

              <View style={styles.footer}>
                <TouchableOpacity
                  style={styles.resetButton}
                  onPress={handleReset}
                >
                  <Text style={styles.resetButtonText}>Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.applyButton}
                  onPress={handleApply}
                >
                  <Text style={styles.applyButtonText}>Apply</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  dialog: {
    backgroundColor: colors.backgroundSecondary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: colors.border,
    borderBottomWidth: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  optionGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: colors.backgroundTertiary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  optionText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  optionTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 12,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: colors.backgroundTertiary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#007AFF',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});


import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Modal, Animated, Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import Button from '../ui/Button';
import Chip from '../ui/Chip';
import { SectionHeader, Divider } from './CommonUI';

const CITIES = ['Pune', 'Mumbai', 'Delhi'];
const AREAS_BY_CITY = {
  Pune: ['Hinjewadi', 'Wakad', 'Baner', 'Kothrud', 'Viman Nagar', 'Hadapsar'],
  Mumbai: ['Andheri', 'BKC', 'Thane', 'Powai', 'Goregaon'],
  Delhi: ['Noida', 'Gurugram', 'Dwarka', 'Lajpat Nagar'],
};
const FOOD_OPTIONS = [
  { label: 'Veg', value: 'veg' },
  { label: 'Non-Veg', value: 'nonveg' },
  { label: 'Both', value: 'both' },
  { label: 'Not Required', value: 'none' },
];
const SHARING_OPTIONS = [
  { label: 'Single', value: 'single' },
  { label: 'Double', value: 'double' },
  { label: 'Triple', value: 'triple' },
];
const GENDER_OPTIONS = [
  { label: 'Any', value: 'any' },
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
];

/**
 * FilterSheet — bottom sheet for PG search filters
 * @param {boolean} visible
 * @param {function} onClose
 * @param {object} filters - Current filter values
 * @param {function} onApply - Called with new filter object
 */
export default function FilterSheet({ visible, onClose, filters = {}, onApply }) {
  const [local, setLocal] = useState(filters);

  const update = (key, val) => setLocal((p) => ({ ...p, [key]: val }));

  const handleApply = () => {
    onApply(local);
    onClose();
  };

  const handleReset = () => {
    const empty = {};
    setLocal(empty);
    onApply(empty);
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
      <View style={styles.sheet}>
        {/* Handle */}
        <View style={styles.handle} />

        {/* Header */}
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>Filter PGs</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={22} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
          {/* City */}
          <SectionHeader title="City" />
          <View style={styles.chipRow}>
            {CITIES.map((c) => (
              <Chip
                key={c} label={c}
                selected={local.city === c}
                onPress={() => update('city', local.city === c ? undefined : c)}
              />
            ))}
          </View>

          {/* Area */}
          {local.city && (
            <>
              <Divider />
              <SectionHeader title="Area" />
              <View style={styles.chipRow}>
                {(AREAS_BY_CITY[local.city] || []).map((a) => (
                  <Chip
                    key={a} label={a}
                    selected={local.area === a}
                    onPress={() => update('area', local.area === a ? undefined : a)}
                    size="sm"
                  />
                ))}
              </View>
            </>
          )}

          <Divider />

          {/* Food */}
          <SectionHeader title="Food Preference" />
          <View style={styles.chipRow}>
            {FOOD_OPTIONS.map((f) => (
              <Chip
                key={f.value} label={f.label}
                selected={local.food === f.value}
                onPress={() => update('food', local.food === f.value ? undefined : f.value)}
              />
            ))}
          </View>

          <Divider />

          {/* Sharing type */}
          <SectionHeader title="Sharing Type" />
          <View style={styles.chipRow}>
            {SHARING_OPTIONS.map((s) => (
              <Chip
                key={s.value} label={s.label}
                selected={local.sharingType === s.value}
                onPress={() => update('sharingType', local.sharingType === s.value ? undefined : s.value)}
              />
            ))}
          </View>

          <Divider />

          {/* Gender */}
          <SectionHeader title="PG Type" />
          <View style={styles.chipRow}>
            {GENDER_OPTIONS.map((g) => (
              <Chip
                key={g.value} label={g.label}
                selected={local.gender === g.value}
                onPress={() => update('gender', local.gender === g.value ? undefined : g.value)}
              />
            ))}
          </View>

          <Divider />

          {/* AC */}
          <SectionHeader title="Air Conditioning" />
          <View style={styles.chipRow}>
            <Chip label="AC" selected={local.ac === 'true'} onPress={() => update('ac', local.ac === 'true' ? undefined : 'true')} />
            <Chip label="Non-AC" selected={local.ac === 'false'} onPress={() => update('ac', local.ac === 'false' ? undefined : 'false')} />
          </View>

          <Divider />

          {/* Verified */}
          <SectionHeader title="Verification" />
          <View style={styles.chipRow}>
            <Chip
              label="✓ Verified Only"
              selected={local.isVerified === 'true'}
              onPress={() => update('isVerified', local.isVerified === 'true' ? undefined : 'true')}
            />
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <Button title="Reset" variant="secondary" onPress={handleReset} style={{ flex: 1 }} />
          <Button title="Apply Filters" onPress={handleApply} style={{ flex: 2 }} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingHorizontal: spacing.screenPadding,
    paddingTop: 12,
  },
  handle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center', marginBottom: 16,
  },
  sheetHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 16,
  },
  sheetTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  footer: {
    flexDirection: 'row', gap: 12, paddingVertical: 16,
    borderTopWidth: 1, borderTopColor: colors.border,
  },
});

import React from 'react';
import { View, StyleSheet } from 'react-native';
import colors from '../../theme/colors';

/**
 * Skeleton loader component for loading states
 * @param {number} width
 * @param {number} height
 * @param {number} borderRadius
 * @param {object} style
 */
export function Skeleton({ width, height = 16, borderRadius = 8, style }) {
  return (
    <View
      style={[
        styles.skeleton,
        { width: width || '100%', height, borderRadius },
        style,
      ]}
    />
  );
}

/** Skeleton for a PG Card */
export function PGCardSkeleton() {
  return (
    <View style={styles.pgSkeleton}>
      <Skeleton height={160} borderRadius={0} />
      <View style={{ padding: 14 }}>
        <Skeleton width="65%" height={18} style={{ marginBottom: 8 }} />
        <Skeleton width="45%" height={14} style={{ marginBottom: 12 }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Skeleton width={80} height={22} />
          <Skeleton width={60} height={16} />
        </View>
      </View>
    </View>
  );
}

/** Skeleton for a list row */
export function ListRowSkeleton() {
  return (
    <View style={styles.rowSkeleton}>
      <Skeleton width={48} height={48} borderRadius={12} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Skeleton width="55%" height={16} style={{ marginBottom: 6 }} />
        <Skeleton width="80%" height={13} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.surfaceAlt,
    opacity: 0.7,
  },
  pgSkeleton: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: 16,
  },
  rowSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: 10,
  },
});

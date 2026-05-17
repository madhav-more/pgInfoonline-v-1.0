import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import Badge from './Badge';

/**
 * Reusable Card component for generic content
 * @param {React.ReactNode} children
 * @param {function} onPress
 * @param {object} style
 */
export function Card({ children, onPress, style }) {
  const Wrapper = onPress ? TouchableOpacity : View;
  return (
    <Wrapper
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      style={[styles.card, style]}
    >
      {children}
    </Wrapper>
  );
}

/**
 * PG Listing Card — used across Home, Search, Wishlist
 * @param {object} pg - PG data object
 * @param {function} onPress
 * @param {boolean} showStatus
 * @param {React.ReactNode} rightAction - E.g. wishlist button
 */
export function PGCard({ pg, onPress, showStatus = false, rightAction, style }) {
  const mainPhoto = pg.photos?.find((p) => p.isMain) || pg.photos?.[0];
  const minRent = Math.min(
    pg.rent?.single || Infinity,
    pg.rent?.double || Infinity,
    pg.rent?.triple || Infinity
  );

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={[styles.pgCard, style]}>
      {/* Image */}
      <View style={styles.pgImageContainer}>
        <Image
          source={{ uri: mainPhoto?.url || 'https://via.placeholder.com/400x200?text=PG' }}
          style={styles.pgImage}
          resizeMode="cover"
        />
        {pg.isVerified && (
          <View style={styles.verifiedBadge}>
            <Ionicons name="shield-checkmark" size={12} color="#fff" />
            <Text style={styles.verifiedText}>Verified</Text>
          </View>
        )}
        {rightAction && <View style={styles.rightAction}>{rightAction}</View>}
      </View>

      {/* Body */}
      <View style={styles.pgBody}>
        <View style={styles.pgHeader}>
          <Text style={styles.pgName} numberOfLines={1}>{pg.name}</Text>
          {showStatus && <Badge text={pg.status} variant={pg.status} size="sm" />}
        </View>

        <View style={styles.pgLocationRow}>
          <Ionicons name="location-outline" size={14} color={colors.textMuted} />
          <Text style={styles.pgLocation} numberOfLines={1}>{pg.area}, {pg.city}</Text>
        </View>

        <View style={styles.pgFooter}>
          <Text style={styles.pgRent}>
            ₹{minRent < Infinity ? minRent.toLocaleString('en-IN') : '—'}
            <Text style={styles.pgRentSuffix}>/mo</Text>
          </Text>

          <View style={styles.pgTags}>
            {pg.food && pg.food !== 'none' && (
              <View style={styles.miniTag}>
                <Ionicons name="restaurant-outline" size={11} color={colors.textMuted} />
                <Text style={styles.miniTagText}>{pg.food === 'both' ? 'Veg+NV' : pg.food}</Text>
              </View>
            )}
            {pg.ac && (
              <View style={styles.miniTag}>
                <Ionicons name="snow-outline" size={11} color={colors.textMuted} />
                <Text style={styles.miniTagText}>AC</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: spacing.borderRadius,
    padding: spacing.cardPadding,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  pgCard: {
    backgroundColor: colors.surface,
    borderRadius: spacing.borderRadiusLg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  pgImageContainer: { position: 'relative' },
  pgImage: { width: '100%', height: 160, backgroundColor: colors.surfaceAlt },
  verifiedBadge: {
    position: 'absolute', top: 10, left: 10,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.verified, borderRadius: 8,
    paddingVertical: 4, paddingHorizontal: 8,
  },
  verifiedText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  rightAction: { position: 'absolute', top: 10, right: 10 },
  pgBody: { padding: 14 },
  pgHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    marginBottom: 4,
  },
  pgName: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, flex: 1, marginRight: 8 },
  pgLocationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 10 },
  pgLocation: { fontSize: 13, color: colors.textMuted },
  pgFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pgRent: { fontSize: 18, fontWeight: '800', color: colors.primary },
  pgRentSuffix: { fontSize: 13, fontWeight: '500', color: colors.textMuted },
  pgTags: { flexDirection: 'row', gap: 8 },
  miniTag: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  miniTagText: { fontSize: 11, color: colors.textMuted, fontWeight: '500', textTransform: 'capitalize' },
});

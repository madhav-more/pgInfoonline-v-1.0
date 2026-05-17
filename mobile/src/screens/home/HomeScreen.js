import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  RefreshControl, TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';

import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import useAuthStore from '../../store/authStore';
import usePGStore from '../../store/pgStore';
import useWishlistStore from '../../store/wishlistStore';
import pgService from '../../services/pg.service';
import leadService from '../../services/lead.service';

import { PGCard, PGCardSkeleton } from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';
import SearchBar from '../../components/ui/SearchBar';
import WishlistButton from '../../components/shared/WishlistButton';
import { SectionHeader } from '../../components/shared/CommonUI';
import FilterSheet from '../../components/shared/FilterSheet';

const CITIES = ['Pune', 'Mumbai', 'Delhi'];

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const { pgs, setPGs, filters, setFilters, clearFilters } = usePGStore();
  const { wishlist, isWishlisted, addToWishlist, removeFromWishlist, setWishlist } = useWishlistStore();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  const [selectedCity, setSelectedCity] = useState(CITIES[0]);

  const loadData = async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    else setRefreshing(true);

    try {
      // Load PGs for selected city
      const pgData = await pgService.getAll({ ...filters, city: selectedCity, limit: 10 });
      setPGs(pgData.pgs, pgData.pagination);

      // Load Wishlist once
      if (!isRefresh) {
        const wlData = await leadService.getMyWishlist();
        setWishlist(wlData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [selectedCity, filters])
  );

  const toggleWishlist = async (pgId) => {
    try {
      if (isWishlisted(pgId)) {
        removeFromWishlist(pgId);
        // Backend removal isn't explicitly defined in lead.service yet, skipping for MVP UI speed
      } else {
        addToWishlist({ pg: pgId });
        await leadService.addLead(pgId, 'wishlist');
      }
    } catch (err) {
      console.log('Wishlist error:', err);
    }
  };

  const handleSearch = () => {
    if (searchQ.trim()) {
      navigation.navigate('Search', { initialQuery: searchQ });
    }
  };

  const activeFiltersCount = Object.keys(filters).length;

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <LinearGradient colors={[colors.gradientStart, colors.gradientMid]} style={{ paddingTop: insets.top }}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0]} 👋</Text>
            <Text style={styles.subGreeting}>Find your next home</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Avatar name={user?.name} size="sm" color="rgba(255,255,255,0.2)" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <SearchBar
            value={searchQ}
            onChangeText={setSearchQ}
            placeholder="Search by area, PG name..."
            onSubmit={handleSearch}
            onFilterPress={() => setShowFilter(true)}
            showFilter
          />
        </View>

        {/* City Selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cityScroll}>
          {CITIES.map((city) => (
            <TouchableOpacity
              key={city}
              style={[styles.cityChip, selectedCity === city && styles.cityChipActive]}
              onPress={() => setSelectedCity(city)}
            >
              <Ionicons name="location" size={12} color={selectedCity === city ? colors.primary : '#fff'} />
              <Text style={[styles.cityText, selectedCity === city && styles.cityTextActive]}>
                {city}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </LinearGradient>

      {/* Main Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadData(true)} tintColor={colors.primary} />}
      >
        <SectionHeader
          title={`Top PGs in ${selectedCity}`}
          actionText={activeFiltersCount > 0 ? 'Clear Filters' : 'See All'}
          onAction={() => activeFiltersCount > 0 ? clearFilters() : navigation.navigate('Search')}
        />

        {loading ? (
          <>
            <PGCardSkeleton />
            <PGCardSkeleton />
          </>
        ) : pgs.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="home-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyText}>No PGs found in this area</Text>
          </View>
        ) : (
          pgs.map((pg) => (
            <PGCard
              key={pg._id}
              pg={pg}
              onPress={() => navigation.navigate('PGDetail', { pgId: pg._id })}
              style={{ marginBottom: 16 }}
              rightAction={
                <WishlistButton
                  isWishlisted={isWishlisted(pg._id)}
                  onPress={() => toggleWishlist(pg._id)}
                />
              }
            />
          ))
        )}

        {/* AI Banner */}
        <TouchableOpacity style={styles.aiBanner} onPress={() => navigation.navigate('AIChat')} activeOpacity={0.9}>
          <LinearGradient
            colors={['#8b5cf6', '#6d28d9']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={styles.aiGradient}
          >
            <View style={styles.aiIconWrapper}>
              <Ionicons name="sparkles" size={24} color="#8b5cf6" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.aiTitle}>Try AI Search</Text>
              <Text style={styles.aiSub}>Tell us exactly what you need</Text>
            </View>
            <Ionicons name="arrow-forward-circle" size={28} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>

      {/* Filter Modal */}
      <FilterSheet
        visible={showFilter}
        onClose={() => setShowFilter(false)}
        filters={filters}
        onApply={(f) => setFilters(f)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.screenPadding, paddingBottom: 16, paddingTop: 10,
  },
  greeting: { fontSize: 22, fontWeight: '800', color: '#fff' },
  subGreeting: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  searchContainer: { paddingHorizontal: spacing.screenPadding, paddingBottom: 16 },
  cityScroll: { paddingHorizontal: spacing.screenPadding, paddingBottom: 16, gap: 10 },
  cityChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingVertical: 6, paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
  },
  cityChipActive: { backgroundColor: '#fff', borderColor: '#fff' },
  cityText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  cityTextActive: { color: colors.primary },
  content: { padding: spacing.screenPadding, paddingBottom: 40 },
  empty: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { fontSize: 15, color: colors.textMuted, marginTop: 12 },
  aiBanner: {
    marginTop: 8, marginBottom: 20,
    borderRadius: 16, overflow: 'hidden',
    shadowColor: '#8b5cf6', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
  },
  aiGradient: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  aiIconWrapper: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
  },
  aiTitle: { fontSize: 16, fontWeight: '700', color: '#fff' },
  aiSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
});

import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import pgService from '../../services/pg.service';
import leadService from '../../services/lead.service';
import useWishlistStore from '../../store/wishlistStore';

import ScreenHeader from '../../components/layout/ScreenHeader';
import SearchBar from '../../components/ui/SearchBar';
import PGListItem from '../../components/shared/PGListItem';
import { ListRowSkeleton } from '../../components/ui/Skeleton';
import EmptyState from '../../components/shared/EmptyState';
import FilterSheet from '../../components/shared/FilterSheet';

export default function SearchScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const initialQuery = route.params?.initialQuery || '';

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({});

  const { isWishlisted, addToWishlist, removeFromWishlist } = useWishlistStore();

  const handleSearch = async () => {
    setLoading(true);
    try {
      const { pgs } = await pgService.getAll({ q: query, ...filters });
      setResults(pgs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Run search when query or filters change
  useEffect(() => {
    handleSearch();
  }, [filters]);

  // Initial search if navigated with a query
  useEffect(() => {
    if (initialQuery) handleSearch();
  }, []);

  const toggleWishlist = async (pgId) => {
    try {
      if (isWishlisted(pgId)) removeFromWishlist(pgId);
      else {
        addToWishlist({ pg: pgId });
        await leadService.addLead(pgId, 'wishlist');
      }
    } catch (e) {}
  };

  const activeFilters = Object.keys(filters).length;

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Search PGs"
        subtitle={activeFilters > 0 ? `${activeFilters} filter(s) applied` : 'Find exactly what you need'}
        gradient
        textColor="light"
      />

      <View style={styles.searchWrap}>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          onSubmit={handleSearch}
          onClear={() => { setQuery(''); setResults([]); }}
          onFilterPress={() => setShowFilter(true)}
          showFilter
        />
      </View>

      <FlatList
        data={results}
        keyExtractor={(i) => i._id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          loading ? (
            <View>
              <ListRowSkeleton /><ListRowSkeleton /><ListRowSkeleton />
            </View>
          ) : (
            <EmptyState
              icon="search-outline"
              title="No results found"
              message="Try adjusting your search or filters."
            />
          )
        }
        renderItem={({ item }) => (
          <PGListItem
            pg={item}
            onPress={() => navigation.navigate('PGDetail', { pgId: item._id })}
            isWishlisted={isWishlisted(item._id)}
            onWishlist={() => toggleWishlist(item._id)}
          />
        )}
      />

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
  searchWrap: {
    padding: spacing.screenPadding,
    backgroundColor: colors.surface,
    borderBottomWidth: 1, borderBottomColor: colors.borderLight,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 3, elevation: 3,
    zIndex: 1,
  },
  list: { padding: spacing.screenPadding, paddingBottom: 40 },
});

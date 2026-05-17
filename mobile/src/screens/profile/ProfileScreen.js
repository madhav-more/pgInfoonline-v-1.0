import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import useAuthStore from '../../store/authStore';

import ScreenHeader from '../../components/layout/ScreenHeader';
import Avatar from '../../components/ui/Avatar';
import Button from '../../components/ui/Button';
import { SectionHeader, InfoRow } from '../../components/shared/CommonUI';

export default function ProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    // Auth flow triggers automatically due to AppNavigator logic
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Profile" />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Avatar name={user?.name} size="xl" />
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Tenant</Text>
          </View>
        </View>

        <SectionHeader title="Account Details" />
        <View style={styles.infoBlock}>
          <InfoRow label="Phone Number" value={user?.phone || 'Not provided'} iconName="call-outline" />
          <InfoRow label="Member Since" value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'} iconName="calendar-outline" />
        </View>

        <SectionHeader title="Settings & Support" />
        <View style={styles.infoBlock}>
          <InfoRow label="Privacy Policy" value="" iconName="shield-checkmark-outline" />
          <InfoRow label="Terms of Service" value="" iconName="document-text-outline" />
          <InfoRow label="Help & Support" value="" iconName="help-circle-outline" />
        </View>

        <Button
          title="Log Out"
          variant="danger"
          icon={<Ionicons name="log-out-outline" size={18} color={colors.error} />}
          onPress={handleLogout}
          style={{ marginTop: 24 }}
        />

        <Text style={styles.version}>PGinfo.online v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.screenPadding, paddingBottom: 40 },
  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: 20, padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
    borderWidth: 1, borderColor: colors.borderLight,
  },
  name: { fontSize: 20, fontWeight: '700', color: colors.textPrimary, marginTop: 16 },
  email: { fontSize: 14, color: colors.textMuted, marginTop: 4 },
  badge: {
    backgroundColor: colors.successBg, paddingHorizontal: 12, paddingVertical: 4,
    borderRadius: 12, marginTop: 12,
  },
  badgeText: { fontSize: 12, fontWeight: '700', color: colors.success },
  infoBlock: {
    backgroundColor: colors.surface, borderRadius: 16,
    paddingHorizontal: 16, marginBottom: 20,
    borderWidth: 1, borderColor: colors.borderLight,
  },
  version: { textAlign: 'center', color: colors.textMuted, fontSize: 12, marginTop: 32 },
});

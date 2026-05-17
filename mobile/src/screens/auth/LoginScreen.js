import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  KeyboardAvoidingView, Platform, TouchableOpacity
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import useAuthStore from '../../store/authStore';
import authService from '../../services/auth.service';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';

export default function LoginScreen({ navigation }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const insets = useSafeAreaInsets();

  const update = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      Toast.show({ type: 'error', text1: 'Missing fields', text2: 'Enter email and password' });
      return;
    }
    setLoading(true);
    try {
      const { user, token } = await authService.login(form);
      await setAuth(user, token);
      Toast.show({ type: 'success', text1: `Welcome back, ${user.name.split(' ')[0]}! 👋` });
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Login failed', text2: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
      <LinearGradient colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]} style={styles.gradient}>
        {/* Top brand area */}
        <View style={[styles.brand, { paddingTop: insets.top + 40 }]}>
          <View style={styles.logoCircle}>
            <Ionicons name="home" size={32} color="#fff" />
          </View>
          <Text style={styles.brandName}>PGinfo.online</Text>
          <Text style={styles.brandTagline}>Find your perfect PG, no brokerage</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Welcome Back</Text>
          <Text style={styles.cardSub}>Sign in to continue</Text>

          <Input
            label="Email Address"
            placeholder="you@email.com"
            value={form.email}
            onChangeText={(v) => update('email', v)}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={<Ionicons name="mail-outline" size={18} color={colors.textMuted} />}
          />

          <Input
            label="Password"
            placeholder="Your password"
            value={form.password}
            onChangeText={(v) => update('password', v)}
            secureTextEntry
            leftIcon={<Ionicons name="lock-closed-outline" size={18} color={colors.textMuted} />}
          />

          <Button
            title={loading ? 'Signing in...' : 'Sign In'}
            onPress={handleLogin}
            loading={loading}
            fullWidth
            size="lg"
            style={{ marginTop: 8 }}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.footerLink}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  brand: { alignItems: 'center', paddingBottom: 40 },
  logoCircle: {
    width: 72, height: 72, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.25)',
  },
  brandName: { fontSize: 28, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
  brandTagline: { fontSize: 14, color: 'rgba(255,255,255,0.65)', marginTop: 6 },
  card: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    flex: 1, padding: spacing.screenPadding,
    paddingTop: 28,
  },
  cardTitle: { fontSize: 24, fontWeight: '800', color: colors.textPrimary, marginBottom: 4 },
  cardSub: { fontSize: 14, color: colors.textMuted, marginBottom: 28 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24, alignItems: 'center' },
  footerText: { fontSize: 14, color: colors.textSecondary },
  footerLink: { fontSize: 14, color: colors.primary, fontWeight: '700' },
});

import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  KeyboardAvoidingView, Platform, TouchableOpacity
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import useAuthStore from '../../store/authStore';
import authService from '../../services/auth.service';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';

export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();

  const update = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const validate = () => {
    if (!form.name.trim()) return 'Name is required';
    if (!form.email.includes('@')) return 'Enter a valid email';
    if (!/^[6-9]\d{9}$/.test(form.phone)) return 'Enter a valid 10-digit mobile number';
    if (form.password.length < 6) return 'Password must be 6+ characters';
    return null;
  };

  const handleRegister = async () => {
    const err = validate();
    if (err) { Toast.show({ type: 'error', text1: 'Validation Error', text2: err }); return; }
    setLoading(true);
    try {
      const { user, token } = await authService.register(form);
      await setAuth(user, token);
      Toast.show({ type: 'success', text1: `Welcome, ${user.name.split(' ')[0]}! 🎉` });
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Registration failed', text2: e.message });
    } finally { setLoading(false); }
  };

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={[colors.gradientStart, colors.gradientMid]} style={styles.topBand} />
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* Back button */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.headerTitle}>Create Account</Text>
          <Text style={styles.headerSub}>Join thousands finding PGs the right way</Text>
        </View>

        <View style={styles.card}>
          <Input label="Full Name" placeholder="Amit Kumar" value={form.name}
            onChangeText={(v) => update('name', v)}
            leftIcon={<Ionicons name="person-outline" size={18} color={colors.textMuted} />} />

          <Input label="Email Address" placeholder="you@email.com" value={form.email}
            onChangeText={(v) => update('email', v)}
            keyboardType="email-address" autoCapitalize="none"
            leftIcon={<Ionicons name="mail-outline" size={18} color={colors.textMuted} />} />

          <Input label="Mobile Number" placeholder="9876543210" value={form.phone}
            onChangeText={(v) => update('phone', v)}
            keyboardType="phone-pad"
            leftIcon={<Ionicons name="call-outline" size={18} color={colors.textMuted} />} />

          <Input label="Password" placeholder="Min. 6 characters" value={form.password}
            onChangeText={(v) => update('password', v)} secureTextEntry
            leftIcon={<Ionicons name="lock-closed-outline" size={18} color={colors.textMuted} />} />

          <Button title={loading ? 'Creating account...' : 'Create Account'}
            onPress={handleRegister} loading={loading} fullWidth size="lg" style={{ marginTop: 8 }} />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.footerLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  topBand: { height: 200, position: 'absolute', top: 0, left: 0, right: 0 },
  container: { flex: 1 },
  backBtn: {
    marginTop: 56, marginLeft: 20, width: 38, height: 38, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  header: { padding: 20, paddingTop: 12 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#fff' },
  headerSub: { fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  card: {
    backgroundColor: colors.surface, borderRadius: 24,
    margin: 16, padding: spacing.screenPadding,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1, shadowRadius: 20, elevation: 8,
  },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  footerText: { fontSize: 14, color: colors.textSecondary },
  footerLink: { fontSize: 14, color: colors.primary, fontWeight: '700' },
});

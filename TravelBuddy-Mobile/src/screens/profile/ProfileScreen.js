import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LogOut, User as UserIcon } from 'lucide-react-native';
import { colors, spacing, typography, shadows } from '../../theme';
import { useAuthStore } from '../../store/authStore';
import api from '../../services/api';

export default function ProfileScreen() {
  const { user, logout, refreshToken } = useAuthStore();

  const handleLogout = async () => {
    try {
      // Ping the secure backend route we built to invalidate the refresh token locally in MongoDB!
      await api.post('/auth/logout', { token: refreshToken });
    } catch(e) {
      console.log('Backend logout failed, continuing local secure storage wipe');
    }
    
    // Instantly wipes AsyncStorage and rips down the AppNavigator back to AuthNavigator
    logout();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <UserIcon color={colors.primary} size={40} />
        </View>
        <Text style={styles.name}>{user?.firstName} {user?.lastName}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.7}>
        <LogOut color={colors.error} size={20} />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.xl },
  header: { alignItems: 'center', marginTop: spacing.xxl, marginBottom: spacing.xxl },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#FFF0F3', justifyContent: 'center', alignItems: 'center', marginBottom: spacing.md },
  name: { ...typography.header },
  email: { ...typography.body, color: colors.textLight, marginTop: 4 },
  logoutBtn: { flexDirection: 'row', backgroundColor: colors.surface, padding: spacing.md, borderRadius: 12, alignItems: 'center', justifyContent: 'center', ...shadows.card, borderWidth: 1, borderColor: colors.error + '30' },
  logoutText: { ...typography.title, color: colors.error, marginLeft: spacing.sm }
});

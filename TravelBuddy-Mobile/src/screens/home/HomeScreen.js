import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { MapPin, CalendarDays, UserPlus } from 'lucide-react-native';
import { colors, spacing, typography, shadows } from '../../theme';
import api from '../../services/api';

export default function HomeScreen() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Poll exactly when component mounts to find matching users based on dates and locations!
  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/matching'); // This touches backend /api/matching intelligently mapped via JWT token!
      setMatches(data);
    } catch (e) {
      console.log("No trips to match against yet!");
    } finally {
      setLoading(false);
    }
  };

  const sendConnectionRequest = async (recipientId) => {
    try {
      await api.post('/connections', { recipientId });
      Alert.alert('Sent!', 'Connection request blasted out to traveler successfully! 🚀');
    } catch (e) {
      Alert.alert('Whoops', e.response?.data?.message || 'Failed to send request');
    }
  };

  const renderMatch = ({ item }) => {
    const { matchedUser, matchDetails } = item;
    return (
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarInitial}>{matchedUser.firstName[0]}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.name}>{matchedUser.firstName} {matchedUser.lastName}</Text>
            <Text style={styles.matchScore}>✨ Perfect Match</Text>
          </View>
          <TouchableOpacity 
            style={styles.connectButton}
            onPress={() => sendConnectionRequest(matchedUser._id)}
          >
            <UserPlus color={colors.primary} size={20} />
          </TouchableOpacity>
        </View>

        <View style={styles.detailsDivider} />

        <View style={styles.detailsRow}>
          <MapPin color={colors.textLight} size={16} />
          <Text style={styles.detailText}>Going to {matchDetails.destination}</Text>
        </View>
        <View style={styles.detailsRow}>
          <CalendarDays color={colors.textLight} size={16} />
          <Text style={styles.detailText}>Identical overlapping travel dates!</Text>
        </View>
      </View>
    );
  };

  if (loading) return <View style={styles.centered}><ActivityIndicator color={colors.primary} size="large" /></View>;

  return (
    <View style={styles.container}>
      <FlatList
        data={matches}
        keyExtractor={(item, index) => item.matchedUser._id + index}
        renderItem={renderMatch}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No matches yet! 🏝️</Text>
            <Text style={styles.emptySub}>Jump over to the Trips tab and add an upcoming vacation log to discover other users heading to your specific destination!</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { padding: spacing.md },
  card: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 16,
    marginBottom: spacing.md,
    ...shadows.card,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  avatarPlaceholder: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center' },
  avatarInitial: { fontSize: 20, color: colors.text, fontWeight: '700' },
  userInfo: { flex: 1, marginLeft: spacing.sm },
  name: { ...typography.title },
  matchScore: { fontSize: 13, color: colors.success, fontWeight: '700', marginTop: 2 },
  connectButton: { padding: 10, backgroundColor: '#FFF0F3', borderRadius: 20 },
  detailsDivider: { height: 1, backgroundColor: colors.border, marginBottom: spacing.sm },
  detailsRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.xs, marginBottom: spacing.xs },
  detailText: { ...typography.body, color: colors.textLight, marginLeft: spacing.sm },
  emptyState: { alignItems: 'center', padding: spacing.xl, marginTop: spacing.xxl },
  emptyTitle: { ...typography.title, marginBottom: spacing.sm },
  emptySub: { ...typography.body, color: colors.textLight, textAlign: 'center', lineHeight: 22 }
});

import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { UserCheck, UserX } from 'lucide-react-native';
import { colors, spacing, typography, shadows } from '../../theme';
import { useAuthStore } from '../../store/authStore';
import api from '../../services/api';

export default function ChatListScreen({ navigation }) {
  const [incoming, setIncoming] = useState([]);
  const [connected, setConnected] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const myId = useAuthStore(state => state.user?._id);

  // Auto-refresh the inbox every time the user taps the Chat tab
  useFocusEffect(
    useCallback(() => {
      fetchConnections();
    }, [])
  );

  const fetchConnections = async () => {
    try {
      const { data } = await api.get('/connections');
      setIncoming(data.incoming || []);
      setConnected(data.connected || []);
    } catch (e) {
      console.log('Error fetching connections');
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (id, action) => {
    try {
      await api.put(`/connections/${id}`, { action });
      fetchConnections(); // Refresh lists instantly removing the pending card
    } catch (e) {
      Alert.alert('Error', 'Failed to update connection');
    }
  };

  const renderRequest = ({ item }) => (
    <View style={styles.requestCard}>
      <View style={styles.avatarPlaceholder}>
        <Text style={styles.avatarInitial}>{item.requesterId.firstName[0]}</Text>
      </View>
      <View style={{ flex: 1, marginLeft: spacing.sm }}>
        <Text style={styles.name}>{item.requesterId.firstName} {item.requesterId.lastName}</Text>
        <Text style={styles.subtitle}>Wants to travel with you!</Text>
      </View>
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => handleRequest(item._id, 'accept')}>
          <UserCheck color={colors.success} size={24} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.iconBtn, { marginLeft: 8 }]} onPress={() => handleRequest(item._id, 'reject')}>
          <UserX color={colors.error} size={24} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderConnected = ({ item }) => {
    // Intelligently find the 'other' user out of the connection mapping
    const otherUser = item.requesterId._id === myId ? item.recipientId : item.requesterId;
    
    return (
      <TouchableOpacity 
        style={styles.chatCard} 
        onPress={() => navigation.navigate('ChatRoom', { userId: otherUser._id, name: otherUser.firstName })}
        activeOpacity={0.7}
      >
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarInitial}>{otherUser.firstName[0]}</Text>
        </View>
        <View style={{ flex: 1, marginLeft: spacing.md }}>
          <Text style={styles.name}>{otherUser.firstName} {otherUser.lastName}</Text>
          <Text style={styles.subtitle}>Tap to start chatting 💬</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) return <View style={styles.centered}><ActivityIndicator color={colors.primary} size="large" /></View>;

  return (
    <View style={styles.container}>
      {incoming.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connection Requests ({incoming.length})</Text>
          <FlatList 
            data={incoming}
            keyExtractor={item => item._id}
            renderItem={renderRequest}
            scrollEnabled={false}
          />
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Direct Messages</Text>
        <FlatList 
          data={connected}
          keyExtractor={item => item._id}
          renderItem={renderConnected}
          ListEmptyComponent={<Text style={styles.emptyText}>No connected travel buddies yet. Head to Discover and send a request!</Text>}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  section: { padding: spacing.md },
  sectionTitle: { ...typography.title, marginBottom: spacing.sm, color: colors.textLight },
  requestCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, padding: spacing.md, borderRadius: 12, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.primary + '30' },
  chatCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, padding: spacing.md, borderRadius: 12, marginBottom: spacing.sm },
  avatarPlaceholder: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center' },
  avatarInitial: { fontSize: 20, color: colors.text, fontWeight: '700' },
  name: { ...typography.title, fontSize: 16 },
  subtitle: { ...typography.body, fontSize: 14, color: colors.textLight, marginTop: 2 },
  actionRow: { flexDirection: 'row' },
  iconBtn: { padding: 8, backgroundColor: colors.background, borderRadius: 20, ...shadows.card },
  emptyText: { ...typography.body, color: colors.textLight, textAlign: 'center', marginTop: spacing.xl, lineHeight: 22 }
});

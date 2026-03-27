import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Plus, MapPin, Trash2 } from 'lucide-react-native';
import { colors, spacing, typography, shadows } from '../../theme';
import api from '../../services/api';

export default function MemoriesScreen({ navigation }) {
  const [memories, setMemories] = useState([]);
  
  useFocusEffect(
    useCallback(() => {
      fetchMemories();
    }, [])
  );

  const fetchMemories = async () => {
    try {
      const { data } = await api.get('/memories');
      setMemories(data);
    } catch (e) {
      console.log('Error catching memories');
    }
  };

  const deleteMemory = async (id) => {
    try {
      await api.delete(`/memories/${id}`);
      setMemories((prev) => prev.filter(m => m._id !== id));
    } catch (e) {
      Alert.alert('Error', 'Could not delete memory');
    }
  }

  const renderMemory = ({ item }) => (
    <View style={styles.card}>
      {item.images && item.images.length > 0 && (
        <Image source={{ uri: item.images[0] }} style={styles.image} resizeMode="cover" />
      )}
      
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.place}>{item.place}</Text>
          <TouchableOpacity onPress={() => deleteMemory(item._id)} style={{ padding: 4 }}>
            <Trash2 color={colors.error} size={20} />
          </TouchableOpacity>
        </View>
        <View style={styles.dateRow}>
          <MapPin color={colors.textLight} size={16} />
          <Text style={styles.dateText}>
            {new Date(item.tripDate).toLocaleDateString()}
          </Text>
        </View>
        {item.description ? <Text style={styles.description}>{item.description}</Text> : null}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList 
        data={memories}
        keyExtractor={item => item._id}
        renderItem={renderMemory}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No Memories Yet 📸</Text>
            <Text style={styles.emptySub}>Capture your travel highlights and save them here forever.</Text>
          </View>
        }
      />
      
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('CreateMemory')}
        activeOpacity={0.8}
      >
        <Plus color="#FFF" size={32} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.md, paddingBottom: 100 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginBottom: spacing.xl,
    overflow: 'hidden',
    ...shadows.card,
  },
  image: { width: '100%', height: 200, backgroundColor: colors.border },
  cardContent: { padding: spacing.md },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  place: { ...typography.title },
  dateRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm, marginBottom: spacing.md },
  dateText: { ...typography.body, color: colors.textLight, marginLeft: spacing.sm, fontWeight: '600' },
  description: { ...typography.body, color: colors.textLight, lineHeight: 22 },
  fab: {
    position: 'absolute',
    bottom: spacing.xxl,
    right: spacing.xl,
    backgroundColor: colors.primary,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.card,
  },
  emptyState: { alignItems: 'center', padding: spacing.xl, marginTop: spacing.xxl },
  emptyTitle: { ...typography.title, marginBottom: spacing.sm },
  emptySub: { ...typography.body, color: colors.textLight, textAlign: 'center', lineHeight: 22 }
});

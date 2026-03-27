import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Plus, MapPin, Trash2 } from 'lucide-react-native';
import { colors, spacing, typography, shadows } from '../../theme';
import api from '../../services/api';

export default function TripsScreen({ navigation }) {
  const [trips, setTrips] = useState([]);
  
  // Refreshes the API data implicitly every single time the user clicks on this specific specific tab!
  useFocusEffect(
    useCallback(() => {
      fetchTrips();
    }, [])
  );

  const fetchTrips = async () => {
    try {
      const { data } = await api.get('/trips');
      setTrips(data);
    } catch (e) {
      console.log('Error catching trips', e);
    }
  };

  const deleteTrip = async (id) => {
    try {
      await api.delete(`/trips/${id}`);
      setTrips((prev) => prev.filter(t => t._id !== id));
    } catch (e) {
      Alert.alert('Error', 'Could not delete trip');
    }
  }

  const renderTrip = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.destination}>{item.destination}</Text>
        <TouchableOpacity onPress={() => deleteTrip(item._id)} style={{ padding: 4 }}>
          <Trash2 color={colors.error} size={20} />
        </TouchableOpacity>
      </View>
      <View style={styles.dateRow}>
        <MapPin color={colors.textLight} size={16} />
        <Text style={styles.dateText}>
          {new Date(item.startDate).toLocaleDateString()}  →  {new Date(item.endDate).toLocaleDateString()}
        </Text>
      </View>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList 
        data={trips}
        keyExtractor={item => item._id}
        renderItem={renderTrip}
        contentContainerStyle={styles.list}
      />
      
      {/* Floating Action Button exactly like AirBnb filters or Twitter compose */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('CreateTrip')}
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
    padding: spacing.md,
    borderRadius: 16,
    marginBottom: spacing.md,
    ...shadows.card,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  destination: { ...typography.title },
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
  }
});

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, typography, shadows } from '../../theme';
import api from '../../services/api';

export default function CreateTripScreen({ navigation }) {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');

  const submitTrip = async () => {
    if (!destination || !startDate || !endDate || !description) {
      Alert.alert('Missing fields', 'Please be specific so we can match you perfectly!');
      return;
    }
    
    try {
      // Direct pass required object mapping to Joi schemas on the backend!
      await api.post('/trips', { destination, startDate, endDate, description });
      
      // Successfully generated. Pop the modal and drop the user back onto their updated trips list!
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to create');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.content}>
        
        <View style={styles.card}>
          <TextInput 
             style={styles.input} 
             placeholder="Destination City (e.g. Paris)" 
             value={destination} 
             onChangeText={setDestination} 
          />
          <TextInput 
             style={styles.input} 
             placeholder="Start Date (YYYY-MM-DD)" 
             value={startDate} 
             onChangeText={setStartDate} 
          />
          <TextInput 
             style={styles.input} 
             placeholder="End Date (YYYY-MM-DD)" 
             value={endDate} 
             onChangeText={setEndDate} 
          />
          <TextInput 
             style={[styles.input, { borderBottomWidth: 0, height: 80 }]} 
             placeholder="Trip Description (E.g Backpacking through Europe! Let's meet up!)" 
             value={description} 
             onChangeText={setDescription} 
             multiline
          />
        </View>

        <TouchableOpacity onPress={submitTrip} activeOpacity={0.8}>
          <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.button} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <Text style={styles.buttonText}>Publish Trip</Text>
          </LinearGradient>
        </TouchableOpacity>
        
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, marginTop: spacing.xl },
  card: { backgroundColor: colors.surface, borderRadius: 12, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.xl, overflow: 'hidden' },
  input: { height: 56, paddingHorizontal: spacing.md, fontSize: 16, color: colors.text, borderBottomWidth: 1, borderBottomColor: colors.border },
  button: { height: 56, borderRadius: 12, justifyContent: 'center', alignItems: 'center', ...shadows.card },
  buttonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' }
});

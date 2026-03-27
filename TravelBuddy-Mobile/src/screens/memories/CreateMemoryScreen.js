import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, shadows } from '../../theme';
import api from '../../services/api';

export default function CreateMemoryScreen({ navigation }) {
  const [place, setPlace] = useState('');
  const [tripDate, setTripDate] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const submitMemory = async () => {
    if (!place || !tripDate) {
      Alert.alert('Missing fields', 'Place and Trip Date are strictly required fields!');
      return;
    }
    
    try {
      // Backend formally expects an images array of valid URIs
      const payload = {
        place,
        tripDate,
        description: description || undefined,
        images: imageUrl ? [imageUrl] : []
      };

      await api.post('/memories', payload);
      navigation.goBack();
      
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to safely store our memory.');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        
        <View style={styles.card}>
          <TextInput 
             style={styles.input} 
             placeholder="Place visited (e.g. The Louvre)" 
             value={place} 
             onChangeText={setPlace} 
          />
          <TextInput 
             style={styles.input} 
             placeholder="Date of visit (YYYY-MM-DD)" 
             value={tripDate} 
             onChangeText={setTripDate} 
          />
          <TextInput 
             style={styles.input} 
             placeholder="Image URL (Public link to photo)" 
             value={imageUrl} 
             onChangeText={setImageUrl} 
             autoCapitalize="none"
          />
          <TextInput 
             style={[styles.input, { borderBottomWidth: 0, height: 100 }]} 
             placeholder="What happened here? Document the exact highlight of the trip!" 
             value={description} 
             onChangeText={setDescription} 
             multiline
             textAlignVertical="top"
          />
        </View>

        <TouchableOpacity onPress={submitMemory} activeOpacity={0.8}>
          <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.button} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <Text style={styles.buttonText}>Save Memory Forever</Text>
          </LinearGradient>
        </TouchableOpacity>
        
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, marginTop: spacing.xl },
  card: { backgroundColor: colors.surface, borderRadius: 12, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.xl, overflow: 'hidden' },
  input: { minHeight: 56, paddingHorizontal: spacing.md, paddingVertical: 14, fontSize: 16, color: colors.text, borderBottomWidth: 1, borderBottomColor: colors.border },
  button: { height: 56, borderRadius: 12, justifyContent: 'center', alignItems: 'center', ...shadows.card },
  buttonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' }
});

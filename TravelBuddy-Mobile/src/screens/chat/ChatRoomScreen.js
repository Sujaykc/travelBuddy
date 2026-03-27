import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Send } from 'lucide-react-native';
import { colors, spacing, typography } from '../../theme';
import { useAuthStore } from '../../store/authStore';
import api from '../../services/api';

export default function ChatRoomScreen({ route, navigation }) {
  const { userId, name } = route.params;
  const myId = useAuthStore(state => state.user?._id);
  
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigation.setOptions({ title: name });
    fetchHistory();
    // Quick polling interval mimicking WebSockets for the MVP
    const interval = setInterval(fetchHistory, 3000); 
    return () => clearInterval(interval);
  }, []);

  const fetchHistory = async () => {
    try {
      const { data } = await api.get(`/chats/${userId}`);
      setMessages(data);
    } catch (e) {
      console.log('Error fetching chat');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!text.trim()) return;
    const tempText = text;
    setText(''); // clear input instantly
    
    // Optimistic UI update for hyper-speed typing experience
    const newMsg = { _id: Date.now().toString(), senderId: { _id: myId }, content: tempText, createdAt: new Date() };
    setMessages(prev => [...prev, newMsg]);

    try {
      await api.post('/chats', { receiverId: userId, content: tempText });
      fetchHistory();
    } catch (e) {
      console.log('Error sending');
    }
  };

  const renderMessage = ({ item }) => {
    const isMe = item.senderId._id === myId;
    return (
      <View style={[styles.bubbleWrap, isMe ? styles.myBubbleWrap : styles.theirBubbleWrap]}>
        <View style={[styles.bubble, isMe ? styles.myBubble : styles.theirBubble]}>
          <Text style={[styles.msgText, isMe ? styles.myMsgText : styles.theirMsgText]}>{item.content}</Text>
        </View>
      </View>
    );
  };

  if (loading) return <View style={styles.centered}><ActivityIndicator color={colors.primary} /></View>;

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container} keyboardVerticalOffset={90}>
      <FlatList 
        data={messages}
        keyExtractor={item => item._id}
        renderItem={renderMessage}
        contentContainerStyle={styles.list}
      />
      <View style={styles.inputRow}>
        <TextInput 
          style={styles.input} 
          placeholder="Type a message..." 
          value={text} 
          onChangeText={setText} 
          multiline
        />
        <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
          <Send color="#FFF" size={20} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: spacing.md, paddingBottom: spacing.xl },
  bubbleWrap: { width: '100%', marginBottom: spacing.sm },
  myBubbleWrap: { alignItems: 'flex-end' },
  theirBubbleWrap: { alignItems: 'flex-start' },
  bubble: { maxWidth: '80%', padding: 14, borderRadius: 20 },
  myBubble: { backgroundColor: colors.primary, borderBottomRightRadius: 4 },
  theirBubble: { backgroundColor: colors.surface, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: colors.border },
  msgText: { fontSize: 16, lineHeight: 22 },
  myMsgText: { color: '#FFF' },
  theirMsgText: { color: colors.text },
  inputRow: { flexDirection: 'row', padding: spacing.md, borderTopWidth: 1, borderTopColor: colors.border, alignItems: 'flex-end', backgroundColor: '#FFF' },
  input: { flex: 1, backgroundColor: colors.surface, borderRadius: 24, paddingHorizontal: spacing.md, paddingTop: 14, paddingBottom: 14, fontSize: 16, maxHeight: 120 },
  sendBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginLeft: spacing.sm, marginBottom: 2 }
});

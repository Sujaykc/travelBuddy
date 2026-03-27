import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Plane, MessageCircle, User, Camera } from 'lucide-react-native';
import { colors } from '../theme';

import HomeScreen from '../screens/home/HomeScreen';
import TripsScreen from '../screens/trips/TripsScreen';
import CreateTripScreen from '../screens/trips/CreateTripScreen';

import ChatListScreen from '../screens/chat/ChatListScreen';
import ChatRoomScreen from '../screens/chat/ChatRoomScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

import MemoriesScreen from '../screens/memories/MemoriesScreen';
import CreateMemoryScreen from '../screens/memories/CreateMemoryScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// 1. The core bottom navigation bar
function MobileTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '700' },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: { paddingBottom: 5, height: 60, borderTopColor: colors.border }
      }}
    >
      <Tab.Screen 
        name="Discover Matches" 
        component={HomeScreen} 
        options={{ tabBarIcon: ({ color }) => <Home color={color} size={24} /> }}
      />
      <Tab.Screen 
        name="My Trips" 
        component={TripsScreen} 
        options={{ tabBarIcon: ({ color }) => <Plane color={color} size={24} /> }}
      />
      <Tab.Screen 
        name="Inbox" 
        component={ChatListScreen} 
        options={{ tabBarIcon: ({ color }) => <MessageCircle color={color} size={24} /> }}
      />
      <Tab.Screen 
        name="Memories" 
        component={MemoriesScreen} 
        options={{ tabBarIcon: ({ color }) => <Camera color={color} size={24} /> }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ tabBarIcon: ({ color }) => <User color={color} size={24} /> }}
      />
    </Tab.Navigator>
  );
}

// 2. The Root App AppNavigator wrapped in a stack to allow modals to slide over!
export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BottomTabs" component={MobileTabs} />
      
      {/* Real-time specific room pushed as a Native View over the Bottom Tabs! */}
      <Stack.Screen 
        name="ChatRoom" 
        component={ChatRoomScreen} 
        options={{ headerShown: true, headerTintColor: colors.text }} 
      />
      
      {/* Full Screen Interactive Modal */}
      <Stack.Screen 
        name="CreateTrip" 
        component={CreateTripScreen} 
        options={{ 
          presentation: 'modal', 
          headerShown: true, 
          title: 'Plan an Adventure',
          headerTintColor: colors.text
        }} 
      />
      
      {/* Memories Photo Upload Modal */}
      <Stack.Screen 
        name="CreateMemory" 
        component={CreateMemoryScreen} 
        options={{ 
          presentation: 'modal', 
          headerShown: true, 
          title: 'Preserve Memory',
          headerTintColor: colors.text
        }} 
      />
    </Stack.Navigator>
  );
}

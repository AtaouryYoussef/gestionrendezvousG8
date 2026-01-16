import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AppointmentsScreen from '../screens/dashboard/AppointmentsScreen';
import ProfileScreen from '../screens/dashboard/ProfileScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const TabNavigator = () => (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Appointments') iconName = 'calendar';
          else if (route.name === 'Profile') iconName = 'person';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4F8EF7',
        tabBarInactiveTintColor: '#aaa',
        tabBarStyle: { backgroundColor: '#f7f9fc', borderTopWidth: 1, borderTopColor: '#e3e3e3' },
      })}
    >
      <Tab.Screen name="Appointments" component={AppointmentsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
);

export default TabNavigator;

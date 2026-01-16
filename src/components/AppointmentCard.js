import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const statusColors = {
  Pending: '#FFD700',
  Confirmed: '#4F8EF7',
};

const AppointmentCard = ({ service, date, time, status }) => (
  <View style={styles.card}>
    <View style={styles.row}>
      <Ionicons name="calendar" size={22} color="#4F8EF7" style={styles.icon} />
      <Text style={styles.service}>{service}</Text>
    </View>
    <View style={styles.row}>
      <Ionicons name="time" size={20} color="#4F8EF7" style={styles.icon} />
      <Text style={styles.text}>{date} at {time}</Text>
    </View>
    <View style={styles.statusRow}>
      <Text style={[styles.status, { backgroundColor: statusColors[status] || '#ccc' }]}>{status}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#4F8EF7',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  icon: {
    marginRight: 8,
  },
  service: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  text: {
    fontSize: 16,
    color: '#555',
  },
  statusRow: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
  status: {
    color: '#fff',
    fontWeight: 'bold',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    fontSize: 14,
    overflow: 'hidden',
  },
});

export default AppointmentCard;

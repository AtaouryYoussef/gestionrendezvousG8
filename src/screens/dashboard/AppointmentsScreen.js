import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Modal, StyleSheet, Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AppHeader from '../../components/AppHeader';
import AppointmentCard from '../../components/AppointmentCard';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import localDatabase from '../../services/localDatabase';
import { AuthContext } from '../../context/AuthContext';

const AppointmentsScreen = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ serviceName: '', date: '', time: '', status: '', id: null });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const fetchAppointments = async () => {
    setLoading(true);
    const data = await localDatabase.getUserAppointments(user.id);
    setAppointments(data);
    setLoading(false);
  };

  useEffect(() => {
    if (user) fetchAppointments();
  }, [user]);

  const handleAddOrUpdate = async () => {
    if (!form.serviceName || !form.date || !form.time || !form.status) return;
    if (editMode) {
      await localDatabase.updateAppointment(form.id, form);
    } else {
      await localDatabase.addAppointment({ ...form, userId: user.id });
    }
    setModalVisible(false);
    setForm({ serviceName: '', date: '', time: '', status: 'pending', id: null });
    setEditMode(false);
    fetchAppointments();
  };

  const handleEdit = (appointment) => {
    setForm(appointment);
    setEditMode(true);
    setModalVisible(true);
  };

  const handleDelete = (id) => {
    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to delete this appointment?')) {
        localDatabase.deleteAppointment(id)
          .then(() => {
            fetchAppointments();
            window.alert('Appointment deleted successfully.');
          })
          .catch(() => {
            window.alert('Failed to delete appointment.');
          });
      }
    } else {
      Alert.alert(
        'Delete Appointment',
        'Are you sure you want to delete this appointment?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: () => {
              localDatabase.deleteAppointment(id)
                .then(() => {
                  fetchAppointments();
                  Alert.alert('Deleted', 'Appointment deleted successfully.');
                })
                .catch(() => {
                  Alert.alert('Error', 'Failed to delete appointment.');
                });
            }
          },
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Appointments" icon="calendar" />
      <Text style={styles.welcome}>Hello, {user?.name || 'User'}!</Text>
      <CustomButton title="Add Appointment" onPress={() => setModalVisible(true)} />
      {loading ? (
        <ActivityIndicator size="large" color="#4F8EF7" style={{ marginTop: 32 }} />
      ) : appointments.length === 0 ? (
        <Text style={styles.empty}>No appointments booked yet.</Text>
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 8 }}>
              <AppointmentCard
                service={item.serviceName}
                date={item.date}
                time={item.time}
                status={item.status}
              />
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                <CustomButton title="Edit" style={{ width: 80, marginRight: 8 }} onPress={() => handleEdit(item)} />
                <CustomButton title="Delete" style={{ width: 80, backgroundColor: '#e74c3c' }} onPress={() => handleDelete(item.id)} />
              </View>
            </View>
          )}
          contentContainerStyle={{ padding: 16 }}
        />
      )}
      
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editMode ? 'Edit Appointment' : 'Add Appointment'}</Text>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Service Name</Text>
              <CustomInput
                placeholder="e.g. Academic Advising"
                value={form.serviceName}
                onChangeText={v => setForm(f => ({ ...f, serviceName: v }))}
                style={styles.input}
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Date</Text>
              <TouchableOpacity
                style={[styles.input, { padding: 16, backgroundColor: '#f7f9fc', borderRadius: 10, borderWidth: 1, borderColor: '#e3e3e3' }]}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={{ color: form.date ? '#333' : '#aaa' }}>
                  {form.date || 'Select Date'}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={form.date ? new Date(form.date) : new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) {
                      const dateStr = selectedDate.toISOString().split('T')[0];
                      setForm(f => ({ ...f, date: dateStr }));
                    }
                  }}
                />
              )}
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Time</Text>
              <TouchableOpacity
                style={[styles.input, { padding: 16, backgroundColor: '#f7f9fc', borderRadius: 10, borderWidth: 1, borderColor: '#e3e3e3' }]}
                onPress={() => setShowTimePicker(true)}
              >
                <Text style={{ color: form.time ? '#333' : '#aaa' }}>
                  {form.time || 'Select Time'}
                </Text>
              </TouchableOpacity>
              {showTimePicker && (
                <DateTimePicker
                  value={form.time ? new Date(`2000-01-01T${form.time}`) : new Date()}
                  mode="time"
                  display="default"
                  onChange={(event, selectedTime) => {
                    setShowTimePicker(false);
                    if (selectedTime) {
                      let hours = selectedTime.getHours();
                      const minutes = selectedTime.getMinutes().toString().padStart(2, '0');
                      const ampm = hours >= 12 ? 'PM' : 'AM';
                      hours = hours % 12 || 12;
                      const timeStr = `${hours}:${minutes} ${ampm}`;
                      setForm(f => ({ ...f, time: timeStr }));
                    }
                  }}
                />
              )}
            </View>
           
            <View style={styles.formGroup}>
              <Text style={styles.label}>Status</Text>
              <TouchableOpacity
                style={[styles.input, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}
                onPress={() => setForm(f => ({ ...f, status: f.status === 'Pending' ? 'Confirmed' : 'Pending' }))}
              >
                <Text>{form.status ? form.status : 'Choose Status'}</Text>
                <Text style={{ color: '#4F8EF7', fontWeight: 'bold' }}>{form.status === 'Pending' ? 'Switch to Confirmed' : 'Switch to Pending'}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalActions}>
              <CustomButton title={editMode ? 'Update' : 'Add'} onPress={handleAddOrUpdate} style={styles.actionBtn} />
              <CustomButton title="Cancel" style={[styles.actionBtn, { backgroundColor: '#aaa' }]} onPress={() => { setModalVisible(false); setEditMode(false); setForm({ serviceName: '', date: '', time: '', status: 'Pending', id: null }); }} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
       welcome: {
                fontSize: 18,
                color: '#4F8EF7',
                fontWeight: 'bold',
                margin: 16,
                textAlign: 'center',
              },
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
  },
  empty: {
    textAlign: 'center',
    color: '#aaa',
    fontSize: 16,
    marginTop: 48,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    shadowColor: '#4F8EF7',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4F8EF7',
    marginBottom: 16,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    color: '#4F8EF7',
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#f7f9fc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e3e3e3',
    paddingHorizontal: 10,
    fontSize: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  actionBtn: {
    flex: 1,
    marginHorizontal: 4,
  },
});

export default AppointmentsScreen;

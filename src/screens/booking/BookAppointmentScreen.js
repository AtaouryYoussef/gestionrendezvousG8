import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AppHeader from '../../components/AppHeader';
import CustomButton from '../../components/CustomButton';
import localDatabase from '../../services/localDatabase';
import { AuthContext } from '../../context/AuthContext';

const BookAppointmentScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      const data = await localDatabase.getServices();
      setServices(data);
      setLoading(false);
    };
    fetchServices();
  }, []);

  const handleBook = async () => {
    if (!selectedService || !date || !time) {
      Alert.alert('Missing Info', 'Please select service, date, and time.');
      return;
    }
    setBooking(true);
    const serviceObj = services.find(s => s.id === parseInt(selectedService));
    const appointment = {
      userId: user.id,
      serviceId: serviceObj.id,
      serviceName: serviceObj.name,
      date,
      time,
    };
    await localDatabase.addAppointment(appointment);
    setBooking(false);
    Alert.alert('Success', 'Appointment booked successfully!', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Book Appointment" icon="add-circle" />
      {loading ? (
        <ActivityIndicator size="large" color="#4F8EF7" style={{ marginTop: 32 }} />
      ) : (
        <View style={styles.form}>
          <Text style={styles.label}>Select Service</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedService}
              onValueChange={setSelectedService}
              style={styles.picker}
            >
              <Picker.Item label="Choose a service..." value="" />
              {services.map(service => (
                <Picker.Item key={service.id} label={service.name} value={service.id.toString()} />
              ))}
            </Picker>
          </View>
          <Text style={styles.label}>Date</Text>
          <CustomButton title="Pick Date" onPress={() => Alert.alert('Date Picker', 'Implement date picker here.')} />
          <Text style={styles.label}>Time</Text>
          <CustomButton title="Pick Time" onPress={() => Alert.alert('Time Picker', 'Implement time picker here.')} />
          <CustomButton title="Book Appointment" onPress={handleBook} loading={booking} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
  },
  form: {
    margin: 24,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#4F8EF7',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  label: {
    color: '#4F8EF7',
    fontWeight: '600',
    fontSize: 16,
    marginTop: 16,
  },
  pickerContainer: {
    backgroundColor: '#f7f9fc',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e3e3e3',
    marginVertical: 8,
  },
  picker: {
    height: 48,
    width: '100%',
  },
});

export default BookAppointmentScreen;

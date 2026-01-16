import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import AppHeader from '../../components/AppHeader';
import { AuthContext } from '../../context/AuthContext';
import { validateEmail, validatePassword, validateName } from '../../utils/validators';

const RegisterScreen = ({ navigation }) => {
  const { register } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!validateName(name)) {
      Alert.alert('Invalid Name', 'Name must be at least 2 characters.');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    if (!validatePassword(password)) {
      Alert.alert('Invalid Password', 'Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    const user = await register(name, email, password);
    setLoading(false);
    if (!user) {
      Alert.alert('Registration Failed', 'Email already exists.');
    } else {
      Alert.alert('Registration Successful', 'You can now login.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Register" icon="person-add" />
      <View style={styles.form}>
        <CustomInput
          icon="person"
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <CustomInput
          icon="mail"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <CustomInput
          icon="lock-closed"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <CustomButton title="Register" onPress={handleRegister} loading={loading} />
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
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
    marginTop: 48,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#4F8EF7',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  link: {
    color: '#4F8EF7',
    marginTop: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default RegisterScreen;

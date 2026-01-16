import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import AppHeader from '../../components/AppHeader';
import { AuthContext } from '../../context/AuthContext';

const LoginScreen = ({ navigation }) => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const user = await login(email, password);
    setLoading(false);
    if (!user) {
      Alert.alert('Login Failed', 'Invalid email or password');
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title="SmartQueue Login" icon="log-in" />
      <View style={styles.form}>
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
        <CustomButton title="Login" onPress={handleLogin} loading={loading} />
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>Don't have an account? Register</Text>
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

export default LoginScreen;

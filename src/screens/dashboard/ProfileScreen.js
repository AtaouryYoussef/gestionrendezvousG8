import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import AppHeader from '../../components/AppHeader';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { AuthContext } from '../../context/AuthContext';

const ProfileScreen = () => {
  const { user, editProfile, logout } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    const updated = await editProfile({ ...user, name, email });
    setLoading(false);
    if (updated) {
      Alert.alert('Profile Updated', 'Your profile has been updated.', [
        { text: 'OK', onPress: () => {
          setEditing(false);
        } }
      ]);
    } else {
      Alert.alert('Error', 'Could not update profile.');
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Profile" icon="person" />
      <View style={styles.content}>
        {editing ? (
          <>
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
            <CustomButton title="Save" onPress={handleSave} loading={loading} />
            <CustomButton title="Cancel" onPress={() => setEditing(false)} style={{ backgroundColor: '#aaa' }} />
          </>
        ) : (
          <>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.value}>{user?.name}</Text>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{user?.email}</Text>
            <CustomButton title="Edit Profile" onPress={() => setEditing(true)} />
            <CustomButton title="Logout" onPress={logout} style={{ backgroundColor: '#e74c3c' }} />
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
  },
  content: {
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
    color: '#aaa',
    fontSize: 14,
    marginTop: 12,
  },
  value: {
    color: '#333',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
});

export default ProfileScreen;

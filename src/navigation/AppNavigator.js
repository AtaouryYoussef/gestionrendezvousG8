import React, { useContext } from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';
import { AuthContext } from '../context/AuthContext';
import BookAppointmentScreen from '../screens/booking/BookAppointmentScreen';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { user } = useContext(AuthContext);

  return (
    <NavigationContainer>
      {user === undefined ? (
        <React.Fragment>
          <Text style={{margin: 40, color: 'red'}}>Navigation not rendering. Check AuthContext.</Text>
        </React.Fragment>
      ) : user ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={TabNavigator} />
          <Stack.Screen name="BookAppointment" component={BookAppointmentScreen} />
        </Stack.Navigator>
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;

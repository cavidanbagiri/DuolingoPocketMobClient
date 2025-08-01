import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useDispatch } from 'react-redux';

import AuthService from '../services/AuthService.js';

export default function ProfileScreen() {

  const dispatch = useDispatch();


  const logoutHandler = () => {
    dispatch(AuthService.userLogout());
    console.log('logout clicked')
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>👤 Profile</Text>
      <Button title="Logout" onPress={logoutHandler} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 24, fontWeight: 'bold' },
});

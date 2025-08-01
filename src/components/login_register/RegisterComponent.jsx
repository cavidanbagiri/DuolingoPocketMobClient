

import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';

import { useDispatch, useSelector } from 'react-redux';

import { ActivityIndicator } from 'react-native';


import AuthService from '../../services/AuthService.js';

import MsgBox from '../layouts/MsgBox';

import { setIsLoginErrorFalse, setIsLoginSuccessFalse } from '../../store/auth_store';

export default function RegisterComponent({setMode, onRegister }) {

  const dispatch = useDispatch();

  const { login_message, login_success, is_login_error, login_pending } = useSelector((state) => state.authSlice);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleRegister = () => {
    // Client-side validation
    if (!username.trim()) {
      Alert.alert('Validation Error', 'Username is required');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Validation Error', 'Password must be at least 8 characters');
      return;
    }

    dispatch(AuthService.register({ email, password, username }));
  };

   useEffect(() => {
    if (is_login_error) {
      setTimeout(() => {
        dispatch(setIsLoginErrorFalse());
      }, 2000);
    }
  }, [is_login_error]);

  useEffect(() => {
    if (login_success) {
      setTimeout(() => {
        dispatch(setIsLoginSuccessFalse());
        setMode('login');
      }, 1500);
    }
  }, [login_success]);


  return (
    <View >
      {
        (is_login_error || login_success) &&
        <MsgBox
        message={login_message}
        visible={login_success || is_login_error}
        type={login_success ? 'success' : 'error'}
      />
      }
      <TextInput
        placeholder="Username"
        style={styles.input}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Email"
        style={styles.input}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        onChangeText={setPassword}
        secureTextEntry
      />
    
        <TouchableOpacity
          style={[styles.button, login_pending && { backgroundColor: '#aaa' }]}
          onPress={handleRegister}
          disabled={login_pending}
        >
          {login_pending ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Register</Text>
          )}
        </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  input: { borderWidth: 1, borderRadius: 10, marginVertical: 10, padding: 10 },
  button: { backgroundColor: '#28a745', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});




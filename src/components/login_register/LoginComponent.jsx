import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

import { useDispatch, useSelector } from 'react-redux';

import { ActivityIndicator } from 'react-native';

import AuthService from '../../services/AuthService.js';

import MsgBox from '../layouts/MsgBox';

import { setIsLoginErrorFalse, setIsLoginSuccessFalse } from '../../store/auth_store';

export default function LoginComponent({ onLogin }) {

  const dispatch = useDispatch();

  const { login_message, login_success, is_login_error, login_pending } = useSelector((state) => state.authSlice);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');




  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleLogin = async () => {
    

    if (!validateEmail(email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Validation Error', 'Password must be at least 8 characters');
      return;
    }

    dispatch(AuthService.login({ email, password })); 
  };


    useEffect(() => {
      if (is_login_error) {
        setTimeout(() => {
          dispatch(setIsLoginErrorFalse());
        }, 500);
      }
    }, [is_login_error]);
  
    useEffect(() => {
      if (login_success) {
        setTimeout(() => {
          dispatch(setIsLoginSuccessFalse());
        }, 500);
      }
    }, [login_success]);

  return (

    <View>


     {
       (is_login_error || login_success) &&
        <MsgBox
        message={login_message}
        visible={login_success || is_login_error}
        type={login_success ? 'success' : 'error'}
        />
     }

      <TextInput placeholder="Email" style={styles.input} onChangeText={setEmail} />
      <TextInput placeholder="Password" style={styles.input} onChangeText={setPassword} secureTextEntry />
      
      <TouchableOpacity
        style={[styles.button, login_pending && { backgroundColor: '#aaa' }]}
        onPress={handleLogin}
        disabled={login_pending}
      >
        {login_pending ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>


    </View>
  
);
}

const styles = StyleSheet.create({
  input: { borderWidth: 1, borderRadius: 10, marginVertical: 10, padding: 10 },
  button: { backgroundColor: '#4A90E2', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});

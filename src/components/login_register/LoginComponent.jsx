import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';

import { useDispatch, useSelector } from 'react-redux';

import { ActivityIndicator } from 'react-native';

import AuthService from '../../services/AuthService.js';

import MsgBox from '../layouts/MsgBox';

import { setIsLoginErrorFalse, setIsLoginSuccessFalse } from '../../store/auth_store';


import Icon from 'react-native-vector-icons/MaterialIcons';


export default function LoginComponent({ onLogin }) {

  const dispatch = useDispatch();

  const { login_message, login_success, is_login_error, login_pending } = useSelector((state) => state.authSlice);

  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');

   const [email, setEmail] = useState('eng@gmail.com');
  const [password, setPassword] = useState('11111111');




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

      <Text
            style={{ fontFamily: 'IBMPlexSans-Regular' }}
            className='text-[50px] font-bold text-center mb-4 '>
            Sign In
          </Text>

      {/* Email Input with Icon */}
      <View className='flex flex-row items-center mt-5 w-full border border-gray-300 rounded-lg py-1 px-3'>
        <Icon name="mail-outline" size={20} color="#666" style={{ marginRight: 10 }} />
        <TextInput
          style={{ fontFamily: 'IBMPlexSans-Regular', flex: 1 }}
          className='text-lg font-medium'
          placeholder="Email"
          onChangeText={setEmail}
        />
      </View>

      {/* Password Input with Icon */}
      <View className='flex flex-row items-center mt-4 w-full border border-gray-300 rounded-lg py-1 px-3'>
        <Icon name="lock-outline" size={20} color="#666" style={{ marginRight: 10 }} />
        <TextInput
          style={{ fontFamily: 'IBMPlexSans-Regular', flex: 1 }}
          className='text-lg font-medium'
          placeholder="Password"
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>


      <TouchableOpacity
        // style={[styles.button, login_pending && { backgroundColor: '#aaa' }]}
        className='flex flex-row justify-center items-center mt-5 w-full bg-blue-600 py-5 px-4 rounded-lg '
        onPress={handleLogin}
        disabled={login_pending}
      >
        {login_pending ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={{ fontFamily: 'IBMPlexSans-Regular' }}
            className='text-white text-xl'>Login</Text>
        )}
      </TouchableOpacity>


    </View>

  );
}

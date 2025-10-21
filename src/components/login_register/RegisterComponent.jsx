

import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Feather from '@expo/vector-icons/Feather';

import { setIsLoginErrorFalse, setIsLoginSuccessFalse } from '../../store/auth_store';

import AuthService from '../../services/AuthService.js';

import MsgBox from '../layouts/MsgBox';

import LanguageModalComponent from '../home/LanguageModalComponent.jsx';

export default function RegisterComponent({ setMode, onRegister }) {

  const dispatch = useDispatch();

  const { login_message, login_success, is_login_error, login_pending } = useSelector((state) => state.authSlice);

  const [email, setEmail] = useState('temp2@gmail.com');
  const [password, setPassword] = useState('11111111');
  const [username, setUsername] = useState('temp2');
  const [confirm, setConfirm] = useState('11111111');

  const [nativeLanguage, setNativeLanguage] = useState('');

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };



  const handleRegister = () => {


    if (nativeLanguage === '') {
      Alert.alert('Validation Error', 'Native Language is required');
      return;
    }
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
    if (password !== confirm) {
      Alert.alert('Validation Error', 'Passwords do not match');
      return;
    }


    dispatch(AuthService.register({ email, password, username, native: nativeLanguage }));
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

    <View className='flex-1 justify-center items-center '>
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
        Register
      </Text>

      <LanguageModalComponent
        selectedLanguage={nativeLanguage}
        setSelectedLanguage={setNativeLanguage}
      />

      <View className='flex flex-row items-center mt-5 w-full border border-gray-300 rounded-lg  px-3'>
        <Feather name="user" size={20} color="#666" style={{ marginRight: 10 }} />
        <TextInput
          style={{ fontFamily: 'IBMPlexSans-Regular', flex: 1 }}
          className='text-lg font-medium'
          placeholder="Username"
          onChangeText={setUsername}
        />
      </View>

      <View className='flex flex-row items-center mt-5 w-full border border-gray-300 rounded-lg px-3'>
        <Icon name="mail-outline" size={20} color="#666" style={{ marginRight: 10 }} />
        <TextInput
          style={{ fontFamily: 'IBMPlexSans-Regular', flex: 1 }}
          className='text-lg font-medium'
          placeholder="Email"
          onChangeText={setEmail}
        />
      </View>

      <View className='flex flex-row items-center mt-5 w-full border border-gray-300 rounded-lg px-3'>
        <Feather name="lock" size={20} color="#666" style={{ marginRight: 10 }} />
        <TextInput
          style={{ fontFamily: 'IBMPlexSans-Regular', flex: 1 }}
          className='text-lg font-medium'
          placeholder="Password"
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <View className='flex flex-row items-center mt-5 w-full border border-gray-300 rounded-lg px-3'>
        <Feather name="lock" size={20} color="#666" style={{ marginRight: 10 }} />
        <TextInput
          style={{ fontFamily: 'IBMPlexSans-Regular', flex: 1 }}
          className='text-lg font-medium'
          placeholder="Confirm Password"
          onChangeText={setConfirm}
          secureTextEntry
        />
      </View>

      <TouchableOpacity
        className='flex flex-row justify-center items-center mt-5 w-full bg-blue-600 py-5 px-4 rounded-lg '
        onPress={handleRegister}
        disabled={login_pending}
      >
        {login_pending ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={{ fontFamily: 'IBMPlexSans-Regular' }}
            className='text-white text-xl'>Register</Text>
        )}
      </TouchableOpacity>

    </View>



  );
}

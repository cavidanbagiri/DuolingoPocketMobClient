import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

import LoginComponent from '../components/login_register/LoginComponent';
import RegisterComponent from '../components/login_register/RegisterComponent';


import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function LoginRegisterScreen({ onLogin }) {
  const [mode, setMode] = useState('login');

  return (

    <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        enableOnAndroid={true}
        extraScrollHeight={20}
        keyboardShouldPersistTaps="handled"
      >

        <View className='flex flex-1 justify-start p-8 bg-white '>

          <Image
            source={require('../../assets/login-register-image.jpg')}
            className='w-full h-1/3  mt-10'
            resizeMode="contain"
          />

          <Text
            style={{ fontFamily: 'IBMPlexSans-Regular' }}
            className='text-[32px] font-bold text-center mb-4 '>
            {mode === 'login' ? 'Sign In' : 'Register'}
          </Text>

          {mode === 'login' ? (
            <LoginComponent onLogin={onLogin} />
          ) : (
            <RegisterComponent setMode={setMode} onRegister={() => setMode('login')} />
          )}

          <TouchableOpacity onPress={() => setMode(mode === 'login' ? 'register' : 'login')}>
            <Text style={styles.toggle}>
              {mode === 'login'
                ? "Don't have an account? Register"
                : 'Already have an account? Login'}
            </Text>
          </TouchableOpacity>
        </View>

      </KeyboardAwareScrollView>



  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 30, justifyContent: 'center' },
  title: { fontSize: 34, fontWeight: 'bold', textAlign: 'center', marginBottom: 24 },
  toggle: { color: '#4A90E2', textAlign: 'center', marginTop: 16 },
});

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import LoginComponent from '../components/login_register/LoginComponent';
import RegisterComponent from '../components/login_register/RegisterComponent';

export default function LoginRegisterScreen({ onLogin }) {
  const [mode, setMode] = useState('login');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {mode === 'login' ? 'Login' : 'Register'}
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
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 34, fontWeight: 'bold', textAlign: 'center', marginBottom: 24 },
  toggle: { color: '#4A90E2', textAlign: 'center', marginTop: 16 },
});

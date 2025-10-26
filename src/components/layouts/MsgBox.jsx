

// import React, { useEffect, useRef } from 'react';
// import { Animated, Text, StyleSheet, View } from 'react-native';

// export default function MsgBox({ message, type = 'success', visible, duration = 3000 }) {
//   const slideAnim = useRef(new Animated.Value(-60)).current;

//   useEffect(() => {
//     if (visible) {
//       // Slide in
//       Animated.timing(slideAnim, {
//         toValue: 5,
//         duration: 400,
//         useNativeDriver: false,
//       }).start();

//       // Hide after delay
//       const timeout = setTimeout(() => {
//         Animated.timing(slideAnim, {
//           toValue: -60,
//           duration: 400,
//           useNativeDriver: false,
//         }).start();
//       }, duration);

//       return () => clearTimeout(timeout);
//     }
//   }, [visible]);

//   if (!visible) return null;

//   return (
//     <Animated.View style={[styles.box, {
//       top: slideAnim,
//       backgroundColor: type === 'success' ? '#28a745' : '#dc3545'
//     }]}>
//       <Text style={styles.text}>{message}</Text>
//     </Animated.View>
//   );
// }

// const styles = StyleSheet.create({
//   box: {
//     position: 'absolute',
//     left: 10,
//     right: 10,
//     top: 30,
//     padding: 15,
//     borderRadius: 10,
//     zIndex: 9999,
//     alignItems: 'center',
//     elevation: 4,
//   },
//   text: {
//     color: 'white',
//     fontWeight: 'bold',
//   }
// });


import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet, View } from 'react-native';

export default function MsgBox({ message, type = 'success', visible, duration = 3000 }) {
  const slideAnim = useRef(new Animated.Value(-60)).current;

  useEffect(() => {
    if (visible) {
      // Slide in to top: 30
      Animated.timing(slideAnim, {
        toValue: 50, // Changed from 5 to 30
        duration: 400,
        useNativeDriver: false,
      }).start();

      // Hide after delay
      const timeout = setTimeout(() => {
        Animated.timing(slideAnim, {
          toValue: -60,
          duration: 400,
          useNativeDriver: false,
        }).start();
      }, duration);

      return () => clearTimeout(timeout);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.box, {
      top: slideAnim, // This will animate between -60 and 30
      backgroundColor: type === 'success' ? '#28a745' : '#dc3545'
    }]}>
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  box: {
    position: 'absolute',
    left: 10,
    right: 10,
    // Remove top: 30 from here since we're controlling it with animation
    padding: 15,
    borderRadius: 10,
    zIndex: 9999,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  }
});
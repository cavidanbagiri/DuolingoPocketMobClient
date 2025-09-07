
import React from 'react';
import { View, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const CustomTabBar = ({ state, descriptors, navigation, word }) => {
  const { width } = useWindowDimensions();
  const numTabs = 5; 
  const tabWidth = width / numTabs;


  // Helper to render a tab
  const renderTab = (route, index) => {
    const { options } = descriptors[route.key];
    const label =
      options.tabBarLabel !== undefined
        ? options.tabBarLabel
        : options.title !== undefined
        ? options.title
        : route.name;

    const isFocused = state.index === index;

    const IconComponent = () => options.tabBarIcon?.({ color: isFocused ? '#3b82f6' : '#71717a', size: 26 }) || null;

    return (
      <TouchableOpacity
        key={route.key}
        onPress={() => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        }}
        style={styles.tabButton}
        accessibilityState={isFocused ? { selected: true } : {}}
        accessibilityLabel={options.tabBarAccessibilityLabel}
      >
        <View style={styles.iconContainer}>
          <IconComponent />
          {typeof label === 'string' && (
            <Text style={[styles.tabLabel, isFocused ? styles.tabLabelActive : null]}>
              {label}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Left: Home */}
      <View style={[styles.tab, { width: tabWidth }]}>
        {renderTab(state.routes[0], 0)}
      </View>

      {/* Left: Word */}
      <View style={[styles.tab, { width: tabWidth }]}>
        {renderTab(state.routes[1], 1)}
      </View>

      <View style={[styles.tab, { width: tabWidth }]} />

        {/* Absolute positioned FAB */}
        <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AIScreen')}
        activeOpacity={0.7}
        accessibilityLabel="Open AI Language Tutor"
        >
        <Ionicons name="sparkles" size={28} color="#fff" />
        </TouchableOpacity>

      {/* Right: Learned */}
      <View style={[styles.tab, { width: tabWidth }]}>
        {renderTab(state.routes[2], 2)}
      </View>

      {/* Right: Profile or Login */}
      <View style={[styles.tab, { width: tabWidth }]}>
        {state.routes[3] && renderTab(state.routes[3], 3)}
      </View>
    </View>
  );
};

// 👇 Add Text import
import { Text } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 10,
    paddingHorizontal: 0,
  },
  tab: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  tabButton: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 10,
    fontFamily: 'IBMPlexSans-Regular',
    color: '#71717a',
    marginTop: 4,
  },
  tabLabelActive: {
    color: '#3b82f6',
    fontFamily: 'IBMPlexSans-SemiBold',
  },

fab: {
    position: 'absolute', // Add this
    left: '50%', // Center horizontally
    top: -20, // Position from top (adjust this value)
    marginLeft: -30, // Half of width to truly center (60/2 = 30)
    backgroundColor: '#2563EB',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    // Remove marginBottom and transform from here
  },
});

export default CustomTabBar;
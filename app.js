import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  // 1. Create a variable to hold the current time
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  // 2. Setup a timer that updates the clock every single second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer); // Clean up the timer when done
  }, []);

  // 3. Show the clock on the screen
  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>AbuClock Dashboard</Text>
      <Text style={styles.clockDisplay}>{currentTime}</Text>
    </View>
  );
}

// 4. Make it look beautiful (Styles)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Sleek dark mode background
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 20,
    color: '#888888',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  clockDisplay: {
    fontSize: 55,
    fontWeight: 'bold',
    color: '#00E676', // Glowing neon green numbers
  },
});

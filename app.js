import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Platform, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function App() {
  // Current time state
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  
  // Alarm states
  const [alarmTime, setAlarmTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [isAlarmSet, setIsAlarmSet] = useState(false);

  // Updates the live clock face every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // What happens when the user picks a time on the clock wheel
  const onTimeChange = (event, selectedDate) => {
    setShowPicker(false); // Hide the picker wheel
    if (selectedDate) {
      setAlarmTime(selectedDate);
      setIsAlarmSet(true);
      
      // Show a quick alert confirming the alarm
      const formattedAlarm = selectedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      alert(`Alarm successfully set for ${formattedAlarm}!`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>AbuClock Dashboard</Text>
      <Text style={styles.clockDisplay}>{currentTime}</Text>

      <View style={styles.alarmSection}>
        {isAlarmSet ? (
          <Text style={styles.alarmStatus}>
            🔔 Alarm armed for: {alarmTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        ) : (
          <Text style={styles.alarmStatus}>🔕 No alarm set currently</Text>
        )}

        {/* Button to trigger the time picker wheel */}
        <Button 
          title="Set New Alarm" 
          color="#00E676" 
          onPress={() => setShowPicker(true)} 
        />
      </View>

      {/* The hidden Android/iOS native clock wheel */}
      {showPicker && (
        <DateTimePicker
          value={alarmTime}
          mode="time"
          is24Hour={false}
          display="default"
          onChange={onTimeChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 16,
    color: '#888888',
    marginBottom: 5,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  clockDisplay: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 40,
  },
  alarmSection: {
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    padding: 20,
    borderRadius: 15,
    width: '80%',
  },
  alarmStatus: {
    fontSize: 18,
    color: '#AAAAAA',
    marginBottom: 15,
    textAlign: 'center',
  },
});

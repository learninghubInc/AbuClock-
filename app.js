import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';

// Tells Android how to handle the alarm when the timer goes off
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,      // Show the message on screen
    shouldPlaySound: true,      // Ring out loud
    shouldVibrate: true,        // Buzz the phone
  }),
});

export default function App() {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [alarmTime, setAlarmTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [isAlarmSet, setIsAlarmSet] = useState(false);

  // Live clock display loop
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Request permission to ring the phone and schedule the alarm
  const scheduleAlarmNotification = async (targetDate) => {
    // 1. Ask the user for permission to make noise
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to send notifications is required for the alarm to work!');
      return;
    }

    // 2. Clear any old alarms so they don't overlap
    await Notifications.cancelAllScheduledNotificationsAsync();

    // 3. Hand the time over to Android's system scheduler
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "⏰ AbuClock Alarm!",
        body: "Time to wake up! Your alarm is ringing.",
        sound: true, 
      },
      trigger: {
        date: targetDate, // Fires at the exact selected date and time
      },
    });

    const formattedAlarm = targetDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    alert(`🎯 Alarm armed for ${formattedAlarm}!`);
  };

  const onTimeChange = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
      // If the picked time has already passed today, set it for tomorrow
      if (selectedDate < new Date()) {
        selectedDate.setDate(selectedDate.getDate() + 1);
      }
      setAlarmTime(selectedDate);
      setIsAlarmSet(true);
      scheduleAlarmNotification(selectedDate);
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

        <Button 
          title="Set New Alarm" 
          color="#00E676" 
          onPress={() => setShowPicker(true)} 
        />
      </View>

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
  container: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center' },
  titleText: { fontSize: 16, color: '#888888', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 2 },
  clockDisplay: { fontSize: 60, fontWeight: 'bold', color: '#ffffff', marginBottom: 40 },
  alarmSection: { alignItems: 'center', backgroundColor: '#1E1E1E', padding: 20, borderRadius: 15, width: '80%' },
  alarmStatus: { fontSize: 18, color: '#AAAAAA', marginBottom: 15, textAlign: 'center' },
});

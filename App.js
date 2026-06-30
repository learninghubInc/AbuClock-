import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';

// 🚨 FORCE ANDROID TO MAKE NOISE AND VIBRATE 🚨
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,  // Breaks through silence
    shouldVibrate: true,    // Forces physical vibration
  }),
});

export default function App() {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [alarmTime, setAlarmTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [isAlarmSet, setIsAlarmSet] = useState(false);

  useEffect(() => {
    // Set up a high-priority channel specifically for alarms so Android doesn't mute it
    async function setupAlarmChannel() {
      await Notifications.setNotificationChannelAsync('abuclock-alarm', {
        name: 'AbuClock Alarms',
        importance: Notifications.AndroidNotificationImportance.HIGH, // 🚨 Max importance
        sound: 'default', // Uses system default alarm tone
        vibrationPattern: [0, 250, 250, 250], // Continuous buzzing
        enableVibrate: true,
      });
    }
    setupAlarmChannel();

    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const scheduleAlarmNotification = async (targetDate) => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission required for the alarm to wake you up!');
      return;
    }

    await Notifications.cancelAllScheduledNotificationsAsync();

    // Schedule the high-priority alarm
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "⏰ AbuClock Alarm!",
        body: "Time to wake up! Your alarm is ringing out loud.",
        sound: true, 
      },
      trigger: {
        date: targetDate,
        channelId: 'abuclock-alarm', // 🚨 Links to our high-priority loud channel
      },
    });

    const formattedAlarm = targetDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    alert(`🎯 Alarm armed out loud for ${formattedAlarm}!`);
  };

  const onTimeChange = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
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
            🔔 Armed for: {alarmTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        ) : (
          <Text style={styles.alarmStatus}>🔕 No alarm active</Text>
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

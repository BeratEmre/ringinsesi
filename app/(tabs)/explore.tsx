import { useFocusEffect } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';

export default function TabTwoScreen() {
  const [currentUrl, setCurrentUrl] = useState('https://ringinsesi.com.tr/Press/Index');
      
  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      setCurrentUrl('https://ringinsesi.com.tr/Press/Index');
      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, [])

  );
      
  return (
    <SafeAreaView style={styles.container}>
      <WebView
        source={{ uri: currentUrl }}
        style={{ flex: 1 }}
      />
   </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 24,
    flex: 1,
  },
});

import React, { useState } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import { useFocusEffect } from 'expo-router';

export default function RankingScreen({  }) {
  const [currentUrl, setCurrentUrl] = useState('https://ringinsesi.com.tr/BoxerRanking/Index');

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      setCurrentUrl('https://ringinsesi.com.tr/BoxerRanking/Index');
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
        onNavigationStateChange={(navState) => setCurrentUrl(navState.url)} 
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

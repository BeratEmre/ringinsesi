import React, { useState } from 'react';
import { WebView } from 'react-native-webview';
import { useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

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
    <SafeAreaView  edges={['top', 'bottom']}>

      <WebView 
        source={{ uri: currentUrl }} 
        onNavigationStateChange={(navState) => setCurrentUrl(navState.url)} 
      />
   </SafeAreaView>
  );
}


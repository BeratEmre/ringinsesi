import { useFocusEffect } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

export default function HomeScreen() {
    const [currentUrl, setCurrentUrl] = useState('https://ringinsesi.com.tr/');
    
      useFocusEffect(
        React.useCallback(() => {
          // Do something when the screen is focused
          setCurrentUrl('https://ringinsesi.com.tr/');
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
            style={{ flex: 1 }}
        />
    </SafeAreaView>
    );
}


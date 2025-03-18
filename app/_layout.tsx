import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef, useState } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import WebView, { WebViewMessageEvent, WebViewNavigation } from 'react-native-webview';
import { SafeAreaView, View, StatusBar, BackHandler, Button, Alert, Platform } from 'react-native';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import Footer from './(tabs)/_footer';
import Constants from 'expo-constants';


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

//PushNotification için cihazdan izin istendi
// const registerForPushNotificationsAsync = async (token: string) => {
//   try {
//     const { status: existingStatus } = await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;

//     if (existingStatus !== 'granted') {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }

//     if (finalStatus !== 'granted') {
//       alert('Bildirim izni verilmedi!');
//       return;
//     }

//     var projectId = Constants.expoConfig?.extra?.eas?.projectId; // Expo EAS kullanıyorsan
//     // var projectId = Updates.manifest?.extra?.eas?.projectId;
//     // var projectId = "7c06c142-b9fe-4fb8-af22-3ce9d043397f";
//     if (projectId != null && projectId != '') {
//       var pushNotificationToken = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
//       // alert('Expo Push Token:'+ pushNotificationToken);
//       await sendTokenToBackend(pushNotificationToken, token);
//     }
//   } catch (error) {
//     alert('Bildirim kaydı sırasında hata:' + error);
//   }
// };

//Backende pushNotification tokenı gönder
// const sendTokenToBackend = async (token: string, apiToken: string) => {
//   try {
//     // alert('Token backend\'e gönderiliyor!');
//     const response = await axios.post('https://yatirim.fongogo.com/Device/InsertDevice', {
//       expoPushToken: token,
//       platform: Platform.OS,
//       model: Platform.OS === 'ios' ? 'iPhone' : 'Android Device',
//       apiToken: apiToken
//     });
//   } catch (error) {
//     alert('Token backend\'e gönderilirken hata oluştu:' + error);
//   }
// };



export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const webViewRef = useRef<WebView | null>(null);
  const [webViewUrl, setWebViewUrl] = useState('https://ringinsesi.com.tr');
  const [currentUrl, setCurrentUrl] = useState(webViewUrl);
  const allowedDomains: string[] = ['ringinsesi.com.tr'];

  
  useEffect(() => {
    console.log('onBackPress')
    const onBackPress = () => {
      if (webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      }
      return false;
    };

    BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    };
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const handleTabPress = (url: string) => {
    setWebViewUrl(url);
    // setCurrentUrl(url)    
    // webViewRef.current?.injectJavaScript(`window.location.href = '${url}';`);
  };

  const handleNavigationStateChange = (navState: WebViewNavigation) => {
    setCurrentUrl(navState.url);
  };

  const isAllowedUrl = (url?: string): boolean => {
    if (!url) return false; // URL tanımsızsa engelle

    try {
      const hostname = new URL(url).hostname.replace(/^www\./, ''); // www. kaldırılıyor
      return allowedDomains.includes(hostname);
    } catch (error) {
      return false; // Geçersiz URL olursa erişimi engelle
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
      <StatusBar backgroundColor="black" barStyle="light-content" />
      <WebView
        ref={webViewRef}
        source={{ uri: webViewUrl }}
        onNavigationStateChange={handleNavigationStateChange}
        style={{ flex: 1 }}
        onShouldStartLoadWithRequest={(request) => {
          if (isAllowedUrl(request?.url)) {
            return true; // İzin verilen URL
          } else {
            Alert.alert('Erişim Engellendi', 'Bu sayfaya erişim izni yok.');
            return false; // Engellenen URL
          }
        }}
      />
      <Footer handleTabPress={handleTabPress} currentUrl={currentUrl} />
    </SafeAreaView>
  );
}
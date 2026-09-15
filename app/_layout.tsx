
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import { useEffect, useRef, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

import WebView, {
  WebViewNavigation,
} from 'react-native-webview';

import Footer from './(tabs)/_footer';

import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';

import axios from 'axios';

import {
  SafeAreaView,
  StatusBar,
  BackHandler,
  Platform,
  Linking,
} from 'react-native';

import React from 'react';


// ----------------------------------------------------
// SPLASH
// ----------------------------------------------------

SplashScreen.preventAutoHideAsync();


// ----------------------------------------------------
// PUSH NOTIFICATION
// ----------------------------------------------------

const registerForPushNotificationsAsync = async () => {
  try {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } =
        await Notifications.requestPermissionsAsync();

      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return;
    }

    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId;

    if (projectId) {
      const token =
        (
          await Notifications.getExpoPushTokenAsync({
            projectId,
          })
        ).data;

      await sendTokenToBackend(token);
    }
  } catch (error) {
    console.error(
      'Push notification registration error:',
      error
    );
  }
};


// ----------------------------------------------------
// TOKEN BACKEND
// ----------------------------------------------------

const sendTokenToBackend = async (token: string) => {
  try {
    const pushRequest = {
      expoPushToken: token,
      platform: Platform.OS,
      model:
        Platform.OS === 'ios'
          ? 'iPhone'
          : 'Android Device',
    };

    await axios.post(
      'https://ringinsesi.com.tr/Device/InsertDevice',
      pushRequest
    );
  } catch (error) {
    console.error(
      'Push token backend error:',
      error
    );
  }
};


// ----------------------------------------------------
// ROOT
// ----------------------------------------------------

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const webViewRef = useRef<WebView | null>(null);

  const [webViewUrl, setWebViewUrl] = useState(
    'https://ringinsesi.com.tr'
  );

  const [currentUrl, setCurrentUrl] = useState(
    'https://ringinsesi.com.tr'
  );


  // --------------------------------------------------
  // BACK BUTTON
  // --------------------------------------------------

  useEffect(() => {
    const onBackPress = () => {
      if (webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      }

      return false;
    };

    const subscription =
      BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress
      );

    return () => {
      subscription.remove();
    };
  }, []);


  // --------------------------------------------------
  // PUSH
  // --------------------------------------------------

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);


  // --------------------------------------------------
  // SPLASH
  // --------------------------------------------------

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);


  if (!loaded) {
    return null;
  }


  // --------------------------------------------------
  // FOOTER
  // --------------------------------------------------

  const handleTabPress = (url: string) => {
    setWebViewUrl(url);
  };


  // --------------------------------------------------
  // NAVIGATION STATE
  // --------------------------------------------------

  const handleNavigationStateChange = (
    navState: WebViewNavigation
  ) => {
    setCurrentUrl(navState.url);
  };


  // --------------------------------------------------
  // INTERNAL URL
  // --------------------------------------------------

  const isInternalUrl = (url: string): boolean => {
    try {
      const parsedUrl = new URL(url);

      const hostname = parsedUrl.hostname
        .toLowerCase()
        .replace(/^www\./, '');

      return (
        hostname === 'ringinsesi.com.tr' ||
        hostname.endsWith('.ringinsesi.com.tr')
      );
    } catch {
      return false;
    }
  };


  // ----------------------------------------------------
  // INTENT URL PARSE (Android)
  // ----------------------------------------------------

  const parseAndroidIntentUrl = (url: string) => {
    // "intent://" ile "#Intent;" arasındaki kısım gerçek path+query
    const hashIndex = url.indexOf('#Intent;');
    const beforeHash = hashIndex >= 0 ? url.slice(0, hashIndex) : url;

    // Play Store paket id'si (varsa)
    const idMatch = beforeHash.match(/[?&]id=([^&]+)/i);
    const packageName = idMatch?.[1]
      ? decodeURIComponent(idMatch[1])
      : undefined;

    // Intent içindeki browser_fallback_url (varsa) — ;'ler URL encode
    // edilmemiş olabileceğinden ; karakterine kadar değil, önce
    // olası tek noktalı virgülü de encode edilmiş haliyle yakala
    const fallbackMatch = url.match(
      /S\.browser_fallback_url=([^;]+)/i
    );
    const fallbackUrl = fallbackMatch?.[1]
      ? decodeURIComponent(fallbackMatch[1])
      : undefined;

    return { packageName, fallbackUrl };
  };


  // ----------------------------------------------------
  // EXTERNAL URL
  // ----------------------------------------------------

  const openExternalUrl = async (url: string) => {
    try {

      // -----------------------------------------------
      // ANDROID INTENT URL -> HER ZAMAN TARAYICIYA YÖNLENDİR
      // -----------------------------------------------

      if (Platform.OS === 'android' && url.startsWith('intent://')) {
        console.log('Intent URL yakalandı:', url);

        const { packageName, fallbackUrl } =
          parseAndroidIntentUrl(url);

        // Öncelik: Play Store paket id'si varsa web sayfasını aç
        // (market:// yerine bilerek https:// kullanıyoruz,
        // böylece Play Store uygulaması yerine tarayıcıda açılır)
        const targetUrl = packageName
          ? `https://play.google.com/store/apps/details?id=${packageName}`
          : fallbackUrl;

        if (targetUrl) {
          console.log('Tarayıcıda açılıyor:', targetUrl);
          try {
            await Linking.openURL(targetUrl);
          } catch (e) {
            console.log('Tarayıcı linki açılamadı:', targetUrl, e);
          }
        } else {
          console.log('Intent URL çözülemedi, yok sayılıyor:', url);
        }

        return;
      }

      // -----------------------------------------------
      // NORMAL URL (http/https/tel/mailto/whatsapp vs.)
      // -----------------------------------------------

      try {
        await Linking.openURL(url);
      } catch (e) {
        console.log('URL açılamadı:', url, e);
      }

    } catch (error) {
      console.error('External URL opening error:', error);
    }
  };


  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: 'black',
        marginBottom: 40,
        marginTop: 25,
      }}
    >

      <StatusBar
        backgroundColor="black"
        barStyle="light-content"
      />


      <WebView
        ref={webViewRef}

        source={{
          uri: webViewUrl,
        }}

        style={{
          flex: 1,
        }}

        javaScriptEnabled={true}
        domStorageEnabled={true}

        thirdPartyCookiesEnabled={true}
        sharedCookiesEnabled={true}

        cacheEnabled={true}

        startInLoadingState={true}


        // ---------------------------------------------
        // NAVIGATION STATE
        // ---------------------------------------------

        onNavigationStateChange={
          handleNavigationStateChange
        }


        // ---------------------------------------------
        // LINK HANDLING
        // ---------------------------------------------

        onShouldStartLoadWithRequest={(request) => {

          const url = request.url;

          if (!url) {
            return false;
          }


          // -------------------------------------------
          // RINGIN SESİ
          // -------------------------------------------

          if (isInternalUrl(url)) {
            return true;
          }


          // -------------------------------------------
          // ANDROID INTENT
          // -------------------------------------------

          if (
            Platform.OS === 'android' &&
            url.startsWith('intent://')
          ) {

            openExternalUrl(url);

            return false;
          }


          // -------------------------------------------
          // TEL / MAIL / WHATSAPP ETC.
          // -------------------------------------------

          if (
            url.startsWith('tel:') ||
            url.startsWith('mailto:') ||
            url.startsWith('whatsapp:') ||
            url.startsWith('instagram:') ||
            url.startsWith('youtube:')
          ) {

            openExternalUrl(url);

            return false;
          }


          // -------------------------------------------
          // HTTP / HTTPS
          // -------------------------------------------

          if (
            url.startsWith('http://') ||
            url.startsWith('https://')
          ) {

            openExternalUrl(url);

            return false;
          }


          // -------------------------------------------
          // DİĞER
          // -------------------------------------------

          openExternalUrl(url);

          return false;
        }}


        // ---------------------------------------------
        // ERROR
        // ---------------------------------------------

        onError={(event) => {
          console.log(
            'WebView error:',
            event.nativeEvent
          );
        }}


        // ---------------------------------------------
        // HTTP ERROR
        // ---------------------------------------------

        onHttpError={(event) => {
          console.log(
            'WebView HTTP error:',
            event.nativeEvent.statusCode,
            event.nativeEvent.url
          );
        }}
      />


      <Footer
        handleTabPress={handleTabPress}
        currentUrl={currentUrl}
      />

    </SafeAreaView>
  );
}


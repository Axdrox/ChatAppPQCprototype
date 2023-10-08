//import 'react-native-gesture-handler'; //StackAPI
import { StatusBar } from 'expo-status-bar';
import { LogBox, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useState } from 'react';
import * as Font from 'expo-font'
import Navegador from './navegacion/Navegador';
import { Provider } from 'react-redux';
import { store } from './store/store';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

//LogBox.ignoreLogs(['AsyncStorage has been stracted']);

// Si se quiere forzar no guardar el token por consecuencia no pasa del login
//ReactNativeAsyncStorage.clear();

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsLoaded, setAppIsLoaded] = useState(false);

  useEffect(() => {

    const prepare = async () => {
      try {
        await Font.loadAsync({
          'black': require("./assets/fonts/Raleway/Raleway-Black.ttf"),
          'blackItalic': require("./assets/fonts/Raleway/Raleway-BlackItalic.ttf"),
          'bold': require("./assets/fonts/Raleway/Raleway-Bold.ttf"),
          'boldItalic': require("./assets/fonts/Raleway/Raleway-BoldItalic.ttf"),
          'extraBold': require("./assets/fonts/Raleway/Raleway-ExtraBold.ttf"),
          'extraBoldItalic': require("./assets/fonts/Raleway/Raleway-ExtraBoldItalic.ttf"),
          'extraLight': require("./assets/fonts/Raleway/Raleway-ExtraLight.ttf"),
          'extraLightItalic': require("./assets/fonts/Raleway/Raleway-ExtraLightItalic.ttf"),
          'italic': require("./assets/fonts/Raleway/Raleway-Italic.ttf"),
          'light': require("./assets/fonts/Raleway/Raleway-Light.ttf"),
          'lightItalic': require("./assets/fonts/Raleway/Raleway-LightItalic.ttf"),
          'medium': require("./assets/fonts/Raleway/Raleway-Medium.ttf"),
          'mediumItalic': require("./assets/fonts/Raleway/Raleway-MediumItalic.ttf"),
          'regular': require("./assets/fonts/Raleway/Raleway-Regular.ttf"),
          'semiBold': require("./assets/fonts/Raleway/Raleway-SemiBold.ttf"),
          'semiBoldItalic': require("./assets/fonts/Raleway/Raleway-SemiBoldItalic.ttf"),
          'thin': require("./assets/fonts/Raleway/Raleway-Thin.ttf"),
          'thinItalic': require("./assets/fonts/Raleway/Raleway-ThinItalic.ttf"),
        });
      }
      catch (error) {
        console.log.error();
      }
      finally {
        setAppIsLoaded(true);
      }
    };

    prepare();

  }, [])

  //Corre cada vez que cambia el layout
  const onLayout = useCallback(async () => {
    if (appIsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [appIsLoaded])

  if (!appIsLoaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <SafeAreaProvider style={styles.container} onLayout={onLayout}>
        <Navegador />
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  label: {
    color: 'black',
    fontSize: 18,
    fontFamily: "regular"
  }
});

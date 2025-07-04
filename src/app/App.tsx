
/**
  npx react-native run-android
 */
 
import { SafeAreaView, StatusBar, StyleSheet, Text, useColorScheme, View } from 'react-native';
import Calc from '../pages/calc/Calc';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

function Main() {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <Calc />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <Main />
    </SafeAreaProvider>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#444',
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
});



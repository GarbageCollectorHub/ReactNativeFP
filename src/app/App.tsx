/**
 * npx react-native run-android
 */

import {  BackHandler, Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';
import Calc from '../pages/calc/Calc';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import Game from '../pages/game/Game';
import { AppContext } from '../shared/context/AppContext';


type PageInfo = {   //    /calc/scientific/hyper?arg=1234&operation=exp
  slug: string,                 // calc
  pathParams: Array<string>,    // ["scientific", "hyper"]
  queryParams: object,          // [arg: 1234, operation: exp]
}


function App() {
  /* Навигация у мобильных приложениях 
  идея - ведение собственной истории перехода между "страничками"
  */
  const [page, setPage] = useState("game");
  const [history, setHistory] = useState([] as Array<string>);

  const navigate = (href:string) => {   // додавання до исторii поточноiноi сторiнки
    if(href === page) {                 // та перехiд на нову сторiНку
      return;
    }
    history.push(page);
    //console.log(history);
    setHistory(history);
    setPage(href);
  };

  const popRoute = () => {    // рух назад по iсторii (кнопка "<-") врод "backspace-а" BOMа
    //console.log(history);
    if(history.length > 0) {
      const page = history.pop() ?? "calc";
      setHistory(history);
      setPage(page);
    }
    else {
      BackHandler.exitApp();
    }
  };

  useEffect(() => {
    // перехоплюемо оброблення апартнои кнопки "назад"
    const listner = BackHandler.addEventListener('hardwareBackPress', () => {
      popRoute(); 
      return true;  // означае, шо подальша обробка не нужна
    });

    return () => {
      listner.remove();
    };
  }, []);

  return (<SafeAreaProvider>
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      {/* передемо navite   через контекст на все дочерние елементи */}
      <AppContext.Provider value={{navigate}}>
    
      <View style={styles.content}>
        { page == "calc" ? <Calc />
        : <Game /> 
        }
      </View>

      <View style={styles.bottomNav}>
        <Pressable onPress={() => navigate("calc")} style={styles.bottomNavItem}>
          <Text>Calc</Text>
        </Pressable>

        <Pressable onPress={() => navigate("game")} style={styles.bottomNavItem}>
          <Text>Game</Text>
        </Pressable>
      </View>

      </AppContext.Provider>
    </SafeAreaView>  
  </SafeAreaProvider>);
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#444",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%"
  },
  content: {
    flex: 1,
    width: "100%"
  },
  bottomNav: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    height: 50,
    width: "100%"
  },
  bottomNavItem: {
    borderColor: "gray",
    borderRadius: 5,
    borderWidth: 1,   
    padding: 5,  
  }
});

export default App;
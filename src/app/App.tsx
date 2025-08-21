import {  BackHandler, Image, Pressable, StyleSheet, View } from 'react-native';
import Calc from '../pages/calc/Calc';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import Game from '../pages/game/Game';
import { AppContext } from '../shared/context/AppContext';
import Auth from '../pages/auth/Auth';
import Rates from '../pages/rates/Rates';
import Chat from '../pages/chat/Chat';
import ModalData from '../shared/types/ModalData';
import ModalView from './ui/ModalView';
import User from '../shared/types/User';


/*

  npx react-native run-android

*/


type PageInfo = {   //    /calc/scientific/hyper?arg=1234&operation=exp
  slug: string,                 // calc
  pathParams: Array<string>,    // ["scientific", "hyper"]
  queryParams: object,          // [arg: 1234, operation: exp]
}


function App() {
  /* Навигация у мобильных приложениях 
  идея - ведение собственной истории перехода между "страничками"
  */




  const [page, setPage] = useState("auth");
  const [user, setUser] = useState(null as User|null);
  const [history, setHistory] = useState([] as Array<string>);

  const [isModalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState({message: ""} as ModalData);



  const request = (url:string , ini:any) => {
      if(url.startsWith('/')) {
        // url = "https://pv133od0.azurewebsites.net" + url;
        // url = "https://localhost:7224" + url;

        url = "https://garbagecollector.azurewebsites.net" + url;   
      }
      if(user != null) {
        if(typeof ini == 'undefined') {
          ini = {};
        }
        if(typeof ini.headers == 'undefined') {
          ini.headers = {};
        }
        if(typeof ini.headers['Authorization'] == 'undefined') {
          ini.headers['Authorization'] = "Bearer " + user; //.token;
        }
        ini.headers['Authentication-Control'] = "Mobile";
      }
  
      console.log('request', url, ini);
      return new Promise((resolve, reject) => {
        fetch(url, ini).then(r => r.json()).then(j => {
          if (j.status.isOk) {
            resolve(j.data);
          }
          else {
            console.error(j);
            reject(j);
          }
        });
      })
  }


  const navigate = (href:string) => {   // додавання до исторii поточноiноi сторiнки
    if(href === "-1") {
      popRoute();
      return;
    }
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

  const showModal = (data: ModalData) => {
    setModalData(data);
    setModalVisible(true);
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
      <AppContext.Provider value={{navigate, user, setUser, request, showModal}}>
    
      <ModalView 
        isModalVisible={isModalVisible} 
        setModalVisible={setModalVisible}
        modalData={modalData} 
      />

      <View style={styles.content}>
        {   page == "calc" ? <Calc />
          : page == "game" ? <Game /> 
          : page == "rates" ? <Rates />
          : page == "chat" ? <Chat />  
          : <Auth />
        }
      </View>

      <View style={styles.bottomNav}>
        <Pressable onPress={() => navigate("calc")} style={styles.bottomNavItem}>
          <Image source={require("../shared/assets/images/calc.png")} style={[styles.bottomNavImage, {width: 26,tintColor: "#eee"}]}/>
        </Pressable>

        <Pressable onPress={() => navigate("game")} style={styles.bottomNavItem}>
          <Image source={require("../shared/assets/images/game.jpg")} style={[styles.bottomNavImage, {width: 34}]}/>
        </Pressable>

        <Pressable onPress={() => navigate("auth")} style={styles.bottomNavItem}>
          <Image source={require("../shared/assets/images/auth.png")} style={[styles.bottomNavImage, {width: 30}]}/>
        </Pressable>
        
        <Pressable onPress={() => navigate("rates")} style={styles.bottomNavItem}>
          <Image source={require("../shared/assets/images/coin25.png")} style={[styles.bottomNavImage, {width: 34}]}/>
        </Pressable>

        <Pressable onPress={() => navigate("chat")} style={styles.bottomNavItem}>
          <Image source={require("../shared/assets/images/chat1.png")} style={[styles.bottomNavImage, {width: 34}]}/>
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
    marginTop: 2,   
    padding: 5,  
  },
  bottomNavImage: {
    height: 34,

  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#2ca0c1ff',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default App;
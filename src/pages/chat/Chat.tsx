import React, {useContext, useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, Pressable, View, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform} from 'react-native';
import { AppContext } from '../../shared/context/AppContext';
import ChatModel from './models/chatModel';
import ChatMessage from './types/ChatMessage';
import OtherMessage from './components/OtherMessage';
import MyMessage from './components/MyMessage';





export default function Chat() {
  const {navigate, user, showModal} = useContext(AppContext);
  const [messages, setMessages] = useState(ChatModel.instance.messages);
  const [messageText, setMessageText] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);

  const chatUrl = "https://chat.momentfor.fun/"

  useEffect(() => {
    if(user == null) {
      showModal({
        title: "Сommunicator",
        message: "Please log in to join the chat",
        positiveButtonText: "Log in",
        positiveButtonAction: () => navigate("auth"),
        negativeButtonText: "Cancel",
        negativeButtonAction: () => navigate("-1"),   // "-1" вернет на предыдущую страницу через history (в App navigate, poproute)    
        closeButtonAction: () => navigate("-1"),
      });
      }
  }, [user]);

  useEffect(() => {
    if(ChatModel.instance.messages.length === 0) {
      //setIsLoading(true);   // todo loader
      // console.log(`Loading data for ${date}`);
      fetch(chatUrl)   
      .then(r => r.json())
      .then(j => {
          console.log(`Loaded data`);    
          ChatModel.instance.messages = j.data;
          setMessages(j.data);  
          //setIsLoading(false);      
      });
      }
      else {
          console.log(`Used cache data.`);
      }

  }, []);

  const updateMessages = () => {
    fetch(chatUrl)   
    .then(r => r.json())
    .then(j => {
      // проверяем, есть ли новые сообщения через сравнение id
      let wasNew = false;
      for(let m of j.data) {
        if(typeof messages.find(e => e.id === m.id) == 'undefined') {
            // это новое сообщение, его нету в массиве messages
            messages.push(m);
            wasNew = true;
        }
      }
      // если были новые сообшения, обновляем состояние
      if(wasNew) {
        setMessages([...messages.sort((a,b) => 
          a.moment > b.moment ? 1
          : a.moment < b.moment ? -1 : 0)]);
      }    
      });
  };

  const messagePressed = (m: ChatMessage) => {
    setMessages([...messages]);
  };

  const onSendPressed = () => {
    // console.log(user?.nam, messageText);
    if(messageText.trim().length === 0) {
      showModal({
        title: "Сommunicator",
        message: "Please enter a message",
      });
      return;
    }
    // encodeURIComponent: кодирует символы, не разрешенные в URL, в %XX (hex-коды ASCII), чтобы их можно было безопасно отправить в x-www-form-urlencoded
    let data = `author=${encodeURIComponent(user!.nam)}&msg=${encodeURIComponent(messageText)}`;
    fetch(chatUrl, {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/x-www-form-urlencoded'
      },
      body: data
    }).then(r => {
      if(r.status == 201) {
        // обновлення перелiку повiдомлень
        updateMessages();
        setMessageText("");
      }
      else {
        r.json().then(console.error);
        showModal({
          title: "Communicator",
          message: "Sending error. Please try again later",
        });
      }
    })
  };
  
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container} >
      <View style={styles.chat}>
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={true}
          nestedScrollEnabled={true}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
        >
          {messages.map((m, i) => m.author === user?.nam
            ? <MyMessage key={m.id} message={m} onPress={messagePressed} /> 
            : <OtherMessage key={m.id} message={m} onPress={messagePressed} />)}       
        </ScrollView>
      </View>

      <View style={styles.inputRow}>
        <TextInput style={styles.textInput}
                value={messageText}
                onChangeText={setMessageText}
                multiline={true}
                numberOfLines={4}/>
        <TouchableOpacity style={styles.sendButton} onPress={onSendPressed}>
          <Text>&#10148;</Text>
        </TouchableOpacity>
      </View>
      <View style={{height:10}}></View>      
    </KeyboardAvoidingView>

  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0D1421",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  chat:{
    backgroundColor: "#1A2332",
    flex: 1,
  },
  sendButton: {
    backgroundColor: "#667eea",
    marginVertical: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    minWidth: 50,
    minHeight: 50,
    shadowColor: "#667eea",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginRight: 5,   // переделать
  },
  inputRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    height: 100,
    marginBottom: 20,
    borderTopWidth: 1,
    borderTopColor: "#2A3441",
    
  },
  textInput: {
    flex: 1,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    color: "#fff",
    backgroundColor: "#606060ff",
    margin: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,   
    textAlignVertical: "top",
    fontSize: 18,
    borderRadius: 10,
    },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#2ca0c1ff',
  },

  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});


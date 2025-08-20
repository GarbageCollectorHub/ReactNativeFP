import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, Text, Pressable, View, ScrollView} from 'react-native';
import { AppContext } from '../../shared/context/AppContext';
import ChatModel from './models/chatModel';
import ChatMessage from './types/ChatMessage';
import OtherMessage from './components/OtherMessage';
import MyMessage from './components/MyMessage';



export default function Chat() {
  const {navigate, user, showModal} = useContext(AppContext);
  const [messages, setMessages] = useState(ChatModel.instance.messages);


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
      //setIsLoading(true);
      // console.log(`Loading data for ${date}`);
      fetch("https://chat.momentfor.fun/")   
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

  const messagePressed = (m: ChatMessage) => {
    setMessages([...messages]);
  };

  
  return (
    <View>
      <ScrollView
        showsVerticalScrollIndicator={true}
        nestedScrollEnabled={true}
      >

        {messages.map((m, i) => i % 2 === 0
          ? <OtherMessage message={m} onPress={messagePressed} /> 
          : <MyMessage message={m} onPress={messagePressed} />)} 
          
      </ScrollView>        
    </View>

  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#2ca0c1ff',
  },

  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});


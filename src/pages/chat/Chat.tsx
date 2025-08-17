import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, Text, Pressable, View} from 'react-native';
import { AppContext } from '../../shared/context/AppContext';



export default function Chat() {
    const {navigate, user, showModal} = useContext(AppContext);

    useEffect(() => {
      if(user == null) {
        showModal({
          title: "Сommunicator",
          message: "Please log in to join the chat",
          positiveButtonText: "Log in",
          positiveButtonAction: () => navigate("auth"),
          negativeButtonText: "Cancel",
          negativeButtonAction: () => navigate("-1"),
          closeButtonAction: () => navigate("-1"),
        });
        }
    }, [user]);

    
    return (
    <View>   
        <Pressable
            style={[styles.button, styles.buttonOpen]}
            onPress={() => showModal({
                title: "Сommunicator",
                message: "Please log in to join the chat",
                positiveButtonText: "Log in",
                positiveButtonAction: () => navigate("auth"),
                negativeButtonText: "Cancel",
                negativeButtonAction: () => navigate("-1"),     // "-1" вернет на предыдущую страницу через history (в App navigate, poproute)     
                })}>
            <Text style={styles.textStyle}>Show Modal</Text>
        </Pressable>
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


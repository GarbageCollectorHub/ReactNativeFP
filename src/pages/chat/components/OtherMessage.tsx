import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ChatMessage from "../types/ChatMessage";
import { displayDate } from "../../../shared/services/chatDateHelper";



export default function OtherMessage({message, onPress}:{message:ChatMessage, onPress:(message:ChatMessage) => void }) {


    return (
    <TouchableOpacity 
        key={message.id} 
        style={styles.container}
        onPress={() => onPress(message)}
    >    
        <Text>{displayDate(message.moment)}</Text>
        <Text>{message.author}</Text>
        <Text>{message.text}</Text>
    </TouchableOpacity>
    );
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: "#ccccdd",
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 10,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        marginVertical: 10,
        marginLeft: 8,
        marginRight: 80,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {

    },
    textStyle:{

    },
     
});



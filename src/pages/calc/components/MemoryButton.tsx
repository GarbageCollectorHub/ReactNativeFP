import { StyleSheet, Text, TouchableHighlight } from "react-native";


type memoryButtonData = {
    title: string,
    type?: string,
    action: (title:string, type?:string) => any
}

export default function MemoryButton({title, type, action}: memoryButtonData){
    return (
    <TouchableHighlight 
        onPress={ () => action(title, type)} 
        style={styles.memoryButton} 
        underlayColor="#323232" 
        activeOpacity={1}
    >
         <Text style={styles.memoryButtonText}>{title} </Text>
    </TouchableHighlight>
    );
}

const styles = StyleSheet.create({
    memoryButton: {
        backgroundColor: "#202020",
        borderRadius: 7,
        flex: 1,
        margin: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    memoryButtonText: {
        color: "#ffffff",
        fontSize: 14,
    },

});
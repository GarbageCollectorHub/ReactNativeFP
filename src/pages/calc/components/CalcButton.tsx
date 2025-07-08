import { StyleSheet, Text, TextStyle, TouchableOpacity, useWindowDimensions } from "react-native";


type CalcButtonData = {
    title: string,
    type?: string,
    data?: string,
    textStyle?: TextStyle,
    action: (title:string, data?:string) => any
}

export default function CalcButton({title, type, data, action}: CalcButtonData) {
    return <TouchableOpacity 
        onPress={() => action(title, data)} 
        style={[styles.calcButton, (
            type=="digit" ? styles.digitButton
            : type=="equal" ? styles.equalButton
            : styles.operationButton
        )]}>
            <Text style={
                type=="equal" ? styles.callcEqualText
                : styles.calcButtonText
            }>{title}</Text>
    </TouchableOpacity>;
}


const styles = StyleSheet.create({
    calcButton: {
        borderRadius: 7,
        flex: 1,
        margin: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    calcButtonText: {
        color: "#ffffff",
        fontSize: 18,
    },
    callcEqualText: {
        color: "#323232",
        fontSize: 18,
    },
    operationButton: {
        backgroundColor: "#323232",
    },
    digitButton: {
        backgroundColor: "#3B3B3B",
    },
    equalButton: {
        backgroundColor: "#4CC2FF",
        
    }
});
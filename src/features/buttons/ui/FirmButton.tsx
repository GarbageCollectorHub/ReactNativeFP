import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { ButtonTypes } from "../model/ButtonTypes";

export default function FirmButton({type, action, title}: {type?: string, action: Function, title: string}) {
    if( typeof type === "undefined") {
        type = ButtonTypes.primary;
    }

    return <TouchableOpacity onPress={_ => action() } 
            style={[styles.button, (type === ButtonTypes.primary ?  styles.buttonPrimary : styles.buttonSecondary)]}>
                <Text style={styles.buttonText}>{title}</Text>
            </TouchableOpacity>
}


const styles = StyleSheet.create({
    button: {
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: "center",
        alignSelf: "center",
        marginTop: 10,
        width: "95%",
    },
    buttonPrimary: {
        backgroundColor: "#5d5aabff",
    },
    buttonSecondary: {
        backgroundColor: "#373654ff",
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    

});
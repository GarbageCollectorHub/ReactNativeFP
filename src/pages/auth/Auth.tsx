import { useState } from "react";
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native"
import FirmButton from "../../features/buttons/ui/FirmButton";
import { ButtonTypes } from "../../features/buttons/model/ButtonTypes";


export default function Auth() {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");

    const onEnterPress = () => {
        console.log(login, password);
    };

    const isFormValid = () => login.trim().length > 1 && password.trim().length > 2;

    return <View>
        <View style={styles.textHeader}>
            <Text>Sign In</Text>
        </View>
          
        <View style={styles.textInputContainer}>
            <Text style={styles.textInputTitle}>Login: </Text>
            <TextInput style={styles.textInput}           
                value={login}
                onChangeText={setLogin}/>
        </View>

        <View style={styles.textInputContainer}>
            <Text style={styles.textInputTitle}>Password: </Text>
            <TextInput style={styles.textInput}
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}/>
        </View>

        <FirmButton title="Enter" 
            type={isFormValid() ? ButtonTypes.primary : ButtonTypes.secondary}  
            action={isFormValid() ? onEnterPress : () => {}} 
        />   
    </View>;
}



const styles = StyleSheet.create({
    textInput: {
        borderColor: "#888",
        borderWidth: 2,
        margin: 10,
    },
    textInputContainer: {
        backgroundColor: "#555",
        borderColor: "#888",
        borderWidth: 2,
        borderRadius: 5,
        margin: 10,
    },
    textInputTitle: {
        color: "#eee",
        marginLeft: 10,
        marginTop: 10,
    },
    textHeader: {
        justifyContent: "center",
        alignItems: "center"
    },
    button: {
        backgroundColor: "#625fb7ff",
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: "center",
        alignSelf: "center",
        marginTop: 10,
        width: "95%",
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
});

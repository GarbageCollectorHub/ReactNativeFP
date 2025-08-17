import { useContext, useEffect, useState } from "react";
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native"
import FirmButton from "../../features/buttons/ui/FirmButton";
import { ButtonTypes } from "../../features/buttons/model/ButtonTypes";
import { AppContext } from "../../shared/context/AppContext";
import { Buffer } from 'buffer'
import CustomCheckbox from "../../features/buttons/ui/CustomCheckbox";
import RNFS from "react-native-fs";

export default function Auth() {
    const [login, setLogin] = useState("dwa");
    const [password, setPassword] = useState("dwa");
    const {request, user, setUser, showModal} = useContext(AppContext);  // AppContext
    const [userName, setUserName] = useState<null|string>(null);
    const [rememberMe, setRememberMe] = useState(false);

    const tokenFileName = "auth_token"


    useEffect(() => {
        // console.log("test log", {user});
        setUserName(user == null ? null
            : JSON.parse(Buffer.from(user.split('.')[1], 'base64').toString('utf-8')).nam);
            
    }, [user]);

    useEffect(() => {
        loadAuthToken();
    }, [])

    const onEnterPress = () => {
        if(login.length === 0) {
            showModal({
                title: "Authorization",
                message: "Enter login"
            });
            return;
        }
        if(password.length === 0) {
            showModal({
                title: "Authorization",
                message: "Enter password"
            });
            return;
        }

        request("/Cosmos/SignIn", {
            headers: {
                'Authorization': 'Basic ' +  Buffer.from(`${login}:${password}`, 'utf-8').toString('base64')
            }
        }).then((token) => {
            setUser(token);
            if(rememberMe) saveAuthToken(token);
        });
    };

    const saveAuthToken = async (user: string | null) => {
        if(!user) return;
        const path = RNFS.DocumentDirectoryPath + "/" + tokenFileName;
        await RNFS.writeFile(path, user, 'utf8');
    };

    const loadAuthToken = async () => {
        const path = RNFS.DocumentDirectoryPath + "/" + tokenFileName;
        const exist = await RNFS.exists(path);
        if(exist) {
            const token = await RNFS.readFile(path, 'utf8');
            setUser(token);
        }
    };

    const OnRequestPress = () => {
        request("/Cosmos/SignIn");
    };

    const OnExitPress = async () => {
        setUser(null);

        const path = RNFS.DocumentDirectoryPath + "/" + tokenFileName;
        const exist = await RNFS.exists(path);
        if(exist) {
            await RNFS.unlink(path);
        }
    };

    // 
    const isFormValid = () => login.trim().length > 1 && password.trim().length > 2;


    const anonView = () => <View>
        <View style={styles.textHeader}>
            <Text style={styles.textHeaderText}>Sign In</Text>
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
        
        <View style={styles.checkBoxContainer}>
            <CustomCheckbox
                checked={rememberMe}
                onPress={() => setRememberMe(!rememberMe)}
                label="Remember me"
            />
        </View>





        <FirmButton title="Enter" 
            type={isFormValid() ? ButtonTypes.primary : ButtonTypes.secondary}  
            action={onEnterPress} 
        />   
    </View>;


    const userView = () => <View>
        <Text>User Dashboard</Text>
        <Text>{userName ?? "NullUserName"}</Text>

        <FirmButton title="Request" 
            type={ButtonTypes.primary}  
            action={OnRequestPress} 
        />  
        <FirmButton title="Exit" 
            type={ButtonTypes.primary}  
            action={OnExitPress} 
        />  
    </View>;


    return user === null ? anonView() : userView();
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
        alignItems: "center",
    },
    textHeaderText: {
        fontSize:22,
        fontWeight: 400,
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
    checkBoxContainer: {
        alignItems: 'center',
        marginTop: 10,
    },



});

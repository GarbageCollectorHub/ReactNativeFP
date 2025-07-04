import { StyleSheet, Text,Pressable, TouchableOpacity, View, TextStyle, TouchableHighlight } from "react-native";


export default function Calc() {
const onButtonPress = (title:string) => {
    console.log(title);
};

    return( 
    <View style={styles.calcContainer}>
        <Text style={styles.title}>Калькулятор</Text>
        <Text style={styles.expression}>22 + 33 =</Text>
        <Text style={styles.result}>55</Text>

        <View style={styles.memoryButtonRow}>
            <MemoryButton title="MC" action={onButtonPress}/>
            <MemoryButton title="MR" action={onButtonPress}/>
            <MemoryButton title="M+" action={onButtonPress}/>
            <MemoryButton title={"M\u2212"} action={onButtonPress}/>
            <MemoryButton title="MS" action={onButtonPress}/>
            <MemoryButton title={"M\u02C7"} action={onButtonPress}/>
        </View>


        <View style={styles.calcButtonRow}>
            <CalcButton title="%"                              action={onButtonPress}/>
            <CalcButton title="CE" textStyle={{ fontSize: 16}} action={onButtonPress}/>
            <CalcButton title="C"  textStyle={{ fontSize: 16}} action={onButtonPress}/>
            <CalcButton title={"\u232B"} action={onButtonPress}/>
        </View>

        <View style={styles.calcButtonRow}>
            <CalcButton title={"\u215F\u{1D465}"} action={onButtonPress}/>
            <CalcButton title={"\u{1D465}\u00B2"} action={onButtonPress}/>
            <CalcButton title={"\u00B2\u221A\u{1D465}"} action={onButtonPress}/>
            <CalcButton title={"\u00f7"} textStyle={{ fontSize: 26}} action={onButtonPress}/>
            {/* <CalcButton title={"\u2797"} action={onButtonPress}/> */}
        </View>

        <View style={styles.calcButtonRow}>
            <CalcButton title="7" action={onButtonPress}/>
            <CalcButton title="8" action={onButtonPress}/>
            <CalcButton title="9" action={onButtonPress}/>
            <CalcButton title={"\u2715"} action={onButtonPress}/>
        </View>

        <View style={styles.calcButtonRow}>
            <CalcButton title="4" action={onButtonPress}/>
            <CalcButton title="5" action={onButtonPress}/>
            <CalcButton title="6" action={onButtonPress}/>
            <CalcButton title={"\uFF0D"} action={onButtonPress}/>
        </View>

        <View style={styles.calcButtonRow}>
            <CalcButton title="1" action={onButtonPress}/>
            <CalcButton title="2" action={onButtonPress}/>
            <CalcButton title="3" action={onButtonPress}/>
            <CalcButton title={"\uFF0B"} action={onButtonPress}/>
        </View>

        <View style={styles.calcButtonRow}>
            <CalcButton title={"\u207A\u2044\u208B"} action={onButtonPress}/>
            <CalcButton title="0" action={onButtonPress}/>
            <CalcButton title={"\uFF0E"} action={onButtonPress}/>
            <CalcButton title={"\uFF1D"} action={onButtonPress}/>
        </View>
        
    </View>)
    ;
}


type memoryButtonData = {
    title: string,
    type?: string,
    action: (title:string, type?:string) => any
}

function MemoryButton({title, type, action}: memoryButtonData){
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



type calcButtonData = {
    title: string,
    type?: string,
    textStyle?: TextStyle,
    action: (title:string, type?:string) => any
}

function CalcButton({title, type, textStyle, action}: calcButtonData) {
    return <TouchableOpacity onPress={() => action(title, type)} style={styles.calcButton}>
        <Text style={[styles.calcButtonText, textStyle]}>{title}</Text>
    </TouchableOpacity>;
}


const styles = StyleSheet.create({
    calcButton: {
        backgroundColor: "#323232",
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
    calcContainer: {
        backgroundColor: "#202020",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        //alignItems: "stretch",
        width: "100%",
    },
    title: {
        color: "#ffffff",
        margin: 10,
    },
    expression: {
        color: "#A6A6A6",
        textAlign: "right",
    },
    result: {
        color: "#ffffff",
        margin: 10,
        textAlign: "right",
        fontSize: 30,
        fontWeight: 700,
    },
    calcButtonRow: {
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row",
        flex: 1,
        paddingHorizontal: 3,

    },



    memoryButton: {
        backgroundColor: "#202020",
        borderRadius: 7,
        flex: 1,
        margin: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",

        // borderWidth: 1,
        // borderColor: "black",

    },
    memoryButtonText: {
        color: "#ffffff",
        fontSize: 14,
    },
    memoryButtonRow: {
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row",       
        paddingHorizontal: 3, 
        height: 45,
    }
});
import { StyleSheet, Text,Pressable, TouchableOpacity, View, TextStyle, TouchableHighlight, useWindowDimensions } from "react-native";
import CalcButton from "./components/CalcButton";
import { useState } from "react";
import MemoryButton from "./components/MemoryButton";


const maxResultDigits = 5;    // after its done, change to 20 or 19? 

export default function Calc() {
    const [result, setResult] = useState("0");
    const [expression, setExpression] = useState("");
    const [firstOperand, setFirstOperand] = useState<string | null>(null);
    const [secondOperand, setSecondOperand] = useState<string | null>(null);
    const [operation, setOperation] = useState<string | null>(null);
    const [isSecondOperand, setIsSecondOperand] = useState(false);  // флаг true - ввод второго операнда

    const {width, height} = useWindowDimensions();


    const calculate = (a: number, b: number, op: string): number => {
        switch (op) {
            case "add": return a + b;
            case "sub": return a - b;
            case "mult": return a * b;
            case "div": return b !== 0 ? a / b : NaN;     //change to Cannot divide by zero ?
            default: return b;
        }
    };

    const operationSymbol = (op: string): string => {
        switch (op) {
            case "add": return "+";
            case "sub": return "−";
            case "mult": return "×";
            case "div": return "÷";
            default: return "";
        }
    };


    const onOperationPress = (title:string, data?:string) => {
        switch(data) {
            case "backspace": if(result.length > 1) {
                setResult(result.substring(0, result.length -1 ));
            } 
            else  {
                setResult("0"); 
            } break;

            case "clear": 
                setResult("0"); 
                setExpression(""); 
                setFirstOperand(null);
                setSecondOperand(null); 
                setIsSecondOperand(false); 
                setOperation(null); 
                break;
            case "inverse": setResult( (1 / Number(result)).toString() ); break;

            case "add":
            case "sub":
            case "mult":
            case "div":
                if(firstOperand !== null && operation && !isSecondOperand) {
                    const a = parseFloat(firstOperand);
                    const b = parseFloat(result);
                    const res = calculate(a, b, operation);

                    setResult(res.toString());
                    setFirstOperand(res.toString());
                    setExpression(res + " " + title);
                } 
                else {
                    setFirstOperand(result);
                    setExpression(result + " " + title);
                }

                setOperation(data);
                setIsSecondOperand(true);
                break;
            case "equal":
                if(firstOperand && operation && secondOperand !== null) {
                    const a = parseFloat(firstOperand);
                    const b = parseFloat(secondOperand);
                    const res = calculate(a, b, operation);

                    setResult(res.toString());
                    setExpression(firstOperand + " " + operationSymbol(operation) + " " + secondOperand + " =");
                    setFirstOperand(null);
                    setSecondOperand(null);
                    setOperation(null);
                    setIsSecondOperand(false);
                }
                break;
        }
    };

    const onDigitPress = (title:string) => {
        // Проверяем кол-во цифр в резалте, если > чем maxDig то return.
        const digitCount = result.replace(/[^0-9]/g, "").length;
        if (digitCount >= maxResultDigits) {
            return;
        }
        if(result === "0" || isSecondOperand) {
            setResult(title);
            setIsSecondOperand(false);
            if (operation) {
                setSecondOperand(title);
            }
        } else {
            const newResult = result + title;
            setResult(newResult);
            if (operation) {
                setSecondOperand(newResult);
            }
        } 
        
        if (expression.endsWith("=")) {
            setExpression(title);
        } else if (isSecondOperand && operation) {
            setExpression(prev => prev + " " + title);
        } else {
            setExpression(prev => prev + title);
        }
    };


    const onDotPress = (title:string) => {
        if(!result.includes(".")) {
            setResult(result + ".");
        }
    };


    const onPmPress = (title:string) => {
        if(result.startsWith("-")) {
            setResult(result.substring(1));
        }
        else {
            setResult("-" + result);
        }
    };

    const portraitView = () => {
        return( 
            <View style={styles.calcContainer}>
                <Text style={styles.title}>Калькулятор</Text>
                <Text style={styles.expression}>{expression}</Text>
                <Text style={[styles.result, {fontSize: result.length < 20 ? styles.result.fontSize : styles.result.fontSize * 19 / result.length}]}>{result}</Text>

                <View style={styles.memoryButtonRow}>
                    <MemoryButton title="MC" action={onOperationPress}/>
                    <MemoryButton title="MR" action={onOperationPress}/>
                    <MemoryButton title="M+" action={onOperationPress}/>
                    <MemoryButton title={"M\u2212"} action={onOperationPress}/>
                    <MemoryButton title="MS" action={onOperationPress}/>
                    <MemoryButton title={"M\u02C7"} action={onOperationPress}/>
                </View>

                <View style={styles.calcButtonRow}>
                    <CalcButton title="%"                              action={onOperationPress}/>
                    <CalcButton title="CE" textStyle={{ fontSize: 16}} action={onOperationPress}/>
                    <CalcButton title="C"  textStyle={{ fontSize: 16}} action={onOperationPress} data="clear"/>
                    <CalcButton title={"\u232B"}                       action={onOperationPress} data="backspace"/>
                </View>

                <View style={styles.calcButtonRow}>
                    <CalcButton title={"\u215F\u{1D465}"}       action={onOperationPress} data="inverse" />
                    <CalcButton title={"\u{1D465}\u00B2"}       action={onOperationPress} data="square"/>
                    <CalcButton title={"\u00B2\u221A\u{1D465}"} action={onOperationPress} data="sqrt"/>
                    <CalcButton title={"\u00f7"} textStyle={{ fontSize: 25}} action={onOperationPress} data="div"/>

                </View>

                <View style={styles.calcButtonRow}>
                    <CalcButton title="7" type="digit" action={onDigitPress}/>
                    <CalcButton title="8" type="digit" action={onDigitPress}/>
                    <CalcButton title="9" type="digit" action={onDigitPress}/>
                    <CalcButton title={"\u2715"} action={onOperationPress} data="mult"/>
                </View>

                <View style={styles.calcButtonRow}>
                    <CalcButton title="4" type="digit" action={onDigitPress}/>
                    <CalcButton title="5" type="digit" action={onDigitPress}/>
                    <CalcButton title="6" type="digit" action={onDigitPress}/>
                    <CalcButton title={"\uFF0D"} action={onOperationPress} data="sub" />
                </View>

                <View style={styles.calcButtonRow}>
                    <CalcButton title="1" type="digit" action={onDigitPress}/>
                    <CalcButton title="2" type="digit" action={onDigitPress}/>
                    <CalcButton title="3" type="digit" action={onDigitPress}/>
                    <CalcButton title={"\uFF0B"}       action={onOperationPress} data="add"/>
                </View>

                <View style={styles.calcButtonRow}>
                    <CalcButton title={"\u207A\u2044\u208B"} type="digit" action={onPmPress}/>
                    <CalcButton title="0" type="digit" action={onDigitPress}/>
                    <CalcButton title={"\uFF0E"} type="digit" action={onDotPress}/>
                    <CalcButton title={"\uFF1D"} type="equal" action={onOperationPress} data="equal"/>
                </View>
                
            </View>);
    };

    const landscapeView = () => {
        return( 
            <View style={styles.calcContainer}>

                <View style={{display: "flex", flexDirection: "row", justifyContent: "center"}}>             
                    <View style={{flex: 2, display: "flex", flexDirection: "column"}}> 
                        <Text style={[styles.title, {margin: 0}]}>Калькулятор</Text>
                        <Text style={styles.expression}>22 + 33 =</Text>
                    </View>

                    <Text style={[styles.result, {flex : 3}]}>{result}</Text>
                </View>

                <View style={styles.memoryButtonRow}>
                    <MemoryButton title="MC" action={onOperationPress}/>
                    <MemoryButton title="MR" action={onOperationPress}/>
                    <MemoryButton title="M+" action={onOperationPress}/>
                    <MemoryButton title={"M\u2212"} action={onOperationPress}/>
                    <MemoryButton title="MS" action={onOperationPress}/>
                    <MemoryButton title={"M\u02C7"} action={onOperationPress}/>
                </View>

                <View style={styles.calcButtonRow}>
                    <CalcButton title="%"              action={onOperationPress}/>
                    <CalcButton title="7" type="digit" action={onDigitPress}/>
                    <CalcButton title="8" type="digit" action={onDigitPress}/>
                    <CalcButton title="9" type="digit" action={onDigitPress}/>
                    <CalcButton title={"\u00f7"} textStyle={{ fontSize: 26}} action={onOperationPress} data="div"/>
                    <CalcButton title={"\u232B"} action={onOperationPress} data="backspace"/>                
                </View>

                <View style={styles.calcButtonRow}>
                    <CalcButton title={"\u215F\u{1D465}"} action={onOperationPress} data="inverse"/>
                    <CalcButton title="4" type="digit" action={onDigitPress}/>
                    <CalcButton title="5" type="digit" action={onDigitPress}/>
                    <CalcButton title="6" type="digit" action={onDigitPress}/>
                    <CalcButton title={"\u2715"} action={onOperationPress} data="mul" />
                    <CalcButton title="C"  textStyle={{ fontSize: 16}} action={onOperationPress} data="clear"/>                  
                </View>

                <View style={styles.calcButtonRow}>
                    <CalcButton title={"\u{1D465}\u00B2"} action={onOperationPress} data="square"/>
                    <CalcButton title="1" type="digit" action={onDigitPress}/>
                    <CalcButton title="2" type="digit" action={onDigitPress}/>
                    <CalcButton title="3" type="digit" action={onDigitPress}/>
                    <CalcButton title={"\uFF0D"} action={onOperationPress} data="sub"/>
                    <CalcButton title="CE" textStyle={{ fontSize: 16}} action={onOperationPress} data="clearEntry"/>           
                </View>

                <View style={styles.calcButtonRow}>
                    <CalcButton title={"\u00B2\u221A\u{1D465}"} action={onOperationPress} data="sqrt"/>
                    <CalcButton title={"\u207A\u2044\u208B"} type="digit"    action={onPmPress}/>
                    <CalcButton title="0" type="digit" action={onDigitPress}/>
                    <CalcButton title={"\uFF0E"}    type="digit"    action={onDotPress}/>
                    <CalcButton title={"\uFF0B"}    action={onOperationPress} data="add"/>
                    <CalcButton title={"\uFF1D"}    type="equal"    action={onOperationPress}/>
                </View>
                
            </View>);
    };
    return width < height ? portraitView() : landscapeView();
}


const styles = StyleSheet.create({
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
        margin: 10,
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
    memoryButtonRow: {
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row",       
        paddingHorizontal: 3, 
        flex: 1,
        maxHeight: 40,
        minHeight: 40,
    }
});

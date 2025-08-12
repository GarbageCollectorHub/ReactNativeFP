import { StyleSheet, Text,Pressable, TouchableOpacity, View, TextStyle, TouchableHighlight, useWindowDimensions } from "react-native";
import CalcButton from "./components/CalcButton";
import { useRef, useState } from "react";
import MemoryButton from "./components/MemoryButton";
import CalcModel from "./models/calcModel";



const maxResultDigits = 19;

const calculate = (a: number, b: number, op: string): number => {
    switch (op) {
        case "add": return a + b;
        case "sub": return a - b;
        case "mul": return a * b;
        case "div": return b !== 0 ? a / b : NaN;     //change NaN to Cannot divide by zero ?
        default: return b;
    }
};

const operationSymbol = (op: string): string => {
    switch (op) {
        case "add": return "+";
        case "sub": return "−";
        case "mul": return "×";
        case "div": return "÷";
        default: return "";
    }
};


export default function Calc() {
    const [result, setResult] = useState(CalcModel.instance.result);
    const [expression, setExpression] = useState(CalcModel.instance.expression);
    const [firstOperand, setFirstOperand] = useState<number | null>(CalcModel.instance.firstOperand);
    const [secondOperand, setSecondOperand] = useState<number | null>(CalcModel.instance.secondOperand);
    const [operation, setOperation] = useState<string | null>(CalcModel.instance.operation);
    const [isSecondOperand, setIsSecondOperand] = useState(CalcModel.instance.isSecondOperand);  // флаг true - ввод второго операнда
    const lastOpAndOperandRef = useRef<{ op: string, val: number} | null>(CalcModel.instance.lastOpAndOperand);

    const {width, height} = useWindowDimensions();

    // Обёртки, чтобы обновлять и стейт, и модель одновременно
    const updateResult = (val: string) => {
        setResult(val);
        CalcModel.instance.result = val;
    };

    const updateExpression = (val: string | ((prev: string) => string)) => {
        setExpression(prev => {
            const newVal = typeof val === "function" ? val(prev) : val;
            CalcModel.instance.expression = newVal;
            return newVal;
        });
    };

    const updateFirstOperand = (val: number | null) => {
        setFirstOperand(val);
        CalcModel.instance.firstOperand = val;
    };

    const updateSecondOperand = (val: number | null) => {
        setSecondOperand(val);
        CalcModel.instance.secondOperand = val;
    };

    const updateOperation = (val: string | null) => {
        setOperation(val);
        CalcModel.instance.operation = val;
    };

    const updateIsSecondOperand = (val: boolean) => {
        setIsSecondOperand(val);
        CalcModel.instance.isSecondOperand = val;
    };

    const updateLastOpAndOperand = (val: { op: string, val: number } | null) => {
        lastOpAndOperandRef.current = val;
        CalcModel.instance.lastOpAndOperand = val;
    };



    const onOperationPress = (title:string, data?:string) => {
        switch(data) {
            case "backspace": if(result.length > 1) {
                updateResult(result.substring(0, result.length -1 ));
            } 
            else  {
                updateResult("0"); 
            } break;

            case "clear": 
                updateResult("0"); 
                updateExpression(""); 
                updateFirstOperand(null);
                updateSecondOperand(null); 
                updateIsSecondOperand(false); 
                updateOperation(null); 
                updateLastOpAndOperand(null);
                break;
            case "clearEntry":
                updateResult("0");
                updateIsSecondOperand(true);
                break;
            case "inverse": updateResult( (1 / Number(result)).toString() ); break;

            case "add":
            case "sub":
            case "mul":
            case "div":
                const b = Number(result);
                if(firstOperand !== null && operation && !isSecondOperand) {                 
                    const res = calculate(firstOperand, b, operation);

                    updateResult(res.toString());
                    updateFirstOperand(res);
                    updateExpression(res + " " + title);
                } 
                else {
                    updateFirstOperand(b);
                    updateSecondOperand(null);
                    updateLastOpAndOperand(null);
                    updateExpression(result + " " + title);
                }
                updateOperation(data);
                updateIsSecondOperand(true);
                break;    
            case "percent": 
                const currentValue = Number(result);         
                if (firstOperand !== null && operation) {
                    let percentValue;
                    if (operation === "add" || operation === "sub") {
                        percentValue = (firstOperand * currentValue) / 100;
                    } else {
                        percentValue = currentValue / 100;
                    }              
                    updateResult(percentValue.toString());
                    updateSecondOperand(percentValue);
                    updateIsSecondOperand(true);
                    updateExpression(firstOperand + " " + operationSymbol(operation) + " " + currentValue + "%");
                } else{
                    updateResult("0");
                    updateExpression("0");
                    updateIsSecondOperand(true);
                }
                break;
            
            case "square": {
                const val = Number(result);
                const sq = val * val;
                updateResult(sq.toString());
                updateExpression("sqr(" + val +")")
                updateIsSecondOperand(false);
                if (operation && isSecondOperand) updateSecondOperand(sq);
                else updateFirstOperand(sq);
                break;
            }
            case "sqrt": {
                const val = Number(result);
                if(val >=0) {
                    const sqrtResult = Math.sqrt(val);
                    updateResult(sqrtResult.toString());
                    updateExpression("√("+ val + ")")
                    updateIsSecondOperand(false);
                    if(operation && isSecondOperand) {
                        updateSecondOperand(sqrtResult)
                    }
                    else {
                        updateFirstOperand(sqrtResult);
                    }
                }
                else {
                    updateResult("Invalid input");     //<- TODO в етом резалте надо заблокировать кнопки операций до ввода нового числа.
                    updateExpression(""); 
                    updateIsSecondOperand(true);
                }
                break;
            }
            case "equal":
                if(firstOperand && operation && secondOperand !== null) {
                    const a = firstOperand;
                    const b = secondOperand;
                    const res = calculate(a, b, operation);

                    updateResult(res.toString());
                    updateExpression(firstOperand + " " + operationSymbol(operation) + " " + secondOperand + " =");
                    updateFirstOperand(null);
                    updateSecondOperand(null);
                    updateOperation(null);
                    updateIsSecondOperand(true);
                    updateLastOpAndOperand({ op: operation, val: b });
                }
                else if(lastOpAndOperandRef.current) {
                    const a = Number(result);
                    const b = lastOpAndOperandRef.current.val;
                    const op = lastOpAndOperandRef.current.op;
                    const res = calculate(a, b, op);

                    updateResult(res.toString());
                    updateExpression(a + " " + operationSymbol(op) + " " + b + " =");
                    updateFirstOperand(null);
                    updateSecondOperand(null);
                    updateOperation(null);
                    updateIsSecondOperand(true);
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
            updateResult(title);
            updateIsSecondOperand(false);
            if (operation) {
                updateSecondOperand(Number(title));
            }
        } else {
            const newResult = result + title;
            updateResult(newResult);
            if (operation) {
                updateSecondOperand(Number(newResult));
            }
        } 
        
        if (expression.endsWith("=")) {
            updateExpression(title);
        } else if (isSecondOperand && operation) {
            updateExpression(prev => prev + " " + title);
        } else {
            updateExpression(prev => prev + title);
        }
    };


    const onDotPress = (title:string) => {
        if(!result.includes(".")) {
            updateResult(result + ".");
        }
    };


    const onPmPress = (title:string) => {
        if(result.startsWith("-")) {
            updateResult(result.substring(1));
        }
        else {
            updateResult("-" + result);
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
                    <CalcButton title="%"                              action={onOperationPress} data="percent"/>
                    <CalcButton title="CE" textStyle={{ fontSize: 16}} action={onOperationPress} data="clearEntry"/>
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
                    <CalcButton title={"\u2715"} action={onOperationPress} data="mul"/>
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
                        <Text style={styles.expression}>{expression}</Text>
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
                    <CalcButton title="%"              action={onOperationPress} data="percent"/>
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
                    <CalcButton title={"\uFF1D"}    type="equal"    action={onOperationPress} data="equal"/>
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

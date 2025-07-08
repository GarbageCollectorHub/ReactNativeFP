import { useContext, useState } from "react";
import { Pressable, StyleSheet, Text, Touchable, TouchableWithoutFeedback, View } from "react-native";
import { AppContext } from "../../shared/context/AppContext";


type EventData = {
    x: number,
    y: number,
    t: number,   // t - это timestamp (время)
};

const distanceTreshold = 50;  // Порог срабатывания свайпу  (мин. растояние проведения)
const timeTreshhold = 500;    // Порог срабатывания свайпе (макс. время проведения)

export default function Game() {
    const {navigate} = useContext(AppContext);
    // swipes - жести провведення з обмеженням минимальних вiдстаней та швидкостей
    const [text, setText] = useState("Game");
    let startData: EventData|null = null;
    const detectSwipe = (finishData: EventData) => {
        if(startData === null) return;
        const dx = finishData.x - startData!.x;
        const dy = finishData.y - startData!.y;
        const dt = finishData.t - startData!.t;
        //console.log(dx,dy,dt);
        if(dt < timeTreshhold){
            if(Math.abs(dx) > Math.abs(dy)) {   // horizontal
                if(Math.abs(dx) > distanceTreshold) {
                    if(dx > 0) {
                        setText("Right");
                    }
                    else {
                        setText("Left");
                    }
                }
            }
            else {      // vertical
                if(Math.abs(dy) > distanceTreshold) {
                    if(dx > 0) {
                        setText("Down");
                    }
                    else {
                        setText("Up");
                    }
                }
            }
        }
    };

    return (
    <TouchableWithoutFeedback
        onPressIn={e => {startData = {
            x: e.nativeEvent.pageX,
            y: e.nativeEvent.pageY,
            t: e.nativeEvent.timestamp}}}
        onPressOut={e => detectSwipe({
            x: e.nativeEvent.pageX,
            y: e.nativeEvent.pageY,
            t: e.nativeEvent.timestamp          
        })}> 

        <View style={styles.container}>
            <Pressable onPress={() => navigate('calc')}>
                <Text>{text}</Text>
            </Pressable>
        </View>
    </TouchableWithoutFeedback>);
}


const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
});

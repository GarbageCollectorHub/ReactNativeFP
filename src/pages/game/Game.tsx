import { useContext, useEffect, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, Touchable, TouchableWithoutFeedback, useWindowDimensions, View } from "react-native";
import { AppContext } from "../../shared/context/AppContext";
import Orientation from "react-native-orientation-locker";
import RNFS from "react-native-fs";


// Библиотека для управления и блокировки (lock) ориентации экрана.
// npm i react-native-orientation-locker

// Библиотека для работы с файловой системой в React Native (чтение, запись, удаление и пр.).
// npm i react-native-fs






type EventData = {
    x: number,
    y: number,
    t: number,   // t - это timestamp (время)
};

type FieldState = {
    tiles: Array<number>,
    score: number,
    bestScore: number,
};

const distanceTreshold = 50;  // Порог срабатывания свайпу  (мин. растояние проведения)
const timeTreshhold = 500;    // Порог срабатывания свайпе (макс. время проведения)
const bestScoreFileName = '/best.score';
const N = 4;

let animValue = new Animated.Value(1);
const opacityValues = Array.from({length: 16}, () => new Animated.Value(1));
const scaleValues = Array.from({length: 16}, () => new Animated.Value(1));
const scoreAnimValue = new Animated.Value(1);

function tileBackground(tileValue: number) {
    return tileValue === 0 ? "#BDAFA2"
    : tileValue === 2      ? "#EEE3DB"
    : tileValue === 4      ? "#EEE1D0"
    : tileValue === 8      ? "#E8B486"
    : tileValue === 16     ? "#E79B73"
    : tileValue === 32     ? "#E4846E"
    : tileValue === 64     ? "#E26A51"
    : tileValue === 128    ? "#EDCF72"
    : tileValue === 256    ? "#EDCC61"
    : tileValue === 512    ? "#EDC850"
    : tileValue === 1024   ? "#EDC22E"
    : tileValue === 2048   ? "#E8B500"
    : tileValue === 4096   ? "#B784AB"
    : tileValue === 8192   ? "#A66BA1"
    : tileValue === 16384  ? "#AA60A6"
    : tileValue === 32768  ? "#9545A0"
                           : "#bbb";
}

function tileForeground(tileValue: number) {
    return tileValue === 0 ? "#BDAFA2"
    : tileValue === 2      ? "#746C63"
    : tileValue === 4      ? "#766E66"
    : tileValue === 8      ? "#FAF3EF"
    : tileValue === 16     ? "#FBF5F2"
    : tileValue === 32     ? "#FBF5F2"
    : tileValue === 64     ? "#FBF5F2"
    : tileValue === 128    ? "#FBF5F2"
    : tileValue === 256    ? "#FBF5F2"
    : tileValue === 512    ? "#FBF5F2"
    : tileValue === 1024   ? "#FBF5F2"
    : tileValue === 2048   ? "#FBF5F2"
    : tileValue === 4096   ? "#FBF5F2"
                           : "#FBF5F2";
}

const tilesCollapseAnimation = (collapsedIndexes: number[]) => {
    if(collapsedIndexes.length > 0) {
    Animated.parallel(collapsedIndexes.map(index => 
        Animated.sequence([
            Animated.timing(scaleValues[index], {
                toValue: 1.2,
                duration: 150,
                useNativeDriver: true,
            }),
            Animated.timing(scaleValues[index], {
                toValue: 1.0,
                duration: 150,
                useNativeDriver: true,
            })
        ])
    )).start();
}};

const textSwipeDirectionAnimation = () => {
    Animated.sequence([
        Animated.timing(animValue, {
            toValue: 0,
            duration: 20,
            useNativeDriver: true,
        }),
        Animated.timing(animValue, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        })
    ]).start();
};

const animateScoreChange = () => {
    Animated.sequence([
        Animated.timing(scoreAnimValue, {
            toValue: 1.6,
            duration: 100,
            useNativeDriver: true,
        }),
        Animated.spring(scoreAnimValue, {
            toValue: 1.0,
            friction: 3,
            tension: 100,
            useNativeDriver: true,
        })
    ]).start();
};

export default function Game() {
    const {width} = useWindowDimensions();
    const [score, setScore] = useState(0);
    const [bestScore, setBestScore] = useState(0);
    const [tiles, setTiles] = useState([
        0,    2,    4,     8,
        16,   32,   64,    128,
        256,  512,  1024,  2048,
        4096, 8192, 16384, 32768
    ]); 
    const [savedField, setSavedField] = useState(null as FieldState | null);

   
    useEffect(() => {
        loadBestScore();                                    // load score from file
        Orientation.lockToPortrait();                       // lock orientation 
        return () => Orientation.unlockAllOrientations();   // unlock on unmount
    }, []);

    useEffect( () => {
        if(score > bestScore) {
            setBestScore(score);
        }
    },[score]);

    useEffect( () => {
        saveBestScore();
    },[bestScore]);


    // save to file BestScore - RNFS write file (DocumentDirectoryPath - в root не нужно разрешение пользователя на доступ для сохранения файлов?)
    const saveBestScore = () => {
        const path = RNFS.DocumentDirectoryPath + bestScoreFileName;
        return RNFS.writeFile(path, bestScore.toString(), 'utf8');
    };
    
    // load from file (RNFS)
    const loadBestScore = () => {
        const path = RNFS.DocumentDirectoryPath + bestScoreFileName;
        return RNFS.readFile(path, 'utf8')
        .then(str => {
            setBestScore(Number(str));
        });
    };

    const saveTilesHistory = () => {
        setSavedField({
            tiles: [...tiles],
            score: score,
            bestScore: bestScore,
        });
    }

    const undoTilesHistory = () => {
        if(savedField === null) return;
        setTiles(savedField!.tiles);
        setScore(savedField!.score);
        setBestScore(savedField!.bestScore);

    };


    const tileFontSize = (tileValue: number) => {        // <-- перенести? 
        return tileValue < 10 ? width * 0.12
        : tileValue < 100     ? width * 0.1
        : tileValue < 1000    ? width * 0.08
        : tileValue < 1000    ? width * 0.07
                              : width * 0.06
;    }

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
                        if(canMoveRight()) {
                            saveTilesHistory();
                            moveRight();
                            setText("Right - OK");
                            spawnTile();
                            setTiles([...tiles]);
                            textSwipeDirectionAnimation();
                        }
                        else {
                            setText("Right - NO MOVE");
                            textSwipeDirectionAnimation();
                        }                       
                    }
                    else {
                        if( moveLeft() ) {
                            setText("Left - OK");
                            spawnTile();
                            setTiles([...tiles]);
                            textSwipeDirectionAnimation();
                        }
                        else {
                            setText("Left - NO MOVE");
                            textSwipeDirectionAnimation();
                        }   
                    }
                }
            }
            else {      // vertical
                if(Math.abs(dy) > distanceTreshold) {
                    if(dy > 0) {
                        if(moveDown()) {
                            setText("Down - OK");
                            spawnTile();
                            setTiles([...tiles])
                            textSwipeDirectionAnimation();
                        }
                        else {
                            setText("Down - NO MOVE");
                            textSwipeDirectionAnimation();
                        }        
                    }
                    else {
                        if(moveUp()) {
                            setText("Up - OK");
                            spawnTile();
                            setTiles([...tiles])
                            textSwipeDirectionAnimation();
                        }
                        else {
                            setText("Up - NO MOVE");
                        }
                        
                    }
                }
            }
        }
    };

    const spawnTile = () => {
        let freeTiles = [];
        for(let i = 0; i < tiles.length; i+=1) {
            if(tiles[i] === 0) {
                freeTiles.push(i);
            }
        }
        const randomIndex = freeTiles[Math.floor(Math.random() * freeTiles.length)];
        tiles[randomIndex] = Math.random() < 0.9 ? 2 : 4;
        Animated.sequence([
            Animated.timing(opacityValues[randomIndex], {
                toValue: 0,
                duration: 20,
                useNativeDriver: true,
            }),
            Animated.timing(opacityValues[randomIndex], {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            })
        ]).start();
    };

    const newGame =  () => {
        for(let i = 0; i < tiles.length; i+=1) {
            tiles[i] = 0;
        }
        setScore(0);
        spawnTile();
        spawnTile();
        setTiles([...tiles]);
    };


    const canMoveRight = () => {
        for(let r = 0; r < N; r += 1) {         // row index
            for(let c = 1; c < N; c += 1 ) {    // column index
                if( tiles[r*N + c - 1] != 0 && (
                    tiles[r*N + c - 1] == tiles[r*N + c] || tiles[r*N + c] == 0 )
                ) {
                    return true;
                }              
            }
        }
        return false;
    };
    
    const moveRight = () => {
        //  [2000]  ->  [0002]
        //  [0204]  ->  [0024]
        //  [2002]  -> (0022) -> [0004]
        //  [0222]  -> (0204) -> [0024]
        //  [2222]  -> (0404) -> [0044]      
        // let res = false;
        let collapsedIndexes = [];

        for(let r = 0; r < N; r += 1) {       // row index                     // [2400]
            // 1. Move right
            for(let i = 1; i < N; i += 1) {                                    //
                for(let c = 0; c < N - 1; c += 1 ) {  // column index          //
                    if( tiles[r*N + c] != 0 && tiles[r*N + c + 1] == 0 ) {     // [2040] [2004]
                        tiles[r*N + c + 1] = tiles[r*N + c];                   // [0204] [0024]
                        tiles[r*N + c] = 0;
                    }
                }
            }
            // 2. Collapse: from right to left
            for(let c = N - 1; c > 0; c -= 1 ) {
                if( tiles[r*N + c] != 0 && tiles[r*N + c - 1] == tiles[r*N + c] ) {
                    tiles[r*N + c] *= 2;
                    tiles[r*N + c - 1] = 0;
                    setScore(score + tiles[r*N + c]);
                    animateScoreChange();
                    collapsedIndexes.push(r*N + c)
                }
            }
            // 3. Move right after collapse
            for(let i = 1; i < N; i += 1) {
                for(let c = 0; c < N - 1; c += 1 ) {
                    if( tiles[r*N + c] != 0 && tiles[r*N + c + 1] == 0 ) {
                        let index = collapsedIndexes.indexOf(r*N + c);
                        tiles[r*N + c + 1] = tiles[r*N + c];              
                        tiles[r*N + c] = 0;  
                        collapsedIndexes[index] = r*N + c + 1;                            
                    }
                }
            }
        }
        tilesCollapseAnimation(collapsedIndexes);
    };


    const moveLeft = () => {
        const N = 4;
        let res = false;
        let collapsedIndexes = [];

        for(let r = 0; r < N; r += 1) {
            // 1. Move Left
            for(let i = 1; i < N; i += 1) {
                for(let c = 0; c < N - 1; c += 1 ) {
                    if( tiles[r*N + c + 1] != 0 && tiles[r*N + c] == 0 ) {
                        tiles[r*N + c] = tiles[r*N + c + 1];
                        tiles[r*N + c + 1] = 0;
                        res = true;
                    }
                }
            }
            // 2. Collapse: from left to right
            for(let c = 0; c < N -1 ; c += 1 ) {
                if( tiles[r*N + c] != 0 && tiles[r*N + c + 1] == tiles[r*N + c] ) {
                    tiles[r*N + c] *= 2;
                    tiles[r*N + c + 1] = 0;
                    setScore(score + tiles[r*N + c]);
                    animateScoreChange();
                    collapsedIndexes.push(r * N + c);
                    res = true;
                }
            }
            // 3. Move Left after collapse
            for(let i = 1; i < N; i += 1) {
                for(let c = 0; c < N - 1; c += 1 ) {
                    if( tiles[r*N + c + 1] != 0 && tiles[r*N + c] == 0 ) {
                        tiles[r*N + c] = tiles[r*N + c + 1];              
                        tiles[r*N + c + 1] = 0;                              
                    }
                }
            }
        }
        tilesCollapseAnimation(collapsedIndexes);
        return res;
    };

    const moveDown = () => {
        const N = 4;
        let res = false;
        let collapsedIndexes = [];

        for(let c = 0; c < N; c += 1) {
            // 1. Move Down
            for(let i = 1; i < N; i += 1) {
                for(let r = 0; r < N - 1; r += 1 ) {
                    if( tiles[r*N + c] != 0 && tiles[r*N + c + N] == 0 ) {
                        tiles[r*N + c + N] = tiles[r*N + c];
                        tiles[r*N + c] = 0;
                        res = true;
                    }
                }
            }
            // 2. Collapse: from top to bottom
            for(let r = N - 1; r > 0; r -= 1 ) {
                if( tiles[r*N + c] != 0 && tiles[r*N + c] == tiles[r*N + c - N] ) {
                    tiles[r*N + c] *= 2;
                    tiles[r*N + c - N] = 0;
                    setScore(score + tiles[r*N + c]);
                    animateScoreChange();
                    collapsedIndexes.push(r*N + c)
                    res = true;
                }
            }
            // 3. Move down after collapse
            for(let i = 1; i < N; i += 1) {
                for(let r = 0; r < N - 1; r += 1 ) {
                    if( tiles[r*N + c] != 0 && tiles[r*N + c + N] == 0 ) {
                        let index = collapsedIndexes.indexOf(r*N + c);
                        tiles[r*N + c + N] = tiles[r*N + c];              
                        tiles[r*N + c] = 0;  
                        collapsedIndexes[index] = r * N + c + N;                           
                    }
                }
            }
        }
        tilesCollapseAnimation(collapsedIndexes);
        return res;
    };

    const moveUp = () => {
        const N = 4;
        let res = false;
        let collapsedIndexes = [];

        for(let c = 0; c < N; c += 1) {       // column index
            // 1. Move Up
            for(let i = 1; i < N; i += 1) {
                for(let r = N - 1; r > 0; r -= 1 ) {  // row index 
                    if( tiles[r*N + c] != 0 && tiles[r*N + c - N] == 0 ) {
                        tiles[r*N + c - N] = tiles[r*N + c];
                        tiles[r*N + c] = 0;
                        res = true;
                    }
                }
            }
            // 2. Collapse: from top to bottom
            for(let r = 0; r < N - 1; r += 1 ) {
                if( tiles[r*N + c] != 0 && tiles[r*N + c + N] == tiles[r*N + c] ) {
                    tiles[r*N + c] *= 2;
                    tiles[r*N + c + N] = 0;
                    setScore(score + tiles[r*N + c]);
                    animateScoreChange();
                    collapsedIndexes.push(r*N + c)
                    res = true;
                }
            }
            // 3. Move up after collapse
            for(let i = 1; i < N; i += 1) {
                for(let r = N - 1; r > 0; r -= 1 ) {
                    if( tiles[r*N + c] != 0 && tiles[r*N + c - N] == 0 ) {
                        let index = collapsedIndexes.indexOf(r*N + c);
                        tiles[r*N + c - N] = tiles[r*N + c];              
                        tiles[r*N + c] = 0;  
                        collapsedIndexes[index] = r*N + c - N;                           
                    }
                }
            }
        }
        tilesCollapseAnimation(collapsedIndexes);
        return res;
    };





    return (
    <View style={styles.container}>
        <View style={[styles.topBlock, {marginHorizontal: width * 0.025}]}>
            <Text style={styles.topBlockText}>
                2048
            </Text>
            <View style={styles.topBlockSub}>
                <View style={styles.topBlockScores}>
                <View style={styles.topBlockScore}>
                    <Text style={styles.topBlockScoreText} >SCORE </Text>
                    <Animated.View style={{transform: [{scale: scoreAnimValue}]}}>
                        <Text style={styles.topBlockScoreText}> {score}</Text>
                    </Animated.View>
                </View>
                    <View style={styles.topBlockScore}>
                        <Text style={styles.topBlockScoreText}>BEST </Text>
                        <Text style={styles.topBlockScoreText}> {bestScore}</Text>
                    </View>
                </View>

                <View style={styles.topBlockButtons}>
                    <Pressable style={styles.topBlockButton} onPress={newGame}><Text style={styles.topBlockButtonText}>NEW</Text></Pressable>
                    <Pressable style={styles.topBlockButton} onPress={undoTilesHistory}><Text style={styles.topBlockButtonText}>UNDO</Text></Pressable>

                </View>
            </View>
        </View>

        <Text>
            Join the numbers and get to the 2048 tile!
        </Text>
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

            <View style={[styles.field, {width: width * 0.95, height: width * 0.95}]}>
                {tiles.map((tile, index ) => <Animated.View key={index} style={{
                    opacity: opacityValues[index],
                    transform: [{scale: scaleValues[index]}]
                }}>
                <Text 
                    style={[styles.tile, {
                        backgroundColor: tileBackground(tile),
                        color: tileForeground(tile),
                        width: width * 0.201,
                        height: width * 0.201,
                        fontSize: tileFontSize(tile),
                        fontWeight: 800,
                        marginLeft: width * 0.022,
                        marginTop: width * 0.022,
                    }]}>{tile}</Text>
                </Animated.View>)}
            </View>
        </TouchableWithoutFeedback>

        <Animated.View style={{opacity: animValue}}>
            <Text>{text}</Text>
        </Animated.View>
      
    </View>);
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FCF7F0",
    display: "flex",
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%"
  },
  topBlock: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  topBlockText: {
    backgroundColor: "gold",
    borderRadius: 5,
    color: "white",
    fontSize: 32,
    marginVertical: 5,
    marginRight: 5,
    paddingHorizontal: 10,
    verticalAlign: "middle"
  },
  topBlockSub: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  topBlockScores: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  topBlockScore: {
    backgroundColor: "#3C3A34",
    borderRadius: 5,
    flex: 1,
    marginVertical: 5,
    marginLeft: 10,
    padding: 10,
  },
  topBlockScoreText: {
    color: "white",
    textAlign: "center"
  },
  topBlockButtons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  topBlockButton: {
    backgroundColor: "#E06849",
    borderRadius: 5,
    flex: 1,
    marginVertical: 5,
    marginLeft: 10,
    padding: 10,
  },
  topBlockButtonText: {
    color: "white",
    textAlign: "center"
  },
  field: {
    backgroundColor: "#A29383",
    borderRadius: 10,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: "auto",
    padding: 3,
    gap: 3,
  },
  tile: {
    borderRadius: 5,
    textAlign: "center",
    verticalAlign: "middle",
  }
});

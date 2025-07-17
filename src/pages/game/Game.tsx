import { RefObject, useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, TouchableWithoutFeedback, useWindowDimensions, View } from "react-native";
import Orientation from "react-native-orientation-locker";
import RNFS from "react-native-fs";
import WinModal from "../../features/game/ui/WinModal";
import GameOverModal from "../../features/game/ui/GameOverModal";
import Sound from "react-native-sound";

// Библиотека для управления и блокировки (lock) ориентации экрана.
// npm i react-native-orientation-locker

// Библиотека для работы с файловой системой в React Native (чтение, запись, удаление и пр.).
// npm i react-native-fs

// Sounds
// npm install react-native-sound

/* 
TODO:
    sound off btn
    WinGame play sound ?
*/



type EventData = {
    x: number,
    y: number,
    t: number,   // t - timestamp (время)
};

type FieldState = {
    tiles: Array<number>,
    score: number,
    bestScore: number,
};


// sound files located in: android\app\src\main\res\raw
const tilesSoundFiles = [
    //"tile_1.mp3",
    "tile_2.wav",
    "tile_3.wav",
    "tile_4.mp3",
];
const buttonSoundFiles = ["click.mp3"];

const distanceTreshold = 40;  // Порог срабатывания свайпу  (мин. растояние проведения)
const timeTreshhold = 500;    // Порог срабатывания свайпе (макс. время проведения)
const bestScoreFileName = '/best.score';
const N = 4;
const MAX_UNDO_HISTORY = 50;
const WIN_TILE_VALUE = 2048;

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

function playRandomTileSound(soundsRef: RefObject<Sound[]>) {
  const sounds = soundsRef.current;
  if (!sounds?.length) return;

  const index = Math.floor(Math.random() * sounds.length);
  const sound = sounds[index];
  if (sound) {
    sound.setCurrentTime(0);
    sound.play();
  }
}



export default function Game() {
    const {width} = useWindowDimensions();
    const [text, setText] = useState("Game");               // display swipe direction text (Right - OK, Left - NO MOVE)
    const [score, setScore] = useState(0);
    const [bestScore, setBestScore] = useState(0);
    const [showWinModal, setShowWinModal] = useState(false);
    const [hasWon, setHasWon] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const undoHistoryRef = useRef([] as FieldState[]);
    const tilesSoundsRef = useRef<Sound[]>([]);
    const buttonSoundsRef = useRef<Sound[]>([]);


    const [tiles, setTiles] = useState([
        0,    2,    4,     8,
        16,   32,   64,    128,
        256,  512,  1024,  2048,
        4096, 8192, 16384, 32768
    ]); 

    // Sounds
    useEffect(() => {
        tilesSoundsRef.current = tilesSoundFiles.map(fileName => new Sound(fileName, Sound.MAIN_BUNDLE));

        return () => { tilesSoundsRef.current.forEach(sound => sound.release());  };
    }, []);

    useEffect(() => {
        buttonSoundsRef.current = buttonSoundFiles.map(fileName => new Sound(fileName, Sound.MAIN_BUNDLE));
        return () => buttonSoundsRef.current.forEach(s => s.release());
    }, []);

    // Load Score
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


    // save best score via RNFS (DocumentDirectoryPath is accessible without user permissions)
    const saveBestScore = () => {
        const path = RNFS.DocumentDirectoryPath + bestScoreFileName;
        return RNFS.writeFile(path, bestScore.toString(), 'utf8');
    };
    
    // load score from file (RNFS)
    const loadBestScore = () => {
        const path = RNFS.DocumentDirectoryPath + bestScoreFileName;
        return RNFS.readFile(path, 'utf8')
        .then(str => {
            setBestScore(Number(str));
        });
    };

    const saveTilesHistory = () => {
        const newState = {
            tiles: [...tiles],
            score: score,
            bestScore: bestScore,
        };
        
        undoHistoryRef.current = [...undoHistoryRef.current, newState].slice(-MAX_UNDO_HISTORY);   
    };

    const undoTilesHistory = () => {
        if (undoHistoryRef.current.length === 0) return;
        const lastState = undoHistoryRef.current[undoHistoryRef.current.length - 1];
        undoHistoryRef.current = undoHistoryRef.current.slice(0, -1);
        
        setTiles([...lastState.tiles]);
        setScore(lastState.score);
        setBestScore(lastState.bestScore);
    };

    const checkForWin = () => {
        return !hasWon && tiles.includes(WIN_TILE_VALUE);
    };
    
    const checkGameOver = () => {
        if (tiles.includes(0)) return false;
        return !(canMoveRight() || canMoveLeft() || canMoveDown() || canMoveUp());
    }

    const continueGame = () => {
        setShowWinModal(false);
        setHasWon(true);
    };

    const tileFontSize = (tileValue: number) => { 
        return tileValue < 10  ? width * 0.12
        : tileValue < 100      ? width * 0.1
        : tileValue < 1000     ? width * 0.08
        : tileValue < 10000    ? width * 0.07
                               : width * 0.06;
    };

    const handleMove = (
        direction: "Right" | "Left" | "Down" | "Up",
        canMove: () => boolean,
        doMove: () => void,
    ) => {
        if(canMove()) {
            saveTilesHistory();
            doMove();
            setText(direction + " - OK");
            spawnTile();
            setTiles([...tiles]);

            if (checkForWin()) {
                setShowWinModal(true);
            } else if (checkGameOver()) {
                setGameOver(true);
            }
        }
        else {
            setText(direction + " - NO MOVE");
        }
        textSwipeDirectionAnimation();
    }

    // swipes - жести провведення з обмеженням минимальних вiдстаней та швидкостей
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
                        handleMove("Right", canMoveRight, moveRight);                                                  
                    }
                    else {
                        handleMove("Left", canMoveLeft, moveLeft);  
                    }
                }
            }
            else {      // vertical
                if(Math.abs(dy) > distanceTreshold) {
                    if(dy > 0) {
                        handleMove("Down", canMoveDown, moveDown);          
                    }
                    else {
                        handleMove("Up", canMoveUp, moveUp);   
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

    const newGame = () => {
        for(let i = 0; i < tiles.length; i+=1) {
            tiles[i] = 0;
        }
        setScore(0);
        spawnTile();
        spawnTile();
        
        undoHistoryRef.current = [];
        setTiles([...tiles]);
        setShowWinModal(false);
        setGameOver(false);
        setHasWon(false);
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
                    playRandomTileSound(tilesSoundsRef);
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

    const canMoveLeft = () => {
        for(let r = 0; r < N; r += 1) {
            for(let c = 0; c < N - 1; c += 1) {
                if(tiles[r * N + c + 1] !== 0 && (
                    tiles[r * N + c] === 0 || tiles[r * N + c] === tiles[r * N + c + 1])
                ) {
                    return true;
                }
            }
        }
        return false;
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
                    playRandomTileSound(tilesSoundsRef);
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
    };

    const canMoveDown = () => {
        for(let c = 0; c < N; c += 1) {
            for(let r = 0; r < N - 1; r += 1) {
                if( tiles[r*N + c] != 0 && (
                    tiles[r*N + c] == tiles[r*N + c + N] || tiles[r*N + c + N] == 0 )
                ) {
                    return true;
                }              
            }
        }
        return false;
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
                    playRandomTileSound(tilesSoundsRef);
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
    };

    const canMoveUp = () => {
        for(let c = 0; c < N; c += 1) {
            for(let r = 1; r < N; r += 1) {
                if( tiles[r*N + c] != 0 && (
                    tiles[r*N + c] == tiles[r*N + c - N] || tiles[r*N + c - N] == 0 )
                ) {
                    return true;
                }              
            }
        }
        return false;
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
                    playRandomTileSound(tilesSoundsRef);
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
                    <Pressable 
                        style={styles.topBlockButton} 
                        onPress={() => {
                            playRandomTileSound(buttonSoundsRef);
                            newGame();
                        }}>
                        <Text style={styles.topBlockButtonText}>NEW</Text>
                    </Pressable>
                    
                    <Pressable 
                        style={styles.topBlockButton} 
                        onPress={() => {
                            playRandomTileSound(buttonSoundsRef);
                            undoTilesHistory();
                        }}>
                        <Text style={styles.topBlockButtonText}>UNDO {undoHistoryRef.current.length > 0 ? "(" + undoHistoryRef.current.length + ")" : ""}</Text>             
                    </Pressable>

                </View>
            </View>
        </View>

        <Text>
            Join the numbers and get to the {WIN_TILE_VALUE} tile!
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
        
    <WinModal
        visible={showWinModal}
        score={score}
        onRestart={newGame}
        onContinue={continueGame}
        onClose={() => setShowWinModal(false)}
    />

    <GameOverModal
        visible={gameOver}
        score={score}
        onRestart={newGame}
        onClose={() => setGameOver(false)}
    />

      
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
    textAlign: "center",
    fontWeight: 700,
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
    textAlign: "center",
    fontWeight: 600,
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
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FCF7F0',
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    minWidth: 300,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  modalSubtext: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 25,
    color: '#666',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    backgroundColor: '#E06849',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
  },
  modalButtonContinue: {
    backgroundColor: '#8BBE3D',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

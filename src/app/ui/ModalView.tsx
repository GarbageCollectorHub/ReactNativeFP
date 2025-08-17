import { Image, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import ModalData from "../../shared/types/ModalData";


export default function ModalView ({isModalVisible, setModalVisible, modalData}: 
    {isModalVisible: boolean, setModalVisible: (v:boolean) => void, modalData: ModalData}) 
{
    return <Modal
            animationType="fade" //"slide"  //"none"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={() => {
            //Alert.alert('Modal has been closed.');
            if(!!modalData.closeButtonAction) {
                modalData.closeButtonAction();
            }
            setModalVisible(false);
            }}>
    
            <View style={styles.centeredView}>
                <View style={styles.modalView}>

                    <Pressable onPress={() => {
                        if(!!modalData.closeButtonAction) {
                            modalData.closeButtonAction();
                        }
                        setModalVisible(false);
                        }}
                        style={{position: "absolute", right: 10, top: 10}}>
                        <Image source={require("../../shared/assets/images/delete.png")}
                          style={{width: 25, height: 25}}/>
                    </Pressable>

                    <Text style={styles.modalText}>{modalData.title}</Text>
                    <Text style={styles.modalText}>{modalData.message}</Text>

                    {!!modalData.positiveButtonText && <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => {
                            if(!!modalData.positiveButtonAction) {
                                modalData.positiveButtonAction();
                            }
                            setModalVisible(!isModalVisible)                 
                        }}>
                        <Text style={styles.textStyle}>{modalData.positiveButtonText}</Text>
                    </Pressable>}

                    {!!modalData.negativeButtonText && <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => {
                            if(!!modalData.negativeButtonAction) {
                                modalData.negativeButtonAction();
                            }
                            setModalVisible(!isModalVisible)                 
                        }}>
                        <Text style={styles.textStyle}>{modalData.negativeButtonText}</Text>
                    </Pressable>}

                </View>
            </View>
        </Modal>
};




const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#2ca0c1ff',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
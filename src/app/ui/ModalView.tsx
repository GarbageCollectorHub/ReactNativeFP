import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import ModalData from "../../shared/types/ModalData";
import FirmButton from "../../features/buttons/ui/FirmButton";
import { ButtonTypes } from "../../features/buttons/model/ButtonTypes";


export default function ModalView ({isModalVisible, setModalVisible, modalData}: 
  {isModalVisible: boolean, setModalVisible: (v:boolean) => void, modalData: ModalData}) 
  {
    return (
    <Modal
      animationType="fade" //"slide"  //"none"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={() => {
        if (modalData.closeButtonAction) {
          modalData.closeButtonAction();
        }
        setModalVisible(false);
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>

          <Pressable
            onPress={() => {
              if (modalData.closeButtonAction) {
                modalData.closeButtonAction();
              }
              setModalVisible(false);
            }}
            style={styles.closeButton}
          >
            <Image
              source={require("../../shared/assets/images/delete.png")}
              style={styles.closeIcon}
            />
          </Pressable>

          {!!modalData.title && (
            <Text 
              style={[styles.modalTitle, modalData.title.length > 40 && styles.modalTitleLong]}  
              numberOfLines={5}
            >
              {modalData.title}
            </Text>
          )}

          <ScrollView 
            style={styles.messageContainer}
            contentContainerStyle={styles.messageContent}
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled={true}>
            <Text style={styles.modalMessage}>{modalData.message}</Text>
          </ScrollView>
          

          
          <View style={styles.buttonsRow}>
            {!!modalData.positiveButtonText && (
              <View style={styles.buttonHalf}>
                <FirmButton
                  type={ButtonTypes.primary}
                  title={modalData.positiveButtonText}
                  action={() => {
                    if (modalData.positiveButtonAction) {
                      modalData.positiveButtonAction();
                    }
                    setModalVisible(!isModalVisible);
                  }}
                />
              </View>
            )}

            {!!modalData.negativeButtonText && (
              <View style={styles.buttonHalf}>
                <FirmButton
                  type={ButtonTypes.secondary}
                  title={modalData.negativeButtonText}
                  action={() => {
                    if (modalData.negativeButtonAction) {
                      modalData.negativeButtonAction();
                    }
                    setModalVisible(!isModalVisible);
                  }}
                />
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}


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
  closeIcon: {
    width: 25, 
    height: 25,
  },
  closeButton:{
    position: "absolute", 
    right: 10, 
    top: 10,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalMessage:{
    marginBottom: 15,
    textAlign: 'justify',
    color: 'black',
    fontSize: 16,
    lineHeight: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'justify',
    color: '#1c1c1cff',
  },
  modalTitleLong: {
    fontSize: 16,
    lineHeight: 20,
  },
  messageContainer: {
    maxHeight: 300,     // maxHeight
  },
  messageContent: {
  },
  buttonsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  buttonHalf: {
    flex: 1,
    marginHorizontal: 5,
  },
  
    
});
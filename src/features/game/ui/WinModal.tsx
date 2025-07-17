
import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import { GameModalProps } from "../model/GameModalProps";



export default function WinModal({ visible, score, onRestart, onContinue, onClose }: GameModalProps) {
  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>🎉 Congratulations!</Text>
          <Text style={styles.modalText}>You reached the 2048 tile!</Text>
          <Text style={styles.modalSubtext}>Your score: {score}</Text>
          <View style={styles.modalButtons}>
            <Pressable style={styles.modalButton} onPress={onRestart}>
              <Text style={styles.modalButtonText}>Restart</Text>
            </Pressable>
            <Pressable style={[styles.modalButton, styles.modalButtonContinue]} onPress={onContinue}>
              <Text style={styles.modalButtonText}>Continue</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}



const styles = StyleSheet.create({
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

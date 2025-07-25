import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { CustomCheckboxProps } from '../model/CustomCheckboxTypes';

const CustomCheckbox = ({ checked, onPress, label = '' }: CustomCheckboxProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={[styles.checkbox, checked && styles.checked]}>
        {checked && <Text style={styles.checkmark}>✓</Text>}
      </View>
      {label.length > 0 && <Text style={styles.label}>{label}</Text>}
    </TouchableOpacity>
  );
};

export default CustomCheckbox;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#888',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  checked: {
    backgroundColor: '#2196f3',
    borderColor: '#2196f3',
  },
  checkmark: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
     marginTop: -3,
  },
  label: {
    marginLeft: 8,
    fontSize: 16,
    color: 'black',
  },
});

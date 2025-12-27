import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardTypeOptions } from 'react-native';
import { isValidURL } from '../utils/validation';

interface FormFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  type: 'string' | 'url';
  required: boolean;
  placeholder?: string;
  testID?: string;
}

export function FormField({
  label,
  value,
  onChangeText,
  type,
  required,
  placeholder,
  testID,
}: FormFieldProps) {
  const [isValid, setIsValid] = useState(true);
  const [isTouched, setIsTouched] = useState(false);

  const validate = (text: string, touched: boolean) => {
    if (!touched) return true;

    if (required && text.trim() === '') {
      return false;
    }
    if (type === 'url' && text.trim() !== '') {
      return isValidURL(text);
    }
    return true;
  };

  const handleBlur = () => {
    setIsTouched(true);
    setIsValid(validate(value, true));
  };

  const handleChangeText = (text: string) => {
    onChangeText(text);
    if (isTouched) {
      setIsValid(validate(text, isTouched));
    }
  };

  const keyboardType: KeyboardTypeOptions = type === 'url' ? 'url' : 'default';

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, !isValid && styles.inputInvalid]}
        value={value}
        onChangeText={handleChangeText}
        onBlur={handleBlur}
        placeholder={placeholder}
        placeholderTextColor="#c7c7cc"
        keyboardType={keyboardType}
        autoCapitalize={type === 'url' ? 'none' : 'sentences'}
        autoCorrect={type !== 'url'}
        testID={testID}
        accessibilityLabel={label}
        accessibilityIdentifier={testID}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    color: '#8e8e93',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 17,
    color: '#000',
  },
  inputInvalid: {
    color: '#ff3b30',
  },
});

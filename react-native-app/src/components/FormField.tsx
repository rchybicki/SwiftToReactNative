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
}

export function FormField({
  label,
  value,
  onChangeText,
  type,
  required,
  placeholder,
}: FormFieldProps) {
  const [isValid, setIsValid] = useState(true);
  const [isTouched, setIsTouched] = useState(false);

  const validate = (text: string) => {
    if (!isTouched) return true;

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
    setIsValid(validate(value));
  };

  const handleChangeText = (text: string) => {
    onChangeText(text);
    if (isTouched) {
      setIsValid(validate(text));
    }
  };

  const keyboardType: KeyboardTypeOptions = type === 'url' ? 'url' : 'default';

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, !isValid && styles.inputError]}
        value={value}
        onChangeText={handleChangeText}
        onBlur={handleBlur}
        placeholder={placeholder}
        keyboardType={keyboardType}
        autoCapitalize={type === 'url' ? 'none' : 'sentences'}
        autoCorrect={type !== 'url'}
      />
      {!isValid && (
        <Text style={styles.errorText}>
          {required && value.trim() === '' ? 'This field is required' : 'Invalid URL'}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
});

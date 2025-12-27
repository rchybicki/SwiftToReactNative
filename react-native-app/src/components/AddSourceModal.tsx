import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FormField } from './FormField';
import { RssSource } from '../models/types';
import { isValidURL } from '../utils/validation';

interface AddSourceModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (source: RssSource) => void;
}

export function AddSourceModal({ visible, onClose, onAdd }: AddSourceModalProps) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [rssUrl, setRssUrl] = useState('');
  const [iconUrl, setIconUrl] = useState('');

  const isFormValid = () => {
    if (title.trim() === '') return false;
    if (!isValidURL(url)) return false;
    if (!isValidURL(rssUrl)) return false;
    if (iconUrl.trim() !== '' && !isValidURL(iconUrl)) return false;
    return true;
  };

  const handleAdd = () => {
    if (!isFormValid()) return;

    const source: RssSource = {
      title: title.trim(),
      url: url.trim(),
      rss: rssUrl.trim(),
      icon: iconUrl.trim() || undefined,
    };

    Keyboard.dismiss();
    onAdd(source);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setTitle('');
    setUrl('');
    setRssUrl('');
    setIconUrl('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={handleClose}
            style={styles.closeButton}
            accessibilityLabel="Cancel"
            testID="add-source-cancel"
          >
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleAdd}
            disabled={!isFormValid()}
            style={[styles.addButton, !isFormValid() && styles.addButtonDisabled]}
            accessibilityLabel="Add"
            testID="add-source-submit"
          >
            <Text style={[styles.addButtonText, !isFormValid() && styles.addButtonTextDisabled]}>
              Add
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Add source</Text>

        <ScrollView
          style={styles.form}
          contentContainerStyle={styles.formContent}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
        >
          <FormField
            label="Title"
            value={title}
            onChangeText={setTitle}
            type="string"
            required={true}
            testID="add-source-title-input"
          />
          <FormField
            label="URL"
            value={url}
            onChangeText={setUrl}
            type="url"
            required={true}
            testID="add-source-url-input"
          />
          <FormField
            label="RSS URL"
            value={rssUrl}
            onChangeText={setRssUrl}
            type="url"
            required={true}
            testID="add-source-rss-input"
          />
          <FormField
            label="Image URL (optional)"
            value={iconUrl}
            onChangeText={setIconUrl}
            type="url"
            required={false}
            testID="add-source-icon-input"
          />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f7',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  addButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#ffffff',
  },
  addButtonDisabled: {
    backgroundColor: '#e5e5ea',
  },
  addButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#007AFF',
  },
  addButtonTextDisabled: {
    color: '#8e8e93',
  },
  form: {
    flex: 1,
  },
  formContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
});

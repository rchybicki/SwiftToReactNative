import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
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
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Source</Text>
          <TouchableOpacity onPress={handleAdd} disabled={!isFormValid()}>
            <Text style={[styles.addButton, !isFormValid() && styles.addButtonDisabled]}>
              Add
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.form}>
          <FormField
            label="Title"
            value={title}
            onChangeText={setTitle}
            type="string"
            required={true}
            placeholder="Feed name"
          />
          <FormField
            label="Website URL"
            value={url}
            onChangeText={setUrl}
            type="url"
            required={true}
            placeholder="https://example.com"
          />
          <FormField
            label="RSS Feed URL"
            value={rssUrl}
            onChangeText={setRssUrl}
            type="url"
            required={true}
            placeholder="https://example.com/feed.xml"
          />
          <FormField
            label="Icon URL (optional)"
            value={iconUrl}
            onChangeText={setIconUrl}
            type="url"
            required={false}
            placeholder="https://example.com/icon.png"
          />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  cancelButton: {
    fontSize: 17,
    color: '#007AFF',
  },
  addButton: {
    fontSize: 17,
    color: '#007AFF',
    fontWeight: '600',
  },
  addButtonDisabled: {
    color: '#ccc',
  },
  form: {
    padding: 16,
  },
});

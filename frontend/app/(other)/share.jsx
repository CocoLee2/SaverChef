import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Clipboard, Alert, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";

const Share = () => {
  const [email, setEmail] = useState('');
  const [shareLink, setShareLink] = useState('https://myapp.com/share/inventory/12345');

  const copyToClipboard = () => {
    Clipboard.setString(shareLink);
    Alert.alert('Link Copied', 'The link has been copied to your clipboard.');
  };

  const sendEmail = () => {
    if (!email) {
      Alert.alert('Email Required', 'Please enter an email address.');
      return;
    }

    const emailUrl = `mailto:${email}?subject=Shared Inventory&body=Here is the link to the inventory: ${shareLink}`;
    Linking.openURL(emailUrl).catch((err) => {
      Alert.alert('Error', 'Could not open email client.');
    });
  };

  return (
    <View style={styles.container}>
        <View style={styles.headerContainer}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color="#F36C21" />
            </TouchableOpacity>
            <Text style={styles.headerText}>Share Inventory</Text>
        </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shareable Link</Text>
        <View style={styles.linkContainer}>
          <Text style={styles.linkText}>{shareLink}</Text>
          <TouchableOpacity onPress={copyToClipboard}>
            <Ionicons name="copy-outline" size={24} color="#F36C21" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Share via Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter email address"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TouchableOpacity style={styles.shareButton} onPress={sendEmail}>
          <Text style={styles.shareButtonText}>Send Email</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF9ED',
    paddingHorizontal: 20,
  },

  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 70,
    marginBottom: 10,
  },

  header: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#F36C21',
    flex: 1,
  },

  backButton: {
    marginRight: 10,
  },

  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F36C21',
  },

  section: {
    marginVertical: 20,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },

  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
  },

  linkText: {
    fontSize: 16,
    color: '#666',
    flex: 1,
  },

  input: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    fontSize: 16,
    marginBottom: 10,
  },

  shareButton: {
    backgroundColor: '#F36C21',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },

  shareButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Share;

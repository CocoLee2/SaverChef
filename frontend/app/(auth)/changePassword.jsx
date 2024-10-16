import { React, useState } from 'react';
import { StatusBar, View, Text, StyleSheet, Alert } from 'react-native';
import { Link, router } from "expo-router";
import CustomButton from '../../components/CustomButton';
import FormField from '../../components/FormField';


const ChangePassword = () => {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""  
  });

  const handlePasswordChange = () => {
    // Basic validation
    if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      Alert.alert('Error', 'New password and confirm password do not match.');
      return;
    }

    // other requirements on password
    // if (form.newPassword.length < 6) {
    //   Alert.alert('Error', 'New password must be at least 6 characters long.');
    //   return;
    // }

    Alert.alert('Success', 'Password updated successfully!');
    router.push("../(tabs)/profile");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.formWrapper}>
      <Text style={styles.Text1}>Change Password</Text>

      <FormField
        title="Old password"
        value={form.oldPassword}
        handleChangeText={(e) => setForm({ ...form, oldPassword: e })}
        otherStyles={{ marginBottom: 20, marginTop: 10 }}
      />

      <FormField
        title="New password"
        value={form.newPassword}
        handleChangeText={(e) => setForm({ ...form, newPassword: e })}
        otherStyles={{ marginBottom: 20, marginTop: 10 }}
      />

      <FormField
        title="Confirm new password"
        value={form.confirmPassword}  
        handleChangeText={(e) => setForm({ ...form, confirmPassword: e })}
        otherStyles={{ marginBottom: 20, marginTop: 10 }}
      />

      {/* <TouchableOpacity style={styles.button} onPress={handlePasswordChange}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity> */}
      <CustomButton 
        title="Submit"
        handlePress={handlePasswordChange} 
        containerStyles={styles.customContainer}
      />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF9ED',
  },
  Text1: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#F36C21',
    marginTop: 80,
    textAlign: 'center',
    marginBottom: 30
  },
  formWrapper: {
    width: '100%',
    alignItems: 'center', // Center the form elements horizontally
    minHeight: '85%', // Use percentage for min height
  },
  customContainer: {
    width: '85%',
    marginTop: 30,
    alignSelf: 'center', // Ensure the button is centered
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});

export default ChangePassword;

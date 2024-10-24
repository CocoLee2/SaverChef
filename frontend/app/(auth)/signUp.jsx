import { StatusBar, View, Text, StyleSheet, ScrollView, Alert } from 'react-native'
import { React, useState} from 'react'
import { Link, router } from "expo-router";
import CustomButton from '../../components/CustomButton';
import FormField from '../../components/FormField';

const SignUp = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""  
  });

  const handleSignUp = () => {
    // Basic validation to check if all fields are filled
    if (!form.username || !form.email || !form.password || !form.confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    // Check if passwords match
    if (form.password !== form.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match!');
    } else {
      // Navigate to home page after successful sign-up
      router.push("../(tabs)/home");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.formWrapper}>
          <Text style={styles.Text1}>Sign Up</Text>
          <Text style={styles.Text2}>Create your account</Text>

          <FormField
            title="Username"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles={{ marginBottom: 20, marginTop: 10 }}
          />

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles={{ marginBottom: 20, marginTop: 10 }}
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles={{ marginBottom: 20, marginTop: 10 }}
          />

          <FormField
            title="Confirm password"
            value={form.confirmPassword}  
            handleChangeText={(e) => setForm({ ...form, confirmPassword: e })}
            otherStyles={{ marginBottom: 20, marginTop: 10 }}
          />

          <CustomButton 
            title="Sign Up"
            handlePress={handleSignUp} 
            containerStyles={styles.customContainer}
          />

          <Text style={styles.Text2}>Already have an account?</Text>

          <View style={styles.loginLinkContainer}>
            <Link href="/logIn" style={styles.loginLink}>
              LOG IN
            </Link>
          </View>
        </View>
      </ScrollView>  
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF9ED', // Assuming 'bg-primary' is this color
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center', // Vertically center content
    alignItems: 'center', // Horizontally center content
    paddingHorizontal: 16, // Add some padding
  },
  formWrapper: {
    width: '100%',
    alignItems: 'center', // Center the form elements horizontally
    minHeight: '85%', // Use percentage for min height
  },
  Text1: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#F36C21',
    marginTop: 40,
    textAlign: 'center',
  },
  Text2: {
    fontSize: 12,
    color: 'rgba(16, 16, 16, 0.34)',
    marginBottom: 10,
    textAlign: 'center',
  },
  customContainer: {
    width: '85%',
    marginTop: 20,
    marginBottom: 20,
    alignSelf: 'center', // Ensure the button is centered
  },
  loginLinkContainer: {
    flexDirection: 'row',
    paddingTop: 3,
  },
  loginLink: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F36C21',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});

export default SignUp
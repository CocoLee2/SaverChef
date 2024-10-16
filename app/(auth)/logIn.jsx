import { StatusBar, Text, View, StyleSheet, ScrollView } from 'react-native';
import { React, useState } from 'react';
import { Link, router } from "expo-router";
import CustomButton from '../../components/CustomButton';
import FormField from '../../components/FormField';

const LogIn = () => {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"  
      />

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.formWrapper}>
          <Text style={styles.Text1}>Welcome back!</Text>
          <Text style={styles.Text2}>Enter your credentials to log in</Text>

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

          <Link
            href="/forgetPassword"
            style={styles.forgetPasswordLink}
          >
            forget password?
          </Link>

          <CustomButton 
            title="Log in"
            handlePress={() => router.push("../(tabs)/home")}
            containerStyles={styles.customContainer}
          />

          <Text style={styles.Text2}>Don't have an account?</Text>

          <View style={styles.signUpLinkContainer}>
            <Link
              href="/signUp"
              style={styles.signUpLink}
            >
              SIGN UP
            </Link>
          </View>

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF9ED',
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
    paddingVertical: 20,
  },
  Text1: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#F36C21',
    marginTop: 20,
    textAlign: 'center',
  },
  Text2: {
    fontSize: 12,
    color: 'rgba(16, 16, 16, 0.34)',
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
  },
  customContainer: {
    width: '85%',
    marginTop: 40,
    marginBottom: 20,
    alignSelf: 'center', // Ensure the button is centered
  },
  signUpLinkContainer: {
    flexDirection: 'row',
    paddingTop: 3,
  },
  signUpLink: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F36C21',
  },
  forgetPasswordLink: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F36C21',
    alignSelf: 'flex-end',
    paddingRight: 30,
  },
});

export default LogIn;

import { useState } from "react";
import { View, TextInput, TouchableOpacity, Image, Text, StyleSheet } from "react-native";
import { icons } from "../constants";

const FormField = ({
  title, 
  value, 
  placeholder, 
  handleChangeText,
  otherStyles,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false); // Track whether the field is focused
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Toggle password visibility

  return (
    <View style={[styles.container, otherStyles]}>
      <View style={styles.inputContainer}>
        {/* Display the label inside the input field, dynamically position based on focus */}
        <Text
          style={[
            styles.label,
            isFocused || value ? styles.labelSmall : styles.labelLarge,
          ]}
        >
          {title}
        </Text>

        <TextInput
          style={[styles.input, isFocused || value ? { paddingTop: 18 } : null]}
          value={value}
          placeholder={isFocused ? '' : placeholder}
          placeholderTextColor="#7B7B8B"
          onChangeText={handleChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(value ? true : false)}
          secureTextEntry={(title === "Password" && !showPassword) || 
            title === "Confirm password" && !showConfirmPassword}
          {...props}
        />

        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              style={styles.icon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}

        {title === "Confirm password" && (
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <Image
              source={!showConfirmPassword ? icons.eye : icons.eyeHide}
              style={styles.icon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    position: 'relative',
  },

  inputContainer: {
    width: '85%',
    paddingHorizontal: 10,
    minHeight: 52,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#F36C21',
    flexDirection: 'row',
    alignItems: 'center',
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
    paddingLeft: 16, // Padding to keep space for the label
    paddingTop: 0, // Default padding, increases when focused/typing
  },

  label: {
    position: 'absolute',
    left: 16,
    color: '#F36C21',
    fontSize: 16,
    paddingHorizontal: 4,
    backgroundColor: '#FFFFFF',
  },

  labelLarge: {
    top: 18, // Initial position when not focused or typing
    fontSize: 16,
  },

  labelSmall: {
    top: -10, // Float above when focused or typing
    fontSize: 12, // Smaller label when floating
  },

  icon: {
    width: 24,
    height: 24,
    tintColor: '#F36C21',
  },
});

export default FormField;

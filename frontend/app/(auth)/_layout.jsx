import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const AuthLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="logIn"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="signUp"
          options={{
            headerShown: false,
          }}
        /> 

        <Stack.Screen
          name="changePassword"
          options={{
            headerShown: false,
          }}
        />
 
        {/* <Stack.Screen
          name="showRecipe"
          options={{
            headerShown: false,
          }}
        /> */}
      </Stack>

      {/* <Loader isLoading={loading} /> */}
      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
};

export default AuthLayout;
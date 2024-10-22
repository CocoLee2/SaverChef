import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";


const AuthLayout = () => {
  return (
    <>
      <Stack>
      <Stack.Screen
          name="splash"
          options={{
            headerShown: false,
          }}
        />
        
        <Stack.Screen
          name="showRecipe"
          options={{
            headerShown: false,
          }}
        />

      </Stack>

      {/* <Loader isLoading={loading} /> */}
      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
};

export default AuthLayout;
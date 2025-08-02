import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet } from "react-native";
import HomeScreen from "./Screens/HomeScreen";
import OnboardingScreen from "./Screens/OnboardingScreen";
import ProfileScreen from "./Screens/ProfileScreen";
const Stack = createNativeStackNavigator();


export default function Page() {
  return (
    <Stack.Navigator initialRouteName="WELCOME" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WELCOME" component={OnboardingScreen} />
      <Stack.Screen name="HOME" component={HomeScreen}  />
      <Stack.Screen name="PROFILE" component={ProfileScreen} />
    </Stack.Navigator>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
  },
});

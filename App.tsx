import React from "react";
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {SafeAreaProvider} from "react-native-safe-area-context";
import Main from "./Component/main/Main.tsx";
import Login from "./Component/screens/Login";
import SignUp from "./Component/screens/SignUp";
import ExitInfo from "./Component/screens/ExitInfo";
import Settings from "./Component/screens/Settings";
import {I18nProvider} from "./Component/i18n/i18n";

const Stack = createNativeStackNavigator();
export default function App() {
    return (
        <SafeAreaProvider>
            <I18nProvider>
                <NavigationContainer>
                    <Stack.Navigator screenOptions={{headerShown: false}}>
                        <Stack.Screen name="Home" component={Main} />
                        <Stack.Screen name="Login" component={Login} />
                        <Stack.Screen name="SignUp" component={SignUp} />
                        <Stack.Screen name="ExitInfo" component={ExitInfo} />
                        <Stack.Screen name="Settings" component={Settings} />
                    </Stack.Navigator>
                </NavigationContainer>
            </I18nProvider>
        </SafeAreaProvider>
    );
}

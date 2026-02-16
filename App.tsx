import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Main from "./Component/main/Main.tsx";
import Login from "./Component/screens/Login";
import SignUp from "./Component/screens/SignUp";
import ExitInfo from "./Component/screens/ExitInfo";
import Settings from "./Component/screens/Settings";
import Start from "./Component/screens/Start";
import ProfileHome from "./Component/screens/ProfileHome";
import MemoryCreate from "./Component/screens/MemoryCreate";
import MemoryList from "./Component/screens/MemoryList";
import MemoryDetail from "./Component/screens/MemoryDetail";
import Attendance from "./Component/screens/Attendance";
import ProfileEdit from "./Component/screens/ProfileEdit";
import PasswordChange from "./Component/screens/PasswordChange";
import { I18nProvider } from "./Component/i18n/i18n";

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <SafeAreaProvider>
            <I18nProvider>
                <NavigationContainer>
                    <Stack.Navigator screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="Home" component={Main} />
                        <Stack.Screen name="Login" component={Login} />
                        <Stack.Screen name="SignUp" component={SignUp} />
                        <Stack.Screen name="Start" component={Start} />
                        <Stack.Screen name="ProfileHome" component={ProfileHome} />
                        <Stack.Screen name="MemoryList" component={MemoryList} />
                        <Stack.Screen name="MemoryCreate" component={MemoryCreate} />
                        <Stack.Screen name="MemoryDetail" component={MemoryDetail} />
                        <Stack.Screen name="Attendance" component={Attendance} />
                        <Stack.Screen name="ProfileEdit" component={ProfileEdit} />
                        <Stack.Screen name="PasswordChange" component={PasswordChange} />
                        <Stack.Screen name="ExitInfo" component={ExitInfo} />
                        <Stack.Screen name="Settings" component={Settings} />
                    </Stack.Navigator>
                </NavigationContainer>
            </I18nProvider>
        </SafeAreaProvider>
    );
}

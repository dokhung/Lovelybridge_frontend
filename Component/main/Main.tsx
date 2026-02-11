import React from "react";
import {View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import Home from "./Home";

export default function Main() {
    return (
        <SafeAreaView className="flex-1 bg-[#FFF0F6]" style={{flex: 1}}>
            <View className="absolute -top-16 -right-10 h-[220px] w-[220px] rounded-full bg-[#FFD1E3] opacity-70" />
            <View className="absolute -bottom-24 -left-16 h-[260px] w-[260px] rounded-full bg-[#FFE3EE] opacity-80" />
            <Home />
        </SafeAreaView>
    );
}

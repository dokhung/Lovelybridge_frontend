import React from "react";
import {Pressable, Text, View} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {SafeAreaView} from "react-native-safe-area-context";
import {useI18n} from "../i18n/i18n";

export default function ExitInfo() {
    const navigation = useNavigation();
    const {t} = useI18n();

    return (
        <SafeAreaView className="flex-1 bg-[#FFF0F6]" style={{flex: 1}}>
            <View className="absolute -top-16 -right-10 h-[220px] w-[220px] rounded-full bg-[#FFD1E3] opacity-70" />
            <View className="absolute -bottom-24 -left-16 h-[260px] w-[260px] rounded-full bg-[#FFE3EE] opacity-80" />
            <View
                className="flex-1 items-center justify-center px-6"
                style={{flex: 1, alignItems: "center", justifyContent: "center"}}
            >
                <Text className="text-center text-[30px] font-bold text-[#FF4D8D]">
                    {t("seeYouSoon")}
                </Text>
                <Text className="mt-2 text-center text-[14px] text-[#FF85A2]">
                    {t("heartWelcome")}
                </Text>
                <Pressable
                    className="mt-6 rounded-full bg-[#FFEFF5] px-6 py-2"
                    onPress={() => navigation.goBack()}
                >
                    <Text className="text-[16px] font-semibold text-[#FF4D8D]">
                        {t("back")}
                    </Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

import React from "react";
import {Pressable, Text, View} from "react-native";
import LinearGradient from "react-native-linear-gradient";

type Props = {
    title: string;
    subtitle: string;
    badge: string;
    onSignUp: () => void;
};

export default function LoginCard({title, subtitle, badge, onSignUp}: Props) {
    return (
        <LinearGradient
            colors={["#FFB7D1", "#FFE3EE", "#FFD1E3"]}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={{borderRadius: 28, padding: 2}}
        >
            <View className="rounded-[24px] bg-white/95 px-5 py-5 shadow-xl shadow-pink-300">
                <View className="mb-4 flex-row items-center justify-between">
                    <View className="h-11 w-11 items-center justify-center rounded-2xl bg-[#FFF0F6]">
                        <Text className="text-[20px] text-[#FF4D8D]">♡</Text>
                    </View>
                    <View className="rounded-full bg-[#FFE3EE] px-3 py-1">
                        <Text className="text-[10px] font-semibold text-[#FF6F9C]">{badge}</Text>
                    </View>
                </View>

                <Text className="text-[26px] font-extrabold text-[#FF3B82]">{title}</Text>
                <Text className="mt-1 text-[12px] text-[#FF85A2]">{subtitle}</Text>

                <View className="mt-5 flex-row items-center justify-between">
                    <Pressable onPress={onSignUp}>
                        <Text className="text-[12px] font-semibold text-[#FF4D8D]">
                            회원가입
                        </Text>
                    </Pressable>
                </View>
            </View>
        </LinearGradient>
    );
}

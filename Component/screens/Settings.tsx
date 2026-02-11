import React, {useEffect, useRef, useState} from "react";
import {Animated, Pressable, Text, View} from "react-native";
import {Defs, LinearGradient, Pattern, Rect, Stop, Svg, Text as SvgText} from "react-native-svg";
import {useNavigation} from "@react-navigation/native";
import {SafeAreaView} from "react-native-safe-area-context";
import {Locale, useI18n} from "../i18n/i18n";

export default function Settings() {
    const navigation = useNavigation();
    const {t, locale, setLocale} = useI18n();
    const [showToast, setShowToast] = useState(false);
    const toastAnim = useRef(new Animated.Value(0)).current;
    const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const options: {label: string; value: Locale}[] = [
        {label: "한국어", value: "ko"},
        {label: "English", value: "en"},
        {label: "日本語", value: "ja"},
        {label: "中文", value: "zh"},
    ];

    useEffect(() => {
        return () => {
            if (toastTimer.current) {
                clearTimeout(toastTimer.current);
            }
        };
    }, []);

    const showSavedToast = () => {
        if (toastTimer.current) {
            clearTimeout(toastTimer.current);
        }
        setShowToast(true);
        Animated.timing(toastAnim, {
            toValue: 1,
            duration: 220,
            useNativeDriver: true,
        }).start();
        toastTimer.current = setTimeout(() => {
            Animated.timing(toastAnim, {
                toValue: 0,
                duration: 220,
                useNativeDriver: true,
            }).start(() => setShowToast(false));
        }, 1400);
    };

    return (
        <SafeAreaView className="flex-1 bg-[#FFF0F6]" style={{flex: 1}}>
            <View className="absolute -top-16 -right-10 h-[220px] w-[220px] rounded-full bg-[#FFD1E3] opacity-70" />
            <View className="absolute -bottom-24 -left-16 h-[260px] w-[260px] rounded-full bg-[#FFE3EE] opacity-80" />
            <View className="flex-1 px-6 pt-8">
                <Pressable
                    className="h-10 w-10 items-center justify-center rounded-full bg-[#FFE3EE]"
                    onPress={() => navigation.goBack()}
                    style={{
                        borderWidth: 1,
                        borderColor: "#FFD1E6",
                    }}
                >
                    <Text className="text-[18px] font-semibold text-[#FF4D8D]">←</Text>
                </Pressable>

                <View className="mt-10">
                    <Text className="text-[30px] font-bold text-[#FF4D8D]">{t("settings")}</Text>
                    <Text className="mt-2 text-[13px] text-[#FF85A2]">{t("languageHelp")}</Text>
                </View>

                <View
                    className="mt-6 overflow-hidden rounded-[28px] bg-[#FFF7FB] px-5 py-6"
                    style={{
                        shadowColor: "#FF4D8D",
                        shadowOpacity: 0.22,
                        shadowRadius: 18,
                        shadowOffset: {width: 0, height: 10},
                        elevation: 8,
                    }}
                >
                    <Svg
                        pointerEvents="none"
                        style={{position: "absolute", top: 0, left: 0, right: 0, bottom: 0}}
                        viewBox="0 0 360 360"
                        preserveAspectRatio="none"
                    >
                        <Defs>
                            <LinearGradient
                                id="settingsGlow"
                                x1="0%"
                                y1="0%"
                                x2="100%"
                                y2="100%"
                            >
                                <Stop offset="0%" stopColor="#FFF7FB" />
                                <Stop offset="100%" stopColor="#FFE5F0" />
                            </LinearGradient>
                            <LinearGradient id="settingsHeartInk" x1="0%" y1="0%" x2="100%" y2="0%">
                                <Stop offset="0%" stopColor="#FFD6E7" />
                                <Stop offset="100%" stopColor="#FFBFD6" />
                            </LinearGradient>
                            <Pattern id="settingsHeartPattern" width="48" height="48" patternUnits="userSpaceOnUse">
                                <SvgText x="6" y="26" fontSize="12" fill="url(#settingsHeartInk)" opacity="0.45">
                                    ♡
                                </SvgText>
                                <SvgText x="26" y="16" fontSize="10" fill="url(#settingsHeartInk)" opacity="0.3">
                                    ♡
                                </SvgText>
                                <SvgText x="30" y="38" fontSize="11" fill="url(#settingsHeartInk)" opacity="0.25">
                                    ♡
                                </SvgText>
                            </Pattern>
                            <LinearGradient id="settingsTopGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                                <Stop offset="0%" stopColor="#FFB3D3" />
                                <Stop offset="45%" stopColor="#FF84B3" />
                                <Stop offset="100%" stopColor="#FFC06F" />
                            </LinearGradient>
                        </Defs>
                        <Rect x="0" y="0" width="360" height="360" fill="url(#settingsGlow)" />
                        <Rect x="0" y="0" width="360" height="360" fill="url(#settingsHeartPattern)" opacity="0.7" />
                        <Rect x="0" y="0" width="360" height="110" rx="28" fill="url(#settingsTopGlow)" opacity="0.22" />
                    </Svg>
                    <View
                        pointerEvents="none"
                        className="absolute -top-10 -right-8 h-[120px] w-[120px] rounded-full bg-[#FFD1E6] opacity-75"
                    />
                    <View
                        pointerEvents="none"
                        className="absolute -bottom-10 -left-8 h-[120px] w-[120px] rounded-full bg-[#FFE0EE] opacity-80"
                    />
                    <Text className="text-[13px] font-semibold text-[#FF6F9C]">
                        {t("language")}
                    </Text>
                    <View className="mt-4 gap-2">
                        {options.map((option) => {
                            const active = option.value === locale;
                            return (
                                <Pressable
                                    key={option.value}
                                    onPress={() => {
                                        if (option.value !== locale) {
                                            setLocale(option.value);
                                            showSavedToast();
                                        }
                                    }}
                                    className="flex-row items-center rounded-2xl px-4 py-3"
                                    style={{
                                        backgroundColor: active ? "#FFE3EE" : "rgba(255,255,255,0.9)",
                                        borderWidth: 1,
                                        borderColor: active ? "#FFBBD5" : "#FFE7F1",
                                    }}
                                >
                                    <View
                                        className="mr-3 h-4 w-4 items-center justify-center rounded-full border"
                                        style={{
                                            borderColor: active ? "#FF3B82" : "#FFB2C7",
                                        }}
                                    >
                                        {active && (
                                            <View className="h-2.5 w-2.5 rounded-full bg-[#FF3B82]" />
                                        )}
                                    </View>
                                    <Text
                                        className="text-[14px] font-semibold"
                                        style={{color: active ? "#FF3B82" : "#FF7EA6"}}
                                    >
                                        {option.label}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>
                </View>
            </View>
            {showToast && (
                <Animated.View
                    pointerEvents="none"
                    className="absolute bottom-10 left-6 right-6 rounded-2xl bg-[#FF4D8D] px-4 py-3 shadow-sm"
                    style={{
                        transform: [
                            {
                                translateY: toastAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [10, 0],
                                }),
                            },
                        ],
                        opacity: toastAnim,
                    }}
                >
                    <Text className="text-center text-[13px] font-semibold text-white">
                        ❤ {t("languageSaved")}
                    </Text>
                </Animated.View>
            )}
        </SafeAreaView>
    );
}

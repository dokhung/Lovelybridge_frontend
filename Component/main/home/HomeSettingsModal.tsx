import React from "react";
import { Animated, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import {
    Defs,
    LinearGradient,
    Pattern,
    Rect,
    Stop,
    Svg,
    Text as SvgText,
} from "react-native-svg";
import { type Locale, type TranslationKey } from "../../i18n/i18n";

type LocaleOption = { label: string; value: Locale };

type Props = {
    tt: (key: TranslationKey) => string;
    visible: boolean;
    onClose: () => void;
    onLogout: () => void;
    showLogout: boolean;
    sessionTimeoutMinutes: number;
    setSessionTimeoutMinutes: (value: number) => void;
    locale: Locale;
    options: LocaleOption[];
    setLocale: (value: Locale) => void;
    showSavedToast: () => void;
    showSettingsToast: boolean;
    settingsToastAnim: Animated.Value;
};

export default function HomeSettingsModal({
    tt,
    visible,
    onClose,
    onLogout,
    showLogout,
    sessionTimeoutMinutes,
    setSessionTimeoutMinutes,
    locale,
    options,
    setLocale,
    showSavedToast,
    showSettingsToast,
    settingsToastAnim,
}: Props) {
    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            presentationStyle="overFullScreen"
            statusBarTranslucent
            onRequestClose={onClose}
        >
            <View
                style={[
                    StyleSheet.absoluteFillObject,
                    {
                        alignItems: "center",
                        justifyContent: "center",
                        paddingHorizontal: 24,
                        backgroundColor: "rgba(255, 77, 141, 0.38)",
                    },
                ]}
            >
                <View
                    style={{
                        width: "100%",
                        maxWidth: 360,
                        borderRadius: 28,
                        overflow: "hidden",
                        backgroundColor: "#FFF7FB",
                        paddingHorizontal: 20,
                        paddingVertical: 18,
                        shadowColor: "#FF4D8D",
                        shadowOpacity: 0.22,
                        shadowRadius: 22,
                        shadowOffset: { width: 0, height: 14 },
                        elevation: 12,
                    }}
                >
                    <Svg
                        pointerEvents="none"
                        style={StyleSheet.absoluteFill}
                        viewBox="0 0 360 420"
                        preserveAspectRatio="none"
                    >
                        <Defs>
                            <LinearGradient id="settingsCardGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                                <Stop offset="0%" stopColor="#FFF7FB" />
                                <Stop offset="100%" stopColor="#FFE5F0" />
                            </LinearGradient>
                            <LinearGradient id="settingsHeartInk" x1="0%" y1="0%" x2="100%" y2="0%">
                                <Stop offset="0%" stopColor="#FFD6E7" />
                                <Stop offset="100%" stopColor="#FFBFD6" />
                            </LinearGradient>
                            <Pattern id="settingsHeartPattern" width="48" height="48" patternUnits="userSpaceOnUse">
                                <SvgText x="6" y="26" fontSize="12" fill="url(#settingsHeartInk)" opacity="0.5">
                                    ♡
                                </SvgText>
                                <SvgText x="26" y="16" fontSize="10" fill="url(#settingsHeartInk)" opacity="0.35">
                                    ♡
                                </SvgText>
                                <SvgText x="30" y="38" fontSize="11" fill="url(#settingsHeartInk)" opacity="0.3">
                                    ♡
                                </SvgText>
                            </Pattern>
                        </Defs>
                        <Rect x="0" y="0" width="360" height="420" fill="url(#settingsCardGlow)" />
                        <Rect x="0" y="0" width="360" height="420" fill="url(#settingsHeartPattern)" opacity="0.7" />
                    </Svg>

                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <View style={{ flex: 1, paddingRight: 12 }}>
                            <Text
                                style={{ fontSize: 22, fontWeight: "700", color: "#FF4D8D" }}
                                numberOfLines={1}
                                ellipsizeMode="tail"
                            >
                                {tt("settings")}
                            </Text>
                            <Text style={{ marginTop: 4, fontSize: 12, color: "#FF8FB1" }}>{tt("languageHelp")}</Text>
                        </View>
                        <Pressable
                            onPress={onClose}
                            style={{
                                width: 32,
                                height: 32,
                                borderRadius: 16,
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "#FFFFFF",
                                borderWidth: 1,
                                borderColor: "#FFE0ED",
                            }}
                        >
                            <Text style={{ fontSize: 16, color: "#FF6FAE" }}>×</Text>
                        </Pressable>
                    </View>

                    <Text style={{ marginTop: 14, fontSize: 12, fontWeight: "700", color: "#FF6F9C" }}>
                        {tt("language")}
                    </Text>
                    <View style={{ marginTop: 12, gap: 8 }}>
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
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        borderRadius: 16,
                                        paddingHorizontal: 14,
                                        paddingVertical: 10,
                                        backgroundColor: active ? "#FFE3EE" : "rgba(255,255,255,0.9)",
                                        borderWidth: 1,
                                        borderColor: active ? "#FFBBD5" : "#FFE7F1",
                                    }}
                                >
                                    <View
                                        style={{
                                            marginRight: 12,
                                            width: 16,
                                            height: 16,
                                            borderRadius: 8,
                                            alignItems: "center",
                                            justifyContent: "center",
                                            borderWidth: 1,
                                            borderColor: active ? "#FF3B82" : "#FFB2C7",
                                        }}
                                    >
                                        {active && (
                                            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: "#FF3B82" }} />
                                        )}
                                    </View>
                                    <Text style={{ fontSize: 14, fontWeight: "600", color: active ? "#FF3B82" : "#FF7EA6" }}>
                                        {option.label}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>

                    <Text style={{ marginTop: 18, fontSize: 12, fontWeight: "700", color: "#FF6F9C" }}>
                        {tt("sessionTimeout")}
                    </Text>
                    <Text style={{ marginTop: 4, fontSize: 11, color: "#FF9BB7" }}>
                        {tt("sessionTimeoutHelp")}
                    </Text>
                    <View style={{ marginTop: 10, flexDirection: "row", gap: 8 }}>
                        {[15, 30, 60].map((minutes) => {
                            const active = minutes === sessionTimeoutMinutes;
                            return (
                                <Pressable
                                    key={minutes}
                                    onPress={() => setSessionTimeoutMinutes(minutes)}
                                    style={{
                                        flex: 1,
                                        borderRadius: 14,
                                        paddingVertical: 10,
                                        alignItems: "center",
                                        backgroundColor: active ? "#FFE3EE" : "rgba(255,255,255,0.9)",
                                        borderWidth: 1,
                                        borderColor: active ? "#FFBBD5" : "#FFE7F1",
                                    }}
                                >
                                    <Text style={{ fontSize: 13, fontWeight: "700", color: active ? "#FF3B82" : "#FF7EA6" }}>
                                        {minutes}
                                        {tt("minutes")}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <Text style={{ fontSize: 11, color: "#FF9BB7" }}>{tt("customMinutes")}</Text>
                        <TextInput
                            style={{
                                marginTop: 6,
                                borderRadius: 12,
                                backgroundColor: "#FFFFFF",
                                paddingHorizontal: 12,
                                paddingVertical: 8,
                                fontSize: 13,
                                color: "#FF4D8D",
                                borderWidth: 1,
                                borderColor: "#FFE7F1",
                            }}
                            keyboardType="number-pad"
                            placeholder="30"
                            placeholderTextColor="#FFB3C8"
                            value={String(sessionTimeoutMinutes)}
                            onChangeText={(value) => {
                                const cleaned = value.replace(/[^0-9]/g, "");
                                const next = Number(cleaned);
                                if (Number.isFinite(next) && next > 0 && next <= 240) {
                                    setSessionTimeoutMinutes(next);
                                }
                            }}
                        />
                    </View>

                    {showLogout && (
                        <Pressable
                            onPress={onLogout}
                            style={{
                                marginTop: 16,
                                borderRadius: 16,
                                paddingVertical: 12,
                                alignItems: "center",
                                backgroundColor: "#FFE3EE",
                                borderWidth: 1,
                                borderColor: "#FFBBD5",
                            }}
                        >
                            <Text style={{ fontSize: 14, fontWeight: "700", color: "#FF4D8D" }}>
                                {tt("logout")}
                            </Text>
                        </Pressable>
                    )}
                </View>

                {showSettingsToast && (
                    <Animated.View
                        pointerEvents="none"
                        style={{
                            position: "absolute",
                            bottom: 40,
                            left: 24,
                            right: 24,
                            borderRadius: 16,
                            backgroundColor: "#FF4D8D",
                            paddingVertical: 10,
                            paddingHorizontal: 16,
                            transform: [
                                {
                                    translateY: settingsToastAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [10, 0],
                                    }),
                                },
                            ],
                            opacity: settingsToastAnim,
                        }}
                    >
                        <Text style={{ textAlign: "center", fontSize: 13, fontWeight: "700", color: "#FFFFFF" }}>
                            ❤ {tt("languageSaved")}
                        </Text>
                    </Animated.View>
                )}
            </View>
        </Modal>
    );
}

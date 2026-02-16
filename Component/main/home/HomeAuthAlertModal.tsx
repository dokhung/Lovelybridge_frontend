import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Circle, Defs, LinearGradient, Path, Rect, Stop, Svg } from "react-native-svg";
import { type TranslationKey } from "../../i18n/i18n";

type Props = {
    tt: (key: TranslationKey) => string;
    visible: boolean;
    titleKey: TranslationKey;
    bodyKey: TranslationKey;
    confirmKey: TranslationKey;
    onConfirm: () => void;
};

export default function HomeAuthAlertModal({
    tt,
    visible,
    titleKey,
    bodyKey,
    confirmKey,
    onConfirm,
}: Props) {
    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            presentationStyle="overFullScreen"
            statusBarTranslucent
            onRequestClose={onConfirm}
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
                        maxWidth: 340,
                        borderRadius: 26,
                        overflow: "hidden",
                        backgroundColor: "#FFF7FB",
                        shadowColor: "#FF4D8D",
                        shadowOpacity: 0.24,
                        shadowRadius: 24,
                        shadowOffset: { width: 0, height: 16 },
                        elevation: 12,
                    }}
                >
                    <Svg
                        pointerEvents="none"
                        style={StyleSheet.absoluteFill}
                        viewBox="0 0 340 260"
                        preserveAspectRatio="none"
                    >
                        <Defs>
                            <LinearGradient id="alertGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                                <Stop offset="0%" stopColor="#FFF7FB" />
                                <Stop offset="100%" stopColor="#FFE5F0" />
                            </LinearGradient>
                        </Defs>
                        <Rect x="0" y="0" width="340" height="260" rx="26" fill="url(#alertGlow)" />
                    </Svg>

                    <View style={{ padding: 24, alignItems: "center" }}>
                        <View
                            style={{
                                width: 64,
                                height: 64,
                                borderRadius: 32,
                                backgroundColor: "#FFF0F6",
                                alignItems: "center",
                                justifyContent: "center",
                                marginBottom: 12,
                            }}
                        >
                            <Svg width={34} height={34} viewBox="0 0 24 24">
                                <Circle cx="12" cy="12" r="11" stroke="#FF9BB7" strokeWidth="2" fill="none" />
                                <Path
                                    d="M12 7v6"
                                    stroke="#FF4D8D"
                                    strokeWidth="2.4"
                                    strokeLinecap="round"
                                    fill="none"
                                />
                                <Circle cx="12" cy="16.5" r="1.2" fill="#FF4D8D" />
                            </Svg>
                        </View>

                        <Text style={{ fontSize: 20, fontWeight: "800", color: "#FF4D8D", textAlign: "center" }}>
                            {tt(titleKey)}
                        </Text>
                        <Text
                            style={{
                                marginTop: 6,
                                fontSize: 12,
                                color: "#FF8FB1",
                                textAlign: "center",
                            }}
                        >
                            {tt(bodyKey)}
                        </Text>

                        <Pressable style={{ marginTop: 18, width: "100%" }} onPress={onConfirm}>
                            <View style={{ borderRadius: 999, overflow: "hidden" }}>
                                <Svg height={44} width="100%" viewBox="0 0 320 44" preserveAspectRatio="none">
                                    <Defs>
                                        <LinearGradient id="alertButtonFill" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <Stop offset="0%" stopColor="#FF2F7B" />
                                            <Stop offset="35%" stopColor="#FF5FA8" />
                                            <Stop offset="70%" stopColor="#FF8EC7" />
                                            <Stop offset="100%" stopColor="#FFD16B" />
                                        </LinearGradient>
                                    </Defs>
                                    <Rect x="0" y="0" width="320" height="44" rx="22" fill="url(#alertButtonFill)" />
                                </Svg>
                                <View
                                    style={{
                                        position: "absolute",
                                        left: 0,
                                        right: 0,
                                        top: 0,
                                        bottom: 0,
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Text style={{ fontSize: 15, fontWeight: "700", color: "#fff" }}>
                                        {tt(confirmKey)}
                                    </Text>
                                </View>
                            </View>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

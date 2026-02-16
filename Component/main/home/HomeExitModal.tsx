import React from "react";
import { BackHandler, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import {
    Defs,
    LinearGradient,
    Pattern,
    Rect,
    Stop,
    Svg,
    Text as SvgText,
} from "react-native-svg";
import { type TranslationKey } from "../../i18n/i18n";

type Props = {
    tt: (key: TranslationKey) => string;
    visible: boolean;
    onClose: () => void;
};

export default function HomeExitModal({ tt, visible, onClose }: Props) {
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
                        maxWidth: 340,
                        borderRadius: 26,
                        overflow: "hidden",
                        backgroundColor: "#FFF7FB",
                        paddingHorizontal: 20,
                        paddingVertical: 18,
                        shadowColor: "#FF4D8D",
                        shadowOpacity: 0.22,
                        shadowRadius: 20,
                        shadowOffset: { width: 0, height: 12 },
                        elevation: 10,
                    }}
                >
                    <Svg
                        pointerEvents="none"
                        style={StyleSheet.absoluteFill}
                        viewBox="0 0 340 260"
                        preserveAspectRatio="none"
                    >
                        <Defs>
                            <LinearGradient id="exitCardGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                                <Stop offset="0%" stopColor="#FFF7FB" />
                                <Stop offset="100%" stopColor="#FFE5F0" />
                            </LinearGradient>
                            <LinearGradient id="exitHeartInk" x1="0%" y1="0%" x2="100%" y2="0%">
                                <Stop offset="0%" stopColor="#FFD6E7" />
                                <Stop offset="100%" stopColor="#FFBFD6" />
                            </LinearGradient>
                            <Pattern id="exitHeartPattern" width="48" height="48" patternUnits="userSpaceOnUse">
                                <SvgText x="6" y="26" fontSize="12" fill="url(#exitHeartInk)" opacity="0.5">
                                    ♡
                                </SvgText>
                                <SvgText x="26" y="16" fontSize="10" fill="url(#exitHeartInk)" opacity="0.35">
                                    ♡
                                </SvgText>
                                <SvgText x="30" y="38" fontSize="11" fill="url(#exitHeartInk)" opacity="0.3">
                                    ♡
                                </SvgText>
                            </Pattern>
                        </Defs>
                        <Rect x="0" y="0" width="340" height="260" fill="url(#exitCardGlow)" />
                        <Rect x="0" y="0" width="340" height="260" fill="url(#exitHeartPattern)" opacity="0.7" />
                    </Svg>

                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <View>
                            <Text style={{ fontSize: 20, fontWeight: "700", color: "#FF4D8D" }}>{tt("exit")}</Text>
                            <Text style={{ marginTop: 4, fontSize: 12, color: "#FF8FB1" }}>{tt("seeYouSoon")}</Text>
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

                    <Text style={{ marginTop: 14, fontSize: 13, color: "#FF7EA6", textAlign: "center" }}>{tt("exitConfirm")}</Text>

                    <View style={{ marginTop: 16, gap: 10 }}>
                        <Pressable onPress={onClose}>
                            <Text
                                style={{
                                    width: "100%",
                                    borderRadius: 999,
                                    paddingVertical: 10,
                                    textAlign: "center",
                                    fontSize: 16,
                                    fontWeight: "600",
                                    color: "#FF4D8D",
                                    backgroundColor: "#FFE3EE",
                                }}
                            >
                                {tt("close")}
                            </Text>
                        </Pressable>
                        <Pressable onPress={() => BackHandler.exitApp()}>
                            <Text
                                style={{
                                    width: "100%",
                                    borderRadius: 999,
                                    paddingVertical: 10,
                                    textAlign: "center",
                                    fontSize: 16,
                                    fontWeight: "700",
                                    color: "#FFFFFF",
                                    backgroundColor: "#FF4D8D",
                                }}
                            >
                                {tt("exitAction")}
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

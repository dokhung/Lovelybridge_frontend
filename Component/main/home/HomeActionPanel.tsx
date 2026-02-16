import React from "react";
import { Animated, Pressable, Text, View } from "react-native";
import { type TranslationKey } from "../../i18n/i18n";

type ActionKey = "login" | "signup" | "exit";

type Props = {
    tt: (key: TranslationKey) => string;
    actionsFade: Animated.Value;
    activeAction: ActionKey | null;
    onLoginPress: () => void;
    onSignupPress: () => void;
    onExitPress: () => void;
    onSettingsPress: () => void;
};

export default function HomeActionPanel({
    tt,
    actionsFade,
    activeAction,
    onLoginPress,
    onSignupPress,
    onExitPress,
    onSettingsPress,
}: Props) {
    return (
        <Animated.View style={{ opacity: actionsFade, marginTop: 36 }}>
            <View
                style={{
                    width: 280,
                    borderRadius: 28,
                    paddingVertical: 18,
                    paddingHorizontal: 16,
                    backgroundColor: "rgba(255, 255, 255, 0.78)",
                    borderWidth: 1,
                    borderColor: "#FFE0ED",
                    shadowColor: "#FF6FAE",
                    shadowOpacity: 0.2,
                    shadowRadius: 18,
                    shadowOffset: { width: 0, height: 12 },
                    elevation: 7,
                    alignItems: "center",
                }}
            >
                <View
                    pointerEvents="none"
                    style={{
                        position: "absolute",
                        top: -6,
                        left: -6,
                        right: -6,
                        bottom: -6,
                        borderRadius: 32,
                        borderWidth: 1,
                        borderColor: "rgba(255, 171, 205, 0.5)",
                    }}
                />

                <View style={{ width: "100%", gap: 12 }}>
                    <Pressable onPress={onLoginPress}>
                        <Text
                            style={{
                                width: "100%",
                                borderRadius: 999,
                                paddingVertical: 10,
                                textAlign: "center",
                                fontSize: 18,
                                fontWeight: "700",
                                color: "#FF4D8D",
                                backgroundColor: activeAction === "login" ? "#FFC4DA" : "#FFE3EE",
                            }}
                        >
                            {tt("login")}
                        </Text>
                    </Pressable>

                    <Pressable onPress={onSignupPress}>
                        <Text
                            style={{
                                width: "100%",
                                borderRadius: 999,
                                paddingVertical: 10,
                                textAlign: "center",
                                fontSize: 18,
                                fontWeight: "700",
                                color: "#FF4D8D",
                                backgroundColor: activeAction === "signup" ? "#FFBBD5" : "#FFD1E3",
                            }}
                        >
                            {tt("signup")}
                        </Text>
                    </Pressable>

                    <Pressable onPress={onSettingsPress}>
                        <Text
                            style={{
                                width: "100%",
                                borderRadius: 999,
                                paddingVertical: 10,
                                textAlign: "center",
                                fontSize: 18,
                                fontWeight: "700",
                                color: "#FF4D8D",
                                backgroundColor: "#FFFFFF",
                            }}
                        >
                            {tt("settings")}
                        </Text>
                    </Pressable>

                    <Pressable onPress={onExitPress}>
                        <Text
                            style={{
                                width: "100%",
                                borderRadius: 999,
                                paddingVertical: 10,
                                textAlign: "center",
                                fontSize: 18,
                                fontWeight: "700",
                                color: "#FF4D8D",
                                backgroundColor: activeAction === "exit" ? "#FFD7E6" : "#FFEFF5",
                            }}
                        >
                            {tt("exit")}
                        </Text>
                    </Pressable>
                </View>
            </View>
        </Animated.View>
    );
}

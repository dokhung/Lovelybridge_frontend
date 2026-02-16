import React from "react";
import { Animated, View } from "react-native";
import { type TranslationKey } from "../../i18n/i18n";
import HomeActionPanel from "./HomeActionPanel";
import HomeTitleSection from "./HomeTitleSection";

type ActionKey = "login" | "signup" | "exit";

type Props = {
    tt: (key: TranslationKey) => string;
    showActions: boolean;
    hintBlink: Animated.Value;
    titleLift: Animated.Value;
    titlePulse: Animated.Value;
    toggleActions: () => void;
    actionsFade: Animated.Value;
    activeAction: ActionKey | null;
    onLoginPress: () => void;
    onSignupPress: () => void;
    onExitPress: () => void;
    onSettingsPress: () => void;
};

export default function HomeMain({
    tt,
    showActions,
    hintBlink,
    titleLift,
    titlePulse,
    toggleActions,
    actionsFade,
    activeAction,
    onLoginPress,
    onSignupPress,
    onExitPress,
    onSettingsPress,
}: Props) {
    return (
        <View
            style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 24,
            }}
        >
            {/* glow blobs */}
            <View
                pointerEvents="none"
                style={{
                    position: "absolute",
                    top: 60,
                    left: -40,
                    width: 220,
                    height: 220,
                    borderRadius: 110,
                    backgroundColor: "#FFE0EE",
                    opacity: 0.7,
                }}
            />
            <View
                pointerEvents="none"
                style={{
                    position: "absolute",
                    bottom: 110,
                    right: -70,
                    width: 260,
                    height: 260,
                    borderRadius: 130,
                    backgroundColor: "#FFD1E6",
                    opacity: 0.55,
                }}
            />

            <HomeTitleSection
                tt={tt}
                showActions={showActions}
                hintBlink={hintBlink}
                titleLift={titleLift}
                titlePulse={titlePulse}
                onPress={toggleActions}
            />

            <HomeActionPanel
                tt={tt}
                actionsFade={actionsFade}
                activeAction={activeAction}
                onLoginPress={onLoginPress}
                onSignupPress={onSignupPress}
                onExitPress={onExitPress}
                onSettingsPress={onSettingsPress}
            />
        </View>
    );
}

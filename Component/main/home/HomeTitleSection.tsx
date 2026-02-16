import React from "react";
import {
    Animated,
    Pressable,
    Text,
    View,
    useWindowDimensions,
} from "react-native";
import { type TranslationKey } from "../../i18n/i18n";

type Props = {
    tt: (key: TranslationKey) => string;
    showActions: boolean;
    hintBlink: Animated.Value;
    titleLift: Animated.Value;
    titlePulse: Animated.Value;
    onPress: () => void;
};

export default function HomeTitleSection({
                                             tt,
                                             showActions,
                                             hintBlink,
                                             titleLift,
                                             titlePulse,
                                             onPress,
                                         }: Props) {
    const { width } = useWindowDimensions();

    const baseSize = width * 0.17;
    const titleFontSize = Math.min(baseSize, 90);

    return (
        <View style={{ flex: 1 }}>
            {/* 🔹 상단 영역 */}
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Pressable onPress={onPress}>
                    <Animated.View
                        style={{
                            alignItems: "center",
                            transform: [
                                { translateY: titleLift },
                                { scale: titlePulse },
                            ],
                        }}
                    >
                        <Text
                            style={{
                                fontSize: titleFontSize,
                                fontWeight: "900",
                                color: "#FF4D8D",
                                textAlign: "center",
                                letterSpacing: 1,
                            }}
                        >
                            Lovely
                        </Text>

                        <Text
                            style={{
                                fontSize: titleFontSize * 0.85,
                                fontWeight: "800",
                                color: "#FF4D8D",
                                textAlign: "center",
                                marginTop: -8,
                            }}
                        >
                            Bridge
                        </Text>
                    </Animated.View>
                </Pressable>
            </View>

            {/* 🔹 하단 영역 */}
            {!showActions && (
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Pressable onPress={onPress} hitSlop={10}>
                        <Animated.Text
                            style={{
                                opacity: hintBlink,
                                fontSize: 16,
                                color: "#FF85A2",
                            }}
                        >
                            {tt("tapTitle")}
                        </Animated.Text>
                    </Pressable>
                </View>
            )}
        </View>
    );
}

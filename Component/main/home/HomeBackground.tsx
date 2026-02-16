import React from "react";
import { Animated, StyleSheet, View } from "react-native";

type Bubble = {
    key: string;
    size: number;
    x: number;
    y: number;
    opacity: number;
    driftX: number;
    driftY: number;
};

type Props = {
    bubbles: Bubble[];
    bubbleAnims: Animated.Value[];
};

export default function HomeBackground({ bubbles, bubbleAnims }: Props) {
    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
            {bubbles.map((bubble, index) => {
                const floatY = bubbleAnims[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [-bubble.driftY, bubble.driftY],
                });
                const floatX = bubbleAnims[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [-bubble.driftX, bubble.driftX],
                });

                return (
                    <Animated.View
                        key={bubble.key}
                        style={{
                            position: "absolute",
                            width: bubble.size,
                            height: bubble.size,
                            borderRadius: bubble.size / 2,
                            backgroundColor: "#FFD6E7",
                            opacity: bubble.opacity,
                            top: bubble.y,
                            left: bubble.x,
                            transform: [{ translateX: floatX }, { translateY: floatY }],
                        }}
                    />
                );
            })}
        </View>
    );
}

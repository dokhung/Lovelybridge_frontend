import React from "react";
import {
    Animated,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import {
    Circle,
    Defs,
    LinearGradient,
    Path,
    Pattern,
    Rect,
    Stop,
    Svg,
    Text as SvgText,
} from "react-native-svg";
import { type TranslationKey } from "../../i18n/i18n";

type Heart = {
    key: string;
    size: number;
    x: number;
    y: number;
};

type Props = {
    tt: (key: TranslationKey) => string;
    hearts: Heart[];
    heartAnims: Animated.Value[];
    shimmerAnim: Animated.Value;
    visible: boolean;
    onClose: () => void;
    loginEmail: string;
    setLoginEmail: (value: string) => void;
    loginPassword: string;
    setLoginPassword: (value: string) => void;
    loginError: string | null;
    onSubmit: () => void;
    onGooglePress: () => void;
};

export default function HomeLoginModal({
    tt,
    hearts,
    heartAnims,
    shimmerAnim,
    visible,
    onClose,
    loginEmail,
    setLoginEmail,
    loginPassword,
    setLoginPassword,
    loginError,
    onSubmit,
    onGooglePress,
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
                {hearts.map((heart, index) => {
                    const floatY = heartAnims[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [8, -14],
                    });
                    const fade = heartAnims[index].interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [0.2, 0.6, 0.25],
                    });

                    return (
                        <Animated.Text
                            key={heart.key}
                            pointerEvents="none"
                            style={{
                                position: "absolute",
                                left: heart.x,
                                top: heart.y,
                                fontSize: heart.size,
                                color: "#FF8FB4",
                                opacity: fade,
                                transform: [{ translateY: floatY }],
                            }}
                        >
                            ♥
                        </Animated.Text>
                    );
                })}

                <View
                    style={{
                        width: "100%",
                        maxWidth: 380,
                        borderRadius: 32,
                        overflow: "hidden",
                        backgroundColor: "#FFF7FB",
                        shadowColor: "#FF4D8D",
                        shadowOpacity: 0.28,
                        shadowRadius: 28,
                        shadowOffset: { width: 0, height: 18 },
                        elevation: 14,
                    }}
                >
                    <Svg
                        pointerEvents="none"
                        style={StyleSheet.absoluteFill}
                        viewBox="0 0 360 520"
                        preserveAspectRatio="none"
                    >
                        <Defs>
                            <LinearGradient id="cardGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                                <Stop offset="0%" stopColor="#FFF7FB" />
                                <Stop offset="100%" stopColor="#FFE5F0" />
                            </LinearGradient>
                            <LinearGradient id="heartInk" x1="0%" y1="0%" x2="100%" y2="0%">
                                <Stop offset="0%" stopColor="#FFD6E7" />
                                <Stop offset="100%" stopColor="#FFBFD6" />
                            </LinearGradient>
                            <Pattern id="heartPattern" width="48" height="48" patternUnits="userSpaceOnUse">
                                <SvgText x="6" y="26" fontSize="12" fill="url(#heartInk)" opacity="0.5">
                                    ♡
                                </SvgText>
                                <SvgText x="26" y="16" fontSize="10" fill="url(#heartInk)" opacity="0.35">
                                    ♡
                                </SvgText>
                                <SvgText x="30" y="38" fontSize="11" fill="url(#heartInk)" opacity="0.3">
                                    ♡
                                </SvgText>
                            </Pattern>
                        </Defs>
                        <Rect x="0" y="0" width="360" height="520" fill="url(#cardGlow)" />
                        <Rect x="0" y="0" width="360" height="520" fill="url(#heartPattern)" opacity="0.7" />
                    </Svg>

                    <View style={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 24 }}>
                        <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" }}>
                            <View>
                                <Text style={{ fontSize: 24, fontWeight: "700", color: "#FF4D8D" }}>{tt("login")}</Text>
                                <Text style={{ marginTop: 4, fontSize: 12, color: "#FF8FB1" }}>{tt("heartWelcome")}</Text>
                            </View>
                            <Pressable
                                onPress={onClose}
                                style={{
                                    height: 36,
                                    width: 36,
                                    borderRadius: 999,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: "#fff",
                                    borderWidth: 1,
                                    borderColor: "#FFE0ED",
                                }}
                            >
                                <Text style={{ fontSize: 18, color: "#FF6FAE" }}>×</Text>
                            </Pressable>
                        </View>

                        <Pressable
                            onPress={onGooglePress}
                            style={{
                                marginTop: 20,
                                width: "100%",
                                borderRadius: 999,
                                borderWidth: 1,
                                borderColor: "#F0D7E2",
                                backgroundColor: "#fff",
                                paddingVertical: 12,
                            }}
                        >
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }}>
                                <Svg width={18} height={18} viewBox="0 0 18 18">
                                    <Circle cx="9" cy="9" r="8" stroke="#FF4D8D" strokeWidth="2" fill="none" />
                                    <Path d="M9 3a6 6 0 1 0 6 6h-6" stroke="#FF6FAE" strokeWidth="2" fill="none" />
                                </Svg>
                                <Text style={{ fontSize: 14, fontWeight: "700", color: "#FF4D8D" }}>
                                    {tt("continueGoogle")}
                                </Text>
                            </View>
                        </Pressable>

                        <View style={{ marginTop: 16, flexDirection: "row", alignItems: "center" }}>
                            <View style={{ height: 1, flex: 1, backgroundColor: "#FFE0ED" }} />
                            <Text style={{ marginHorizontal: 8, fontSize: 11, color: "#FF9BB7" }}>
                                {tt("loginWithEmail")}
                            </Text>
                            <View style={{ height: 1, flex: 1, backgroundColor: "#FFE0ED" }} />
                        </View>

                        <View style={{ marginTop: 16 }}>
                            <Text style={{ marginBottom: 8, fontSize: 12, fontWeight: "700", color: "#FF6F9C" }}>
                                {tt("email")}
                            </Text>
                            <TextInput
                                style={{
                                    borderRadius: 16,
                                    backgroundColor: "#fff",
                                    paddingHorizontal: 16,
                                    paddingVertical: 12,
                                    fontSize: 14,
                                    color: "#FF4D8D",
                                }}
                                placeholder="you@example.com"
                                placeholderTextColor="#FFB3C8"
                                autoCapitalize="none"
                                keyboardType="email-address"
                                value={loginEmail}
                                onChangeText={setLoginEmail}
                            />
                        </View>

                        <View style={{ marginTop: 12 }}>
                            <Text style={{ marginBottom: 8, fontSize: 12, fontWeight: "700", color: "#FF6F9C" }}>
                                {tt("password")}
                            </Text>
                            <TextInput
                                style={{
                                    borderRadius: 16,
                                    backgroundColor: "#fff",
                                    paddingHorizontal: 16,
                                    paddingVertical: 12,
                                    fontSize: 14,
                                    color: "#FF4D8D",
                                }}
                                placeholder={tt("passwordPlaceholder")}
                                placeholderTextColor="#FFB3C8"
                                secureTextEntry
                                value={loginPassword}
                                onChangeText={setLoginPassword}
                            />
                        </View>

                        {loginError && (
                            <Text style={{ marginTop: 10, textAlign: "center", fontSize: 12, color: "#FF5D8C" }}>
                                {loginError}
                            </Text>
                        )}

                        <Pressable style={{ marginTop: 18 }} onPress={onSubmit}>
                            <View
                                style={{
                                    borderRadius: 999,
                                    overflow: "hidden",
                                    width: "100%",
                                    minHeight: 48,
                                    justifyContent: "center",
                                }}
                            >
                                <Svg
                                    height={48}
                                    width="100%"
                                    viewBox="0 0 320 48"
                                    preserveAspectRatio="none"
                                    style={StyleSheet.absoluteFill}
                                >
                                    <Defs>
                                        <LinearGradient id="loveButton" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <Stop offset="0%" stopColor="#FF2F7B" />
                                            <Stop offset="35%" stopColor="#FF5FA8" />
                                            <Stop offset="70%" stopColor="#FF8EC7" />
                                            <Stop offset="100%" stopColor="#FFD16B" />
                                        </LinearGradient>
                                    </Defs>
                                    <Rect x="0" y="0" width="320" height="48" rx="24" fill="url(#loveButton)" />
                                </Svg>

                                <Text style={{ textAlign: "center", fontSize: 16, fontWeight: "800", color: "#fff" }}>
                                    {tt("loginAction")}
                                </Text>

                                <Animated.View
                                    pointerEvents="none"
                                    style={{
                                        position: "absolute",
                                        top: -6,
                                        left: 0,
                                        height: 60,
                                        width: 90,
                                        backgroundColor: "rgba(255,255,255,0.45)",
                                        borderRadius: 40,
                                        transform: [
                                            {
                                                translateX: shimmerAnim.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: [-120, 360],
                                                }),
                                            },
                                            { skewX: "-20deg" as any },
                                        ],
                                    }}
                                />
                            </View>
                        </Pressable>

                        <Text style={{ marginTop: 10, textAlign: "center", fontSize: 10, color: "#FF9BB7" }}>
                            {tt("termsNotice")}
                        </Text>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

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
    Defs,
    LinearGradient,
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
    visible: boolean;
    onClose: () => void;
    signupEmail: string;
    setSignupEmail: (value: string) => void;
    signupNickname: string;
    setSignupNickname: (value: string) => void;
    signupPassword: string;
    setSignupPassword: (value: string) => void;
    signupPasswordConfirm: string;
    setSignupPasswordConfirm: (value: string) => void;
    signupError: string | null;
    onSubmit: () => void;
    onSwitchToLogin: () => void;
};

export default function HomeSignupModal({
    tt,
    hearts,
    heartAnims,
    visible,
    onClose,
    signupEmail,
    setSignupEmail,
    signupNickname,
    setSignupNickname,
    signupPassword,
    setSignupPassword,
    signupPasswordConfirm,
    setSignupPasswordConfirm,
    signupError,
    onSubmit,
    onSwitchToLogin,
}: Props) {
    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            presentationStyle="overFullScreen"
            statusBarTranslucent
            onRequestClose={() => {}}
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
                            key={`signup-${heart.key}`}
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
                        viewBox="0 0 360 520"
                        preserveAspectRatio="none"
                    >
                        <Defs>
                            <LinearGradient id="signupCardGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                                <Stop offset="0%" stopColor="#FFF7FB" />
                                <Stop offset="100%" stopColor="#FFE5F0" />
                            </LinearGradient>
                            <LinearGradient id="signupHeartInk" x1="0%" y1="0%" x2="100%" y2="0%">
                                <Stop offset="0%" stopColor="#FFD6E7" />
                                <Stop offset="100%" stopColor="#FFBFD6" />
                            </LinearGradient>
                            <Pattern id="signupHeartPattern" width="48" height="48" patternUnits="userSpaceOnUse">
                                <SvgText x="6" y="26" fontSize="12" fill="url(#signupHeartInk)" opacity="0.5">
                                    ♡
                                </SvgText>
                                <SvgText x="26" y="16" fontSize="10" fill="url(#signupHeartInk)" opacity="0.35">
                                    ♡
                                </SvgText>
                                <SvgText x="30" y="38" fontSize="11" fill="url(#signupHeartInk)" opacity="0.3">
                                    ♡
                                </SvgText>
                            </Pattern>
                        </Defs>
                        <Rect x="0" y="0" width="360" height="520" fill="url(#signupCardGlow)" />
                        <Rect x="0" y="0" width="360" height="520" fill="url(#signupHeartPattern)" opacity="0.7" />
                    </Svg>

                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <View>
                            <Text style={{ fontSize: 22, fontWeight: "700", color: "#FF4D8D" }}>{tt("signupTitle")}</Text>
                            <Text style={{ marginTop: 4, fontSize: 12, color: "#FF8FB1" }}>{tt("signupSubtitle")}</Text>
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

                    <View style={{ marginTop: 14 }}>
                        <Text style={{ marginBottom: 6, fontSize: 12, fontWeight: "700", color: "#FF6F9C" }}>
                            {tt("email")}
                        </Text>
                        <TextInput
                            style={{
                                borderRadius: 14,
                                backgroundColor: "#FFFFFF",
                                paddingHorizontal: 16,
                                paddingVertical: 12,
                                fontSize: 14,
                                color: "#FF4D8D",
                            }}
                            placeholder="you@example.com"
                            placeholderTextColor="#FFB3C8"
                            autoCapitalize="none"
                            keyboardType="email-address"
                            value={signupEmail}
                            onChangeText={setSignupEmail}
                        />
                    </View>

                    <View style={{ marginTop: 12 }}>
                        <Text style={{ marginBottom: 6, fontSize: 12, fontWeight: "700", color: "#FF6F9C" }}>
                            {tt("nickname")}
                        </Text>
                        <TextInput
                            style={{
                                borderRadius: 14,
                                backgroundColor: "#FFFFFF",
                                paddingHorizontal: 16,
                                paddingVertical: 12,
                                fontSize: 14,
                                color: "#FF4D8D",
                            }}
                            placeholder="LovelyBridge"
                            placeholderTextColor="#FFB3C8"
                            value={signupNickname}
                            onChangeText={setSignupNickname}
                        />
                    </View>

                    <View style={{ marginTop: 12 }}>
                        <Text style={{ marginBottom: 6, fontSize: 12, fontWeight: "700", color: "#FF6F9C" }}>
                            {tt("password")}
                        </Text>
                        <TextInput
                            style={{
                                borderRadius: 14,
                                backgroundColor: "#FFFFFF",
                                paddingHorizontal: 16,
                                paddingVertical: 12,
                                fontSize: 14,
                                color: "#FF4D8D",
                            }}
                            placeholder={tt("passwordHint")}
                            placeholderTextColor="#FFB3C8"
                            secureTextEntry
                            autoComplete="off"
                            textContentType="none"
                            value={signupPassword}
                            onChangeText={setSignupPassword}
                        />
                        <Text style={{ marginTop: 6, fontSize: 11, color: "#FF9BB7" }}>{tt("passwordHint")}</Text>
                    </View>

                    <View style={{ marginTop: 12 }}>
                        <Text style={{ marginBottom: 6, fontSize: 12, fontWeight: "700", color: "#FF6F9C" }}>
                            {tt("passwordConfirm")}
                        </Text>
                        <TextInput
                            style={{
                                borderRadius: 14,
                                backgroundColor: "#FFFFFF",
                                paddingHorizontal: 16,
                                paddingVertical: 12,
                                fontSize: 14,
                                color: "#FF4D8D",
                            }}
                            placeholder={tt("passwordConfirmPlaceholder")}
                            placeholderTextColor="#FFB3C8"
                            secureTextEntry
                            autoComplete="off"
                            textContentType="none"
                            value={signupPasswordConfirm}
                            onChangeText={setSignupPasswordConfirm}
                        />
                    </View>

                    {signupError && (
                        <Text style={{ marginTop: 10, textAlign: "center", fontSize: 12, color: "#FF5D8C" }}>
                            {signupError}
                        </Text>
                    )}

                    <Pressable style={{ marginTop: 16 }} onPress={onSubmit}>
                        <View style={{ borderRadius: 999, overflow: "hidden" }}>
                            <Svg height={48} width="100%" viewBox="0 0 320 48" preserveAspectRatio="none">
                                <Defs>
                                    <LinearGradient id="signupButton" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <Stop offset="0%" stopColor="#FF2F7B" />
                                        <Stop offset="35%" stopColor="#FF5FA8" />
                                        <Stop offset="70%" stopColor="#FF8EC7" />
                                        <Stop offset="100%" stopColor="#FFD16B" />
                                    </LinearGradient>
                                </Defs>
                                <Rect x="0" y="0" width="320" height="48" rx="24" fill="url(#signupButton)" />
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
                                <Text style={{ fontSize: 16, fontWeight: "700", color: "#FFFFFF" }}>
                                    {tt("signupAction")}
                                </Text>
                            </View>
                        </View>
                    </Pressable>

                    <Pressable style={{ marginTop: 12 }} onPress={onSwitchToLogin} disabled>
                        <Text style={{ textAlign: "center", fontSize: 12, color: "#FF9BB7" }}>{tt("backToLogin")}</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}

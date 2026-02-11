import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    Animated,
    BackHandler,
    Dimensions,
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
import { useNavigation } from "@react-navigation/native";
import { Locale, useI18n, type TranslationKey } from "../i18n/i18n";

type ActionKey = "login" | "signup" | "exit";

export default function Home() {
    const navigation = useNavigation();
    const { t, locale, setLocale } = useI18n();

    // i18n fallback (키 누락/Provider 문제여도 빈 화면 방지)
    const tt = (key: TranslationKey) => {
        try {
            const v = t(key);
            return v ?? key;
        } catch {
            return key;
        }
    };

    const [showActions, setShowActions] = useState(false);
    const [activeAction, setActiveAction] = useState<ActionKey | null>(null);

    // ✅ 초기 진입에서 모달이 덮지 않게 false
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSignupModal, setShowSignupModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [showExitModal, setShowExitModal] = useState(false);

    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [loginError, setLoginError] = useState<string | null>(null);
    const [signupEmail, setSignupEmail] = useState("");
    const [signupNickname, setSignupNickname] = useState("");
    const [signupPassword, setSignupPassword] = useState("");
    const [signupError, setSignupError] = useState<string | null>(null);
    const [showSettingsToast, setShowSettingsToast] = useState(false);
    const settingsToastAnim = useRef(new Animated.Value(0)).current;
    const settingsToastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const titleLift = useRef(new Animated.Value(0)).current;
    const actionsFade = useRef(new Animated.Value(0)).current;
    const hintBlink = useRef(new Animated.Value(1)).current;
    const titlePulse = useRef(new Animated.Value(1)).current;
    const actionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const shimmerAnim = useRef(new Animated.Value(0)).current;

    const bubbles = useMemo(() => {
        const { width, height } = Dimensions.get("window");
        return Array.from({ length: 70 }, (_, index) => {
            const size = 10 + Math.floor(Math.random() * 22);
            const x = Math.random() * (width - size);
            const y = Math.random() * (height - size);
            const opacity = 0.62 + (index % 4) * 0.08;
            const duration = 2600 + (index % 6) * 380;
            const delay = index * 90;
            const driftX = 6 + (index % 5) * 4;
            const driftY = 10 + (index % 4) * 5;

            return {
                key: `b${index + 1}`,
                size,
                x,
                y,
                opacity,
                duration,
                delay,
                driftX,
                driftY,
            };
        });
    }, []);

    const bubbleAnims = useRef(bubbles.map(() => new Animated.Value(0))).current;

    const hearts = useMemo(() => {
        const { width, height } = Dimensions.get("window");
        return Array.from({ length: 14 }, (_, index) => {
            const size = 14 + (index % 6) * 5;
            const x = 10 + Math.random() * (width - 40);
            const y = height * 0.2 + Math.random() * (height * 0.5);
            const duration = 2000 + (index % 7) * 320;
            const delay = index * 220;
            return {
                key: `h${index + 1}`,
                size,
                x,
                y,
                duration,
                delay,
            };
        });
    }, []);

    const heartAnims = useRef(hearts.map(() => new Animated.Value(0))).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(hintBlink, {
                    toValue: 0.2,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(hintBlink, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [hintBlink]);

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(titlePulse, {
                    toValue: 1.06,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.timing(titlePulse, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [titlePulse]);

    useEffect(() => {
        bubbleAnims.forEach((anim, index) => {
            Animated.loop(
                Animated.sequence([
                    Animated.delay(bubbles[index].delay),
                    Animated.timing(anim, {
                        toValue: 1,
                        duration: bubbles[index].duration,
                        useNativeDriver: true,
                    }),
                    Animated.timing(anim, {
                        toValue: 0,
                        duration: bubbles[index].duration,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        });
    }, [bubbleAnims, bubbles]);

    useEffect(() => {
        heartAnims.forEach((anim, index) => {
            Animated.loop(
                Animated.sequence([
                    Animated.delay(hearts[index].delay),
                    Animated.timing(anim, {
                        toValue: 1,
                        duration: hearts[index].duration,
                        useNativeDriver: true,
                    }),
                    Animated.timing(anim, {
                        toValue: 0,
                        duration: hearts[index].duration,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        });
    }, [heartAnims, hearts]);

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(shimmerAnim, {
                    toValue: 1,
                    duration: 1600,
                    useNativeDriver: true,
                }),
                Animated.delay(600),
                Animated.timing(shimmerAnim, {
                    toValue: 0,
                    duration: 0,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [shimmerAnim]);

    useEffect(() => {
        return () => {
            if (actionTimerRef.current) clearTimeout(actionTimerRef.current);
            if (settingsToastTimer.current) clearTimeout(settingsToastTimer.current);
        };
    }, []);

    const toggleActions = () => {
        if (showActions) {
            Animated.parallel([
                Animated.timing(titleLift, {
                    toValue: 0,
                    duration: 260,
                    useNativeDriver: true,
                }),
                Animated.timing(actionsFade, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start(() => setShowActions(false));
            return;
        }

        setShowActions(true);
        Animated.parallel([
            Animated.timing(titleLift, {
                toValue: -64,
                duration: 420,
                useNativeDriver: true,
            }),
            Animated.timing(actionsFade, {
                toValue: 1,
                duration: 360,
                delay: 140,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const handleNavigate = (action: ActionKey, route: string) => {
        if (action === "login") {
            setShowLoginModal(true);
            setLoginError(null);
            return;
        }

        setActiveAction(action);
        if (actionTimerRef.current) clearTimeout(actionTimerRef.current);

        actionTimerRef.current = setTimeout(() => {
            // @ts-ignore
            navigation.navigate(route);
            setActiveAction(null);
        }, 140);
    };

    const closeAuthModal = () => {
        setShowLoginModal(false);
        setLoginError(null);
    };

    const closeSignupModal = () => {
        setShowSignupModal(false);
        setSignupError(null);
    };

    const closeSettingsModal = () => {
        setShowSettingsModal(false);
    };

    const closeExitModal = () => {
        setShowExitModal(false);
    };

    const isValidEmail = (value: string) => /\S+@\S+\.\S+/.test(value.trim());
    const hasEnglishSentence = (value: string) => /[A-Za-z]+ [A-Za-z]+/.test(value.trim());

    const handleLoginSubmit = () => {
        if (!isValidEmail(loginEmail)) {
            setLoginError(tt("errorEmail"));
            return;
        }
        if (!loginPassword.trim()) {
            setLoginError(tt("errorPassword"));
            return;
        }
        setLoginError(null);
        closeAuthModal();
    };

    const handleSignupSubmit = () => {
        if (!isValidEmail(signupEmail)) {
            setSignupError(tt("errorEmail"));
            return;
        }
        if (!signupNickname.trim()) {
            setSignupError(tt("errorNickname"));
            return;
        }
        if (!hasEnglishSentence(signupPassword)) {
            setSignupError(tt("errorPasswordSentence"));
            return;
        }
        setSignupError(null);
        setShowSignupModal(false);
    };

    const options: { label: string; value: Locale }[] = [
        { label: "한국어", value: "ko" },
        { label: "English", value: "en" },
        { label: "日本語", value: "ja" },
        { label: "中文", value: "zh" },
    ];

    const showSavedToast = () => {
        if (settingsToastTimer.current) clearTimeout(settingsToastTimer.current);
        setShowSettingsToast(true);
        Animated.timing(settingsToastAnim, {
            toValue: 1,
            duration: 220,
            useNativeDriver: true,
        }).start();
        settingsToastTimer.current = setTimeout(() => {
            Animated.timing(settingsToastAnim, {
                toValue: 0,
                duration: 220,
                useNativeDriver: true,
            }).start(() => setShowSettingsToast(false));
        }, 1400);
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#FFF4F8" }}>
            {/* background bubbles */}
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

                {/* ✅ 타이틀만 "가운데로" 보이게: 타이틀 컨테이너 marginBottom으로 중심 조정 */}
                <View style={{ marginBottom: 24 }}>
                    <Pressable onPress={toggleActions}>
                        <Animated.View
                            style={[
                                { position: "relative", alignItems: "center" },
                                { transform: [{ translateY: titleLift }, { scale: titlePulse }] },
                            ]}
                        >
                            <View
                                pointerEvents="none"
                                style={{
                                    position: "absolute",
                                    top: -18,
                                    bottom: -18,
                                    left: -30,
                                    right: -30,
                                    borderRadius: 140,
                                    backgroundColor: "#FFE3EE",
                                    opacity: 0.6,
                                }}
                            />
                            <View
                                pointerEvents="none"
                                style={{
                                    position: "absolute",
                                    top: -28,
                                    bottom: -28,
                                    left: -40,
                                    right: -40,
                                    borderRadius: 160,
                                    borderWidth: 1,
                                    borderColor: "#FFD0E3",
                                    opacity: 0.7,
                                }}
                            />
                            <Text
                                style={{
                                    fontSize: 96,
                                    lineHeight: 104,
                                    fontWeight: "800",
                                    color: "#FF4D8D",
                                    textAlign: "center",
                                }}
                            >
                                {tt("appName")}
                            </Text>
                        </Animated.View>
                    </Pressable>
                </View>

                {!showActions && (
                    <Animated.Text
                        style={{
                            opacity: hintBlink,
                            fontSize: 14,
                            color: "#FF85A2",
                            textAlign: "center",
                        }}
                    >
                        {tt("tapTitle")}
                    </Animated.Text>
                )}

                {/* actions */}
                <Animated.View style={{ opacity: actionsFade, marginTop: 12 }}>
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
                            <Pressable
                                onPress={() => {
                                    setShowLoginModal(true);
                                    setLoginError(null);
                                }}
                            >
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

                            <Pressable
                                onPress={() => {
                                    setShowSignupModal(true);
                                    setSignupError(null);
                                }}
                            >
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

                            <Pressable onPress={() => setShowExitModal(true)}>
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

                            <Pressable onPress={() => setShowSettingsModal(true)}>
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
                        </View>
                    </View>
                </Animated.View>
            </View>

            {/* login modal */}
            <Modal
                transparent
                visible={showLoginModal}
                animationType="fade"
                presentationStyle="overFullScreen"
                statusBarTranslucent
                onRequestClose={closeAuthModal}
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
                                    onPress={closeAuthModal}
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

                            <Pressable style={{ marginTop: 18 }} onPress={handleLoginSubmit}>
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

            {/* signup modal */}
            <Modal
                transparent
                visible={showSignupModal}
                animationType="fade"
                presentationStyle="overFullScreen"
                statusBarTranslucent
                onRequestClose={closeSignupModal}
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
                                <Text style={{ fontSize: 22, fontWeight: "700", color: "#FF4D8D" }}>
                                    {tt("signupTitle")}
                                </Text>
                                <Text style={{ marginTop: 4, fontSize: 12, color: "#FF8FB1" }}>
                                    {tt("signupSubtitle")}
                                </Text>
                            </View>
                            <Pressable
                                onPress={closeSignupModal}
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
                                value={signupPassword}
                                onChangeText={setSignupPassword}
                            />
                            <Text style={{ marginTop: 6, fontSize: 11, color: "#FF9BB7" }}>
                                {tt("passwordHint")}
                            </Text>
                        </View>

                        {signupError && (
                            <Text style={{ marginTop: 10, textAlign: "center", fontSize: 12, color: "#FF5D8C" }}>
                                {signupError}
                            </Text>
                        )}

                        <Pressable style={{ marginTop: 16 }} onPress={handleSignupSubmit}>
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

                        <Pressable
                            style={{ marginTop: 12 }}
                            onPress={() => {
                                setShowSignupModal(false);
                                setShowLoginModal(true);
                            }}
                        >
                            <Text style={{ textAlign: "center", fontSize: 12, color: "#FF9BB7" }}>
                                {tt("backToLogin")}
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            {/* settings modal */}
            <Modal
                transparent
                visible={showSettingsModal}
                animationType="fade"
                presentationStyle="overFullScreen"
                statusBarTranslucent
                onRequestClose={closeSettingsModal}
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
                                <Text style={{ marginTop: 4, fontSize: 12, color: "#FF8FB1" }}>
                                    {tt("languageHelp")}
                                </Text>
                            </View>
                            <Pressable
                                onPress={closeSettingsModal}
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
                                            {active && <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: "#FF3B82" }} />}
                                        </View>
                                        <Text style={{ fontSize: 14, fontWeight: "600", color: active ? "#FF3B82" : "#FF7EA6" }}>
                                            {option.label}
                                        </Text>
                                    </Pressable>
                                );
                            })}
                        </View>
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

            {/* exit modal */}
            <Modal
                transparent
                visible={showExitModal}
                animationType="fade"
                presentationStyle="overFullScreen"
                statusBarTranslucent
                onRequestClose={closeExitModal}
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
                                <Text style={{ fontSize: 20, fontWeight: "700", color: "#FF4D8D" }}>
                                    {tt("exit")}
                                </Text>
                                <Text style={{ marginTop: 4, fontSize: 12, color: "#FF8FB1" }}>
                                    {tt("seeYouSoon")}
                                </Text>
                            </View>
                            <Pressable
                                onPress={closeExitModal}
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

                        <Text style={{ marginTop: 14, fontSize: 13, color: "#FF7EA6", textAlign: "center" }}>
                            {tt("exitConfirm")}
                        </Text>

                        <View style={{ marginTop: 16, gap: 10 }}>
                            <Pressable onPress={closeExitModal}>
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
        </View>
    );
}

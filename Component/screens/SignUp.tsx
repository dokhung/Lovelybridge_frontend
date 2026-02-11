import React, {useMemo, useRef, useState} from "react";
import {Animated, Dimensions, Pressable, Text, TextInput, View} from "react-native";
import {Circle, Defs, LinearGradient, Path, Pattern, Rect, Stop, Svg, Text as SvgText} from "react-native-svg";
import {useNavigation} from "@react-navigation/native";
import {SafeAreaView} from "react-native-safe-area-context";
import {useI18n} from "../i18n/i18n";

export default function SignUp() {
    const navigation = useNavigation();
    const {t} = useI18n();
    const [email, setEmail] = useState("");
    const [nickname, setNickname] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const shimmerAnim = useRef(new Animated.Value(0)).current;
    const particles = useMemo(() => {
        const {width} = Dimensions.get("window");
        return Array.from({length: 10}, (_, index) => {
            const size = 10 + (index % 5) * 4;
            const x = 18 + (index * 32) % Math.max(220, width * 0.45);
            const y = 30 + (index * 46) % 260;
            const duration = 2200 + (index % 6) * 320;
            const delay = index * 220;
            return {key: `s${index + 1}`, size, x, y, duration, delay};
        });
    }, []);
    const particleAnims = useRef(particles.map(() => new Animated.Value(0))).current;

    const isValidEmail = (value: string) => /\S+@\S+\.\S+/.test(value.trim());
    const hasEnglishSentence = (value: string) => /[A-Za-z]+ [A-Za-z]+/.test(value.trim());

    React.useEffect(() => {
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
            ]),
        ).start();
    }, [shimmerAnim]);

    React.useEffect(() => {
        particleAnims.forEach((anim, index) => {
            Animated.loop(
                Animated.sequence([
                    Animated.delay(particles[index].delay),
                    Animated.timing(anim, {
                        toValue: 1,
                        duration: particles[index].duration,
                        useNativeDriver: true,
                    }),
                    Animated.timing(anim, {
                        toValue: 0,
                        duration: particles[index].duration,
                        useNativeDriver: true,
                    }),
                ]),
            ).start();
        });
    }, [particleAnims, particles]);

    const handleSubmit = () => {
        if (!isValidEmail(email)) {
            setError(t("errorEmail"));
            return;
        }
        if (!nickname.trim()) {
            setError(t("errorNickname"));
            return;
        }
        if (!hasEnglishSentence(password)) {
            setError(t("errorPasswordSentence"));
            return;
        }
        setError(null);
        navigation.goBack();
    };

    return (
        <SafeAreaView className="flex-1 bg-[#FFF0F6]" style={{flex: 1}}>
            <View className="absolute -top-16 -right-10 h-[220px] w-[220px] rounded-full bg-[#FFD1E3] opacity-70" />
            <View className="absolute -bottom-24 -left-16 h-[260px] w-[260px] rounded-full bg-[#FFE3EE] opacity-80" />
            <View className="flex-1 px-6" style={{flex: 1, justifyContent: "center"}}>
                <View className="items-center">
                    <Text className="text-center text-[30px] font-bold text-[#FF4D8D]">
                        {t("signupTitle")}
                    </Text>
                    <Text className="mt-2 text-center text-[13px] text-[#FF85A2]">
                        {t("signupSubtitle")}
                    </Text>
                    <View className="mt-2 rounded-full bg-[#FFE3EE] px-3 py-1">
                        <Text className="text-[10px] font-semibold text-[#FF6F9C]">
                            {t("signupBadge")}
                        </Text>
                    </View>
                </View>

                <View
                    className="mt-6 overflow-hidden rounded-[28px] bg-[#FFF7FB] px-6 py-6"
                    style={{
                        shadowColor: "#FF4D8D",
                        shadowOpacity: 0.26,
                        shadowRadius: 20,
                        shadowOffset: {width: 0, height: 12},
                        elevation: 10,
                    }}
                >
                    <Svg
                        pointerEvents="none"
                        style={{position: "absolute", top: 0, left: 0, right: 0, bottom: 0}}
                        viewBox="0 0 360 420"
                        preserveAspectRatio="none"
                    >
                        <Defs>
                            <LinearGradient
                                id="signupGlow"
                                x1="0%"
                                y1="0%"
                                x2="100%"
                                y2="100%"
                            >
                                <Stop offset="0%" stopColor="#FFF7FB" />
                                <Stop offset="100%" stopColor="#FFE5F0" />
                            </LinearGradient>
                            <LinearGradient id="signupHeartInk" x1="0%" y1="0%" x2="100%" y2="0%">
                                <Stop offset="0%" stopColor="#FFD6E7" />
                                <Stop offset="100%" stopColor="#FFBFD6" />
                            </LinearGradient>
                            <Pattern id="signupHeartPattern" width="48" height="48" patternUnits="userSpaceOnUse">
                                <SvgText x="6" y="26" fontSize="12" fill="url(#signupHeartInk)" opacity="0.45">
                                    ♡
                                </SvgText>
                                <SvgText x="26" y="16" fontSize="10" fill="url(#signupHeartInk)" opacity="0.3">
                                    ♡
                                </SvgText>
                                <SvgText x="30" y="38" fontSize="11" fill="url(#signupHeartInk)" opacity="0.25">
                                    ♡
                                </SvgText>
                            </Pattern>
                            <LinearGradient id="signupTopGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                                <Stop offset="0%" stopColor="#FFB3D3" />
                                <Stop offset="45%" stopColor="#FF84B3" />
                                <Stop offset="100%" stopColor="#FFC06F" />
                            </LinearGradient>
                        </Defs>
                        <Rect x="0" y="0" width="360" height="420" fill="url(#signupGlow)" />
                        <Rect x="0" y="0" width="360" height="420" fill="url(#signupHeartPattern)" opacity="0.7" />
                        <Rect x="0" y="0" width="360" height="120" rx="28" fill="url(#signupTopGlow)" opacity="0.25" />
                    </Svg>
                    <View
                        pointerEvents="none"
                        className="absolute -top-10 -right-8 h-[120px] w-[120px] rounded-full bg-[#FFD1E6] opacity-75"
                    />
                    <View
                        pointerEvents="none"
                        className="absolute -bottom-12 -left-10 h-[140px] w-[140px] rounded-full bg-[#FFE0EE] opacity-80"
                    />
                    <View pointerEvents="none" style={{position: "absolute", top: 0, left: 0, right: 0, bottom: 0}}>
                        {particles.map((particle, index) => {
                            const floatY = particleAnims[index].interpolate({
                                inputRange: [0, 1],
                                outputRange: [6, -10],
                            });
                            const fade = particleAnims[index].interpolate({
                                inputRange: [0, 0.5, 1],
                                outputRange: [0.18, 0.5, 0.22],
                            });
                            const heartColors = [
                                "#FF4D8D",
                                "#FF6FAE",
                                "#FF85A2",
                                "#FF9BB7",
                                "#FFB3C8",
                                "#FF7AAE",
                                "#FF96C5",
                                "#FFA6CE",
                            ];
                            return (
                                <Animated.Text
                                    key={particle.key}
                                    style={{
                                        position: "absolute",
                                        left: particle.x,
                                        top: particle.y,
                                        fontSize: particle.size,
                                        color: heartColors[index % heartColors.length],
                                        opacity: fade,
                                        transform: [{translateY: floatY}],
                                    }}
                                >
                                    ♥
                                </Animated.Text>
                            );
                        })}
                    </View>
                    <View className="absolute right-4 top-4 h-10 w-10 items-center justify-center rounded-full bg-white/80">
                        <Svg width={20} height={18} viewBox="0 0 32 28">
                            <Path
                                d="M16 26C10.2 21.4 2 15 2 8.8 2 5.6 4.6 3 7.8 3c2 0 3.8 1 4.8 2.6C13.6 4 15.8 3 18.2 3 21.4 3 24 5.6 24 8.8 24 15 15.8 21.4 16 26z"
                                fill="#FF6FAE"
                            />
                            <Circle cx="24.8" cy="5.6" r="2.4" fill="#FFC06F" />
                        </Svg>
                    </View>
                    <View>
                        <Text className="mb-2 text-[12px] font-semibold text-[#FF6F9C]">
                            {t("email")}
                        </Text>
                        <TextInput
                            className="rounded-2xl bg-white px-4 py-3 text-[14px] text-[#FF4D8D]"
                            placeholder="you@example.com"
                            placeholderTextColor="#FFB3C8"
                            autoCapitalize="none"
                            keyboardType="email-address"
                            value={email}
                            onChangeText={setEmail}
                        />
                    </View>
                    <View className="mt-4">
                        <Text className="mb-2 text-[12px] font-semibold text-[#FF6F9C]">
                            {t("nickname")}
                        </Text>
                        <TextInput
                            className="rounded-2xl bg-white px-4 py-3 text-[14px] text-[#FF4D8D]"
                            placeholder="LovelyBridge"
                            placeholderTextColor="#FFB3C8"
                            value={nickname}
                            onChangeText={setNickname}
                        />
                    </View>
                    <View className="mt-4">
                        <Text className="mb-2 text-[12px] font-semibold text-[#FF6F9C]">
                            {t("password")}
                        </Text>
                        <TextInput
                            className="rounded-2xl bg-white px-4 py-3 text-[14px] text-[#FF4D8D]"
                            placeholder={t("passwordHint")}
                            placeholderTextColor="#FFB3C8"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />
                        <Text className="mt-2 text-[11px] text-[#FF9BB7]">
                            {t("passwordHint")}
                        </Text>
                    </View>
                    {error && (
                        <Text className="mt-3 text-center text-[12px] text-[#FF5D8C]">
                            {error}
                        </Text>
                    )}
                    <Pressable className="mt-6 w-full" onPress={handleSubmit}>
                        <View style={{borderRadius: 999, overflow: "hidden"}}>
                            <Svg
                                height={48}
                                width="100%"
                                viewBox="0 0 320 48"
                                preserveAspectRatio="none"
                            >
                                <Defs>
                                    <LinearGradient
                                        id="signupButton"
                                        x1="0%"
                                        y1="0%"
                                        x2="100%"
                                        y2="100%"
                                    >
                                        <Stop offset="0%" stopColor="#FF2F7B" />
                                        <Stop offset="35%" stopColor="#FF5FA8" />
                                        <Stop offset="70%" stopColor="#FF8EC7" />
                                        <Stop offset="100%" stopColor="#FFD16B" />
                                    </LinearGradient>
                                </Defs>
                                <Rect
                                    x="0"
                                    y="0"
                                    width="320"
                                    height="48"
                                    rx="24"
                                    fill="url(#signupButton)"
                                />
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
                                <Text className="text-[16px] font-semibold text-white">
                                    {t("signupAction")}
                                </Text>
                            </View>
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
                                        {skewX: "-20deg"},
                                    ],
                                }}
                            />
                        </View>
                    </Pressable>
                </View>

                <Pressable className="mt-4" onPress={() => navigation.goBack()}>
                    <Text className="text-center text-[12px] text-[#FF9BB7]">
                        {t("backToLogin")}
                    </Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

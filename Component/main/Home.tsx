import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, AppState, Dimensions, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Locale, useI18n, type TranslationKey } from "../i18n/i18n";
import HomeBackground from "./home/HomeBackground";
import HomeMain from "./home/HomeMain";
import HomeModals from "./home/HomeModals";
import useClickSound from "./home/useClickSound";
import {
    applyAuthTokens,
    auth,
    clearAuthTokens,
    loadAuthTokens,
    loadSessionTimeoutMinutes,
    saveAuthTokens,
    saveSessionTimeoutMinutes,
    setAuthRefreshPath,
    setAuthRefreshFailureHandler,
    setupAuthInterceptors,
} from "../request";

type ActionKey = "login" | "signup" | "exit";
type PostLoginTarget = { name: "Start" | "ProfileHome"; params?: { nickname: string; gender: string | null } };

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
    const [showLoginSuccessModal, setShowLoginSuccessModal] = useState(false);
    const [postLoginTarget, setPostLoginTarget] = useState<PostLoginTarget>({ name: "Start" });
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState(30);
    const [showRefreshFailedModal, setShowRefreshFailedModal] = useState(false);
    const [showDevNoticeModal, setShowDevNoticeModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [showExitModal, setShowExitModal] = useState(false);

    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [loginError, setLoginError] = useState<string | null>(null);
    const [signupEmail, setSignupEmail] = useState("");
    const [signupNickname, setSignupNickname] = useState("");
    const [signupPassword, setSignupPassword] = useState("");
    const [signupPasswordConfirm, setSignupPasswordConfirm] = useState("");
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
    const { playClick } = useClickSound();

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
        playClick();
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
        setShowActions(true);
        setActiveAction(null);
    };

    const closeSignupModal = () => {
        setShowSignupModal(false);
        setSignupError(null);
        setShowActions(true);
        setActiveAction(null);
    };

    const closeLoginSuccessModal = () => {
        setShowLoginSuccessModal(false);
        navigation.reset({
            index: 0,
            routes: [
                {
                    name: postLoginTarget.name as never,
                    ...(postLoginTarget.params ? ({ params: postLoginTarget.params } as never) : {}),
                } as never,
            ],
        });
    };

    const requireLogin = (message?: string) => {
        setShowLoginModal(true);
        if (message) setLoginError(message);
    };

    const handleRefreshFailed = () => {
        setShowRefreshFailedModal(true);
    };

    const closeSettingsModal = () => {
        setShowSettingsModal(false);
    };

    const closeExitModal = () => {
        setShowExitModal(false);
    };

    const closeDevNoticeModal = () => {
        setShowDevNoticeModal(false);
    };

    const isValidEmail = (value: string) => /\S+@\S+\.\S+/.test(value.trim());
    const hasLetterNumberMinLength = (value: string) =>
        /^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(value.trim());

    const getErrorMessage = (data: any, fallback: string) => {
        if (!data) return fallback;
        if (typeof data === "string" && /<html|<!doctype/i.test(data)) {
            return fallback;
        }
        if (typeof data === "string") return data;
        if (typeof data.detail === "string") return data.detail;
        if (typeof data.message === "string") return data.message;
        if (typeof data.error === "string") return data.error;
        if (Array.isArray(data.non_field_errors) && data.non_field_errors[0]) {
            return data.non_field_errors[0];
        }
        const firstKey = Object.keys(data)[0];
        if (firstKey && Array.isArray(data[firstKey]) && data[firstKey][0]) {
            return data[firstKey][0];
        }
        return fallback;
    };

    const checkSession = async () => {
        const stored = await loadAuthTokens();
        if (!stored) {
            setIsLoggedIn(false);
            return;
        }
        const lastLoginAt = stored.lastLoginAt ?? 0;
        const timeoutMs = sessionTimeoutMinutes * 60 * 1000;
        if (lastLoginAt && Date.now() - lastLoginAt > timeoutMs) {
            await clearAuthTokens();
            setIsLoggedIn(false);
            requireLogin(tt("sessionExpired"));
            return;
        }
        applyAuthTokens(stored.access);
        setIsLoggedIn(true);
    };

    useEffect(() => {
        setAuthRefreshPath("/api/auth/refresh/");
        setAuthRefreshFailureHandler(handleRefreshFailed);
        setupAuthInterceptors();
    }, []);

    useEffect(() => {
        let active = true;
        (async () => {
            const minutes = await loadSessionTimeoutMinutes();
            if (!active) return;
            setSessionTimeoutMinutes(minutes);
        })();
        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        checkSession();
        const subscription = AppState.addEventListener("change", (state) => {
            if (state === "active") {
                checkSession();
            }
        });
        return () => subscription.remove();
    }, [sessionTimeoutMinutes]);

    const handleSessionTimeoutChange = (minutes: number) => {
        setSessionTimeoutMinutes(minutes);
        saveSessionTimeoutMinutes(minutes).catch(() => undefined);
    };

    const handleLoginSubmit = async () => {
        if (!isValidEmail(loginEmail)) {
            setLoginError(tt("errorEmail"));
            return;
        }
        if (!loginPassword.trim()) {
            setLoginError(tt("errorPassword"));
            return;
        }
        setLoginError(null);

        try {
            const response = await auth.login({
                email: loginEmail.trim(),
                password: loginPassword,
            });
            await saveAuthTokens(response.data);
            setIsLoggedIn(true);
            setShowLoginModal(false);

            try {
                const hasProfile = response.data.has_profile ?? (await auth.checkProfileExists());
                if (hasProfile) {
                    const profile = await auth.getProfile();
                    setPostLoginTarget({
                        name: "ProfileHome",
                        params: {
                            nickname: profile.nickname ?? "",
                            gender: profile.gender ?? null,
                        },
                    });
                } else {
                    setPostLoginTarget({ name: "Start" });
                }
            } catch {
                // If profile check fails, fall back to normal login success flow.
                setPostLoginTarget({ name: "Start" });
            }

            setShowLoginSuccessModal(true);
        } catch (error: any) {
            const message = getErrorMessage(error?.response?.data, tt("errorLoginFailed"));
            setLoginError(message);
        }
    };

    const handleSignupSubmit = async () => {
        if (!isValidEmail(signupEmail)) {
            setSignupError(tt("errorEmail"));
            return;
        }
        if (!signupNickname.trim()) {
            setSignupError(tt("errorNickname"));
            return;
        }
        if (!hasLetterNumberMinLength(signupPassword)) {
            setSignupError(tt("errorPasswordSentence"));
            return;
        }
        if (signupPassword !== signupPasswordConfirm) {
            setSignupError(tt("errorPasswordConfirm"));
            return;
        }
        setSignupError(null);

        const trimmedNickname = signupNickname.trim();
        const [firstName, ...rest] = trimmedNickname.split(" ");
        const lastName = rest.join(" ");
        const normalizedUsername = trimmedNickname.replace(/\s+/g, "");

        try {
            await auth.register({
                username: normalizedUsername || trimmedNickname,
                password: signupPassword,
                email: signupEmail.trim(),
                first_name: firstName ?? "",
                last_name: lastName ?? "",
            });
            setShowSignupModal(false);
            setLoginEmail(signupEmail.trim());
            setLoginPassword(signupPassword);
            setLoginError(null);
            setShowLoginModal(true);
        } catch (error: any) {
            const message = getErrorMessage(error?.response?.data, tt("errorSignupFailed"));
            setSignupError(message);
        }
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

    const handleLoginPress = () => {
        playClick();
        setShowLoginModal(true);
        setLoginError(null);
    };

    const handleSignupPress = () => {
        playClick();
        setShowSignupModal(true);
        setSignupError(null);
    };

    const handleExitPress = () => {
        playClick();
        setShowExitModal(true);
    };

    const handleSettingsPress = () => {
        playClick();
        setShowSettingsModal(true);
    };

    const handleGoogleLoginPress = () => {
        playClick();
        setShowDevNoticeModal(true);
    };

    const handleLogout = async () => {
        await clearAuthTokens();
        setIsLoggedIn(false);
        setShowSettingsModal(false);
        requireLogin();
    };

    const closeRefreshFailedModal = () => {
        setShowRefreshFailedModal(false);
        requireLogin();
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#FFF4F8" }}>
            <HomeBackground bubbles={bubbles} bubbleAnims={bubbleAnims} />
            <HomeMain
                tt={tt}
                showActions={showActions}
                hintBlink={hintBlink}
                titleLift={titleLift}
                titlePulse={titlePulse}
                toggleActions={toggleActions}
                actionsFade={actionsFade}
                activeAction={activeAction}
                onLoginPress={handleLoginPress}
                onSignupPress={handleSignupPress}
                onExitPress={handleExitPress}
                onSettingsPress={handleSettingsPress}
            />
            <HomeModals
                tt={tt}
                hearts={hearts}
                heartAnims={heartAnims}
                shimmerAnim={shimmerAnim}
                showLoginModal={showLoginModal}
                showLoginSuccessModal={showLoginSuccessModal}
                showRefreshFailedModal={showRefreshFailedModal}
                showDevNoticeModal={showDevNoticeModal}
                closeAuthModal={closeAuthModal}
                closeLoginSuccessModal={closeLoginSuccessModal}
                closeRefreshFailedModal={closeRefreshFailedModal}
                closeDevNoticeModal={closeDevNoticeModal}
                loginEmail={loginEmail}
                setLoginEmail={setLoginEmail}
                loginPassword={loginPassword}
                setLoginPassword={setLoginPassword}
                loginError={loginError}
                handleLoginSubmit={handleLoginSubmit}
                onGoogleLoginPress={handleGoogleLoginPress}
                showSignupModal={showSignupModal}
                closeSignupModal={closeSignupModal}
                signupEmail={signupEmail}
                setSignupEmail={setSignupEmail}
                signupNickname={signupNickname}
                setSignupNickname={setSignupNickname}
                signupPassword={signupPassword}
                setSignupPassword={setSignupPassword}
                signupPasswordConfirm={signupPasswordConfirm}
                setSignupPasswordConfirm={setSignupPasswordConfirm}
                signupError={signupError}
                handleSignupSubmit={handleSignupSubmit}
                showSettingsModal={showSettingsModal}
                closeSettingsModal={closeSettingsModal}
                onLogout={handleLogout}
                showLogout={isLoggedIn}
                sessionTimeoutMinutes={sessionTimeoutMinutes}
                setSessionTimeoutMinutes={handleSessionTimeoutChange}
                locale={locale}
                options={options}
                setLocale={setLocale}
                showSavedToast={showSavedToast}
                showSettingsToast={showSettingsToast}
                settingsToastAnim={settingsToastAnim}
                showExitModal={showExitModal}
                closeExitModal={closeExitModal}
                onSwitchToLogin={() => {
                    playClick();
                    setShowSignupModal(false);
                    setShowLoginModal(true);
                }}
            />
        </View>
    );
}

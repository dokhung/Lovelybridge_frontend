import React, { useEffect, useRef, useState } from "react";
import { Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import HomeSettingsModal from "../main/home/HomeSettingsModal";
import { Locale, useI18n } from "../i18n/i18n";
import { clearAuthTokens, loadSessionTimeoutMinutes, saveSessionTimeoutMinutes } from "../request";

export default function Settings() {
    const navigation = useNavigation();
    const { t, locale, setLocale } = useI18n();
    const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState(30);
    const [showSettingsToast, setShowSettingsToast] = useState(false);
    const settingsToastAnim = useRef(new Animated.Value(0)).current;
    const settingsToastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const options: { label: string; value: Locale }[] = [
        { label: "한국어", value: "ko" },
        { label: "English", value: "en" },
        { label: "日本語", value: "ja" },
        { label: "中文", value: "zh" },
    ];

    useEffect(() => {
        let active = true;
        (async () => {
            const minutes = await loadSessionTimeoutMinutes();
            if (!active) return;
            setSessionTimeoutMinutes(minutes);
        })();
        return () => {
            active = false;
            if (settingsToastTimer.current) clearTimeout(settingsToastTimer.current);
        };
    }, []);

    const handleSessionTimeoutChange = (minutes: number) => {
        setSessionTimeoutMinutes(minutes);
        saveSessionTimeoutMinutes(minutes).catch(() => undefined);
    };

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

    const handleLogout = async () => {
        await clearAuthTokens();
        navigation.reset({ index: 0, routes: [{ name: "Home" as never }] });
    };

    return (
        <HomeSettingsModal
            tt={t}
            visible
            onClose={() => navigation.goBack()}
            onLogout={handleLogout}
            showLogout
            sessionTimeoutMinutes={sessionTimeoutMinutes}
            setSessionTimeoutMinutes={handleSessionTimeoutChange}
            locale={locale}
            options={options}
            setLocale={setLocale}
            showSavedToast={showSavedToast}
            showSettingsToast={showSettingsToast}
            settingsToastAnim={settingsToastAnim}
        />
    );
}

import React from "react";
import { Animated } from "react-native";
import { type Locale, type TranslationKey } from "../../i18n/i18n";
import HomeExitModal from "./HomeExitModal";
import HomeAuthAlertModal from "./HomeAuthAlertModal";
import HomeAuthSuccessModal from "./HomeAuthSuccessModal";
import HomeLoginModal from "./HomeLoginModal";
import HomeSettingsModal from "./HomeSettingsModal";
import HomeSignupModal from "./HomeSignupModal";

type Heart = {
    key: string;
    size: number;
    x: number;
    y: number;
    duration: number;
    delay: number;
};

type LocaleOption = { label: string; value: Locale };

type Props = {
    tt: (key: TranslationKey) => string;
    hearts: Heart[];
    heartAnims: Animated.Value[];
    shimmerAnim: Animated.Value;
    showLoginModal: boolean;
    showLoginSuccessModal: boolean;
    showRefreshFailedModal: boolean;
    showDevNoticeModal: boolean;
    closeAuthModal: () => void;
    closeLoginSuccessModal: () => void;
    closeRefreshFailedModal: () => void;
    closeDevNoticeModal: () => void;
    loginEmail: string;
    setLoginEmail: (value: string) => void;
    loginPassword: string;
    setLoginPassword: (value: string) => void;
    loginError: string | null;
    handleLoginSubmit: () => void;
    onGoogleLoginPress: () => void;
    showSignupModal: boolean;
    closeSignupModal: () => void;
    signupEmail: string;
    setSignupEmail: (value: string) => void;
    signupNickname: string;
    setSignupNickname: (value: string) => void;
    signupPassword: string;
    setSignupPassword: (value: string) => void;
    signupPasswordConfirm: string;
    setSignupPasswordConfirm: (value: string) => void;
    signupError: string | null;
    handleSignupSubmit: () => void;
    showSettingsModal: boolean;
    closeSettingsModal: () => void;
    onLogout: () => void;
    showLogout: boolean;
    sessionTimeoutMinutes: number;
    setSessionTimeoutMinutes: (value: number) => void;
    locale: Locale;
    options: LocaleOption[];
    setLocale: (value: Locale) => void;
    showSavedToast: () => void;
    showSettingsToast: boolean;
    settingsToastAnim: Animated.Value;
    showExitModal: boolean;
    closeExitModal: () => void;
    onSwitchToLogin: () => void;
};

export default function HomeModals({
    tt,
    hearts,
    heartAnims,
    shimmerAnim,
    showLoginModal,
    showLoginSuccessModal,
    showRefreshFailedModal,
    showDevNoticeModal,
    closeAuthModal,
    closeLoginSuccessModal,
    closeRefreshFailedModal,
    closeDevNoticeModal,
    loginEmail,
    setLoginEmail,
    loginPassword,
    setLoginPassword,
    loginError,
    handleLoginSubmit,
    onGoogleLoginPress,
    showSignupModal,
    closeSignupModal,
    signupEmail,
    setSignupEmail,
    signupNickname,
    setSignupNickname,
    signupPassword,
    setSignupPassword,
    signupPasswordConfirm,
    setSignupPasswordConfirm,
    signupError,
    handleSignupSubmit,
    showSettingsModal,
    closeSettingsModal,
    onLogout,
    showLogout,
    sessionTimeoutMinutes,
    setSessionTimeoutMinutes,
    locale,
    options,
    setLocale,
    showSavedToast,
    showSettingsToast,
    settingsToastAnim,
    showExitModal,
    closeExitModal,
    onSwitchToLogin,
}: Props) {
    return (
        <>
            <HomeAuthAlertModal
                tt={tt}
                visible={showDevNoticeModal}
                titleKey="devNoticeTitle"
                bodyKey="devNoticeBody"
                confirmKey="confirm"
                onConfirm={closeDevNoticeModal}
            />
            <HomeAuthAlertModal
                tt={tt}
                visible={showRefreshFailedModal}
                titleKey="refreshFailedTitle"
                bodyKey="refreshFailedBody"
                confirmKey="loginAction"
                onConfirm={closeRefreshFailedModal}
            />
            <HomeAuthSuccessModal
                tt={tt}
                visible={showLoginSuccessModal}
                titleKey="loginSuccessTitle"
                bodyKey="loginSuccessBody"
                onClose={closeLoginSuccessModal}
            />
            <HomeLoginModal
                tt={tt}
                hearts={hearts}
                heartAnims={heartAnims}
                shimmerAnim={shimmerAnim}
                visible={showLoginModal}
                onClose={closeAuthModal}
                loginEmail={loginEmail}
                setLoginEmail={setLoginEmail}
                loginPassword={loginPassword}
                setLoginPassword={setLoginPassword}
                loginError={loginError}
                onSubmit={handleLoginSubmit}
                onGooglePress={onGoogleLoginPress}
            />
            <HomeSignupModal
                tt={tt}
                hearts={hearts}
                heartAnims={heartAnims}
                visible={showSignupModal}
                onClose={closeSignupModal}
                signupEmail={signupEmail}
                setSignupEmail={setSignupEmail}
                signupNickname={signupNickname}
                setSignupNickname={setSignupNickname}
                signupPassword={signupPassword}
                setSignupPassword={setSignupPassword}
                signupPasswordConfirm={signupPasswordConfirm}
                setSignupPasswordConfirm={setSignupPasswordConfirm}
                signupError={signupError}
                onSubmit={handleSignupSubmit}
                onSwitchToLogin={onSwitchToLogin}
            />
            <HomeSettingsModal
                tt={tt}
                visible={showSettingsModal}
                onClose={closeSettingsModal}
                onLogout={onLogout}
                showLogout={showLogout}
                sessionTimeoutMinutes={sessionTimeoutMinutes}
                setSessionTimeoutMinutes={setSessionTimeoutMinutes}
                locale={locale}
                options={options}
                setLocale={setLocale}
                showSavedToast={showSavedToast}
                showSettingsToast={showSettingsToast}
                settingsToastAnim={settingsToastAnim}
            />
            <HomeExitModal tt={tt} visible={showExitModal} onClose={closeExitModal} />
        </>
    );
}

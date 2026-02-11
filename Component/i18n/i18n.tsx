import React, {createContext, useCallback, useContext, useEffect, useMemo, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Locale = "en" | "ko" | "ja" | "zh";

const STORAGE_KEY = "lovelybridge.locale";

const translations = {
    en: {
        appName: "LovelyBridge",
        tapTitle: "Tap the title to begin.",
        homeSubtitle: "Meet today's match.",
        login: "Login",
        signup: "Sign Up",
        exit: "Exit",
        settings: "Settings",
        quickLogin: "Quick Login",
        continueApple: "Continue with Apple",
        continueGoogle: "Continue with Google",
        continueKakao: "Continue with Kakao",
        loginWithEmail: "Login with email",
        email: "Email",
        password: "Password",
        passwordPlaceholder: "Enter password",
        loginAction: "Log in",
        termsNotice: "By logging in, you agree to the Terms and Privacy Policy.",
        firstTime: "New here? Sign Up",
        close: "Close",
        exitConfirm: "Are you sure you want to exit?",
        exitAction: "Exit",
        backToLogin: "Back to Login",
        language: "Language",
        languageHelp: "Choose the app language. It will be saved on this device.",
        languageSaved: "Language saved.",
        welcomeTitle: "Welcome",
        welcomeSubtitle: "A story that continues on LovelyBridge.",
        forgotPassword: "Forgot your password?",
        noAccount: "No account yet?",
        signupAction: "Sign Up",
        signupTitle: "Sign Up",
        signupSubtitle: "Start your story",
        signupBadge: "Meet someone new",
        nickname: "Nickname",
        passwordHint: "Include an English sentence (e.g. \"love you\")",
        back: "Back",
        seeYouSoon: "See you soon",
        heartWelcome: "Your heart is always welcome back.",
        errorEmail: "Please enter a valid email.",
        errorPassword: "Please enter a password.",
        errorNickname: "Please enter a nickname.",
        errorPasswordSentence: "Please include an English sentence in the password.",
    },
    ko: {
        appName: "LovelyBridge",
        tapTitle: "타이틀을 눌러 시작하세요.",
        homeSubtitle: "오늘의 인연을 만나보세요",
        login: "로그인",
        signup: "회원가입",
        exit: "나가기",
        settings: "설정",
        quickLogin: "빠른 로그인",
        continueApple: "Apple로 계속하기",
        continueGoogle: "Google로 계속하기",
        continueKakao: "Kakao로 계속하기",
        loginWithEmail: "이메일로 로그인",
        email: "이메일",
        password: "비밀번호",
        passwordPlaceholder: "비밀번호 입력",
        loginAction: "로그인하기",
        termsNotice: "로그인하면 이용약관 및 개인정보 처리방침에 동의한 것으로 간주됩니다.",
        firstTime: "처음이신가요? 회원가입",
        close: "닫기",
        exitConfirm: "정말 종료하시겠어요?",
        exitAction: "종료",
        backToLogin: "로그인으로 돌아가기",
        language: "언어",
        languageHelp: "앱 언어를 선택해 주세요. 이 기기에 저장됩니다.",
        languageSaved: "언어가 저장되었습니다.",
        welcomeTitle: "환영해요",
        welcomeSubtitle: "LovelyBridge에서 이어지는 이야기.",
        forgotPassword: "비밀번호를 잊으셨나요?",
        noAccount: "아직 계정이 없나요?",
        signupAction: "회원가입",
        signupTitle: "Sign Up",
        signupSubtitle: "당신의 이야기를 시작해요",
        signupBadge: "새로운 인연 만들기",
        nickname: "닉네임",
        passwordHint: "비밀번호에 영어 문장을 포함해 주세요. (예: \"love you\")",
        back: "뒤로",
        seeYouSoon: "곧 다시 만나요",
        heartWelcome: "마음은 언제든 돌아올 수 있어요.",
        errorEmail: "이메일 형식의 아이디를 입력해 주세요.",
        errorPassword: "비밀번호를 입력해 주세요.",
        errorNickname: "닉네임을 입력해 주세요.",
        errorPasswordSentence: "비밀번호에 영어 문장을 포함해 주세요.",
    },
    ja: {
        appName: "LovelyBridge",
        tapTitle: "タイトルをタップして始めましょう。",
        homeSubtitle: "今日の出会いを見つけましょう。",
        login: "ログイン",
        signup: "新規登録",
        exit: "終了",
        settings: "設定",
        quickLogin: "クイックログイン",
        continueApple: "Appleで続ける",
        continueGoogle: "Googleで続ける",
        continueKakao: "Kakaoで続ける",
        loginWithEmail: "メールでログイン",
        email: "メール",
        password: "パスワード",
        passwordPlaceholder: "パスワードを入力",
        loginAction: "ログイン",
        termsNotice: "ログインすると利用規約とプライバシーに同意したものとします。",
        firstTime: "初めてですか？新規登録",
        close: "閉じる",
        exitConfirm: "終了してもよろしいですか？",
        exitAction: "終了",
        backToLogin: "ログインに戻る",
        language: "言語",
        languageHelp: "アプリの言語を選択してください。この端末に保存されます。",
        languageSaved: "言語を保存しました。",
        welcomeTitle: "ようこそ",
        welcomeSubtitle: "LovelyBridgeで続く物語。",
        forgotPassword: "パスワードを忘れましたか？",
        noAccount: "アカウントがありませんか？",
        signupAction: "新規登録",
        signupTitle: "Sign Up",
        signupSubtitle: "あなたの物語を始めよう",
        signupBadge: "新しい出会い",
        nickname: "ニックネーム",
        passwordHint: "パスワードに英語の文を含めてください（例: \"love you\"）。",
        back: "戻る",
        seeYouSoon: "また会いましょう",
        heartWelcome: "いつでもお帰りください。",
        errorEmail: "有効なメールアドレスを入力してください。",
        errorPassword: "パスワードを入力してください。",
        errorNickname: "ニックネームを入力してください。",
        errorPasswordSentence: "パスワードに英語の文を含めてください。",
    },
    zh: {
        appName: "LovelyBridge",
        tapTitle: "点击标题开始。",
        homeSubtitle: "遇见今天的缘分。",
        login: "登录",
        signup: "注册",
        exit: "退出",
        settings: "设置",
        quickLogin: "快速登录",
        continueApple: "使用 Apple 继续",
        continueGoogle: "使用 Google 继续",
        continueKakao: "使用 Kakao 继续",
        loginWithEmail: "使用邮箱登录",
        email: "邮箱",
        password: "密码",
        passwordPlaceholder: "请输入密码",
        loginAction: "登录",
        termsNotice: "登录即表示你同意条款与隐私政策。",
        firstTime: "新用户？注册",
        close: "关闭",
        exitConfirm: "确定要退出吗？",
        exitAction: "退出",
        backToLogin: "返回登录",
        language: "语言",
        languageHelp: "请选择应用语言。将保存在此设备上。",
        languageSaved: "语言已保存。",
        welcomeTitle: "欢迎",
        welcomeSubtitle: "在 LovelyBridge 继续你的故事。",
        forgotPassword: "忘记密码？",
        noAccount: "还没有账号？",
        signupAction: "注册",
        signupTitle: "Sign Up",
        signupSubtitle: "开启你的故事",
        signupBadge: "遇见新缘分",
        nickname: "昵称",
        passwordHint: "密码中请包含英文句子（例如：\"love you\"）。",
        back: "返回",
        seeYouSoon: "很快再见",
        heartWelcome: "你的心永远欢迎回来。",
        errorEmail: "请输入有效的邮箱地址。",
        errorPassword: "请输入密码。",
        errorNickname: "请输入昵称。",
        errorPasswordSentence: "密码中请包含英文句子。",
    },
} as const;

type TranslationKey = keyof typeof translations.en;

const isLocale = (value: string): value is Locale =>
    value === "en" || value === "ko" || value === "ja" || value === "zh";

const normalizeLocale = (locale?: string): Locale => {
    const tag = (locale || "en").toLowerCase();
    if (tag.startsWith("ko")) return "ko";
    if (tag.startsWith("ja")) return "ja";
    if (tag.startsWith("zh")) return "zh";
    return "en";
};

const getDeviceLocale = (): Locale => {
    try {
        const locale = Intl.DateTimeFormat().resolvedOptions().locale;
        return normalizeLocale(locale);
    } catch {
        return "en";
    }
};

type I18nContextValue = {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: TranslationKey) => string;
};

const I18nContext = createContext<I18nContextValue>({
    locale: "en",
    setLocale: () => undefined,
    t: (key) => translations.en[key] ?? key,
});

export function I18nProvider({children}: {children: React.ReactNode}) {
    const [locale, setLocale] = useState<Locale>(getDeviceLocale());

    useEffect(() => {
        let active = true;
        (async () => {
            try {
                const saved = await AsyncStorage.getItem(STORAGE_KEY);
                if (saved && isLocale(saved) && active) {
                    setLocale(saved);
                }
            } catch {
                // Ignore persistence errors; fallback to device locale.
            }
        })();
        return () => {
            active = false;
        };
    }, []);

    const t = useCallback(
        (key: TranslationKey) => translations[locale]?.[key] ?? translations.en[key] ?? key,
        [locale],
    );

    const setLocalePersist = useCallback((next: Locale) => {
        setLocale(next);
        AsyncStorage.setItem(STORAGE_KEY, next).catch(() => undefined);
    }, []);

    const value = useMemo(
        () => ({
            locale,
            setLocale: setLocalePersist,
            t,
        }),
        [locale, setLocalePersist, t],
    );

    return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
    return useContext(I18nContext);
}

export type {Locale, TranslationKey};

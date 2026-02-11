import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useI18n, type TranslationKey } from "../i18n/i18n";

export default function Login() {
    const { t } = useI18n();
    const tt = (key: TranslationKey) => {
        try {
            const v = t(key);
            return v ?? key;
        } catch {
            return key;
        }
    };

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const isValidEmail = (value: string) => /\S+@\S+\.\S+/.test(value.trim());

    const handleSubmit = () => {
        if (!isValidEmail(email)) {
            setError(tt("errorEmail"));
            return;
        }
        if (!password.trim()) {
            setError(tt("errorPassword"));
            return;
        }
        setError(null);
        // TODO: 로그인 처리
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF0F6" }}>
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 24 }}>
                <View style={{ width: "100%", maxWidth: 360 }}>
                    {/* Google Login */}
                    <Pressable
                        style={{
                            marginBottom: 16,
                            borderRadius: 999,
                            borderWidth: 1,
                            borderColor: "#F0D7E2",
                            backgroundColor: "#fff",
                            paddingVertical: 12,
                        }}
                    >
                        <View style={{ alignItems: "center" }}>
                            <Text style={{ fontSize: 14, fontWeight: "700", color: "#FF4D8D" }}>
                                {tt("continueGoogle")}
                            </Text>
                        </View>
                    </Pressable>

                    {/* Email */}
                    <Text style={{ fontSize: 12, fontWeight: "700", color: "#FF6F9C" }}>{tt("email")}</Text>
                    <TextInput
                        style={{
                            marginTop: 8,
                            borderRadius: 14,
                            backgroundColor: "#FFF4F8",
                            paddingHorizontal: 16,
                            paddingVertical: 12,
                            fontSize: 14,
                            color: "#FF3B82",
                        }}
                        placeholder="you@example.com"
                        placeholderTextColor="#FFB2C7"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                    />

                    {/* Password */}
                    <Text style={{ marginTop: 14, fontSize: 12, fontWeight: "700", color: "#FF6F9C" }}>
                        {tt("password")}
                    </Text>
                    <TextInput
                        style={{
                            marginTop: 8,
                            borderRadius: 14,
                            backgroundColor: "#FFF4F8",
                            paddingHorizontal: 16,
                            paddingVertical: 12,
                            fontSize: 14,
                            color: "#FF3B82",
                        }}
                        placeholder={tt("passwordPlaceholder")}
                        placeholderTextColor="#FFB2C7"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />

                    {/* Error */}
                    {error && (
                        <Text style={{ marginTop: 10, textAlign: "center", fontSize: 12, fontWeight: "700", color: "#FF5D8C" }}>
                            {error}
                        </Text>
                    )}

                    {/* Login Button */}
                    <Pressable
                        style={{
                            marginTop: 18,
                            borderRadius: 18,
                            backgroundColor: "#FF4D8D",
                            paddingVertical: 12,
                        }}
                        onPress={handleSubmit}
                    >
                        <Text style={{ textAlign: "center", fontSize: 16, fontWeight: "800", color: "#fff" }}>
                            {tt("loginAction")}
                        </Text>
                    </Pressable>

                    {/* ✅ 회원가입 버튼/문구 제거 완료 */}
                </View>
            </View>
        </SafeAreaView>
    );
}

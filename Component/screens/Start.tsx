import React, { useState } from "react";
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useI18n } from "../i18n/i18n";
import { auth } from "../request";
import FemaleSmile from "../../img/F_Smile.svg";
import MaleSmile from "../../img/M_Smile.svg";

export default function Start() {
    const navigation = useNavigation();
    const { t } = useI18n();
    const [gender, setGender] = useState<"female" | "male" | null>(null);
    const [nickname, setNickname] = useState("");
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const getErrorMessage = (data: any, fallback: string) => {
        if (!data) return fallback;
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

    const handleSubmit = async () => {
        if (!gender) {
            setSubmitError(t("errorGender"));
            return;
        }
        if (!nickname.trim()) {
            setSubmitError(t("errorNickname"));
            return;
        }

        setIsSubmitting(true);
        setSubmitError(null);
        setSubmitSuccess(null);

        try {
            await auth.completeProfile({
                gender,
                nickname: nickname.trim(),
            });
            setSubmitSuccess(t("profileSaved"));
            navigation.reset({
                index: 0,
                routes: [{ name: "Home" as never }],
            });
        } catch (error: any) {
            const message = getErrorMessage(error?.response?.data, t("errorProfileSaveFailed"));
            setSubmitError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#FFF4F8", alignItems: "center", justifyContent: "center" }}>
            <View
                style={{
                    width: "88%",
                    maxWidth: 380,
                    paddingHorizontal: 24,
                    paddingVertical: 22,
                    borderRadius: 24,
                    backgroundColor: "#FFF7FB",
                    borderWidth: 1,
                    borderColor: "#FFE1ED",
                }}
            >
                <Text style={{ fontSize: 22, fontWeight: "800", color: "#FF4D8D", textAlign: "center" }}>
                    {t("welcomeTitle")}
                </Text>
                <Text style={{ marginTop: 6, fontSize: 12, color: "#FF8FB1", textAlign: "center" }}>
                    {t("welcomeSubtitle")}
                </Text>

                <Text style={{ marginTop: 18, fontSize: 13, fontWeight: "700", color: "#FF6F9C" }}>
                    {t("selectGender")}
                </Text>
                <Text style={{ marginTop: 4, fontSize: 11, color: "#FF9BB7" }}>{t("genderHelp")}</Text>

                <View style={{ marginTop: 12, flexDirection: "row", gap: 12 }}>
                    <Pressable
                        onPress={() => setGender("female")}
                        style={{
                            flex: 1,
                            borderRadius: 18,
                            paddingVertical: 12,
                            alignItems: "center",
                            backgroundColor: gender === "female" ? "#FFE3EE" : "#FFFFFF",
                            borderWidth: 1,
                            borderColor: gender === "female" ? "#FF4D8D" : "#FFE1ED",
                        }}
                    >
                        <FemaleSmile width={90} height={90} />
                        <Text style={{ marginTop: 6, fontSize: 13, fontWeight: "700", color: "#FF4D8D" }}>
                            {t("female")}
                        </Text>
                    </Pressable>

                    <Pressable
                        onPress={() => setGender("male")}
                        style={{
                            flex: 1,
                            borderRadius: 18,
                            paddingVertical: 12,
                            alignItems: "center",
                            backgroundColor: gender === "male" ? "#FFE3EE" : "#FFFFFF",
                            borderWidth: 1,
                            borderColor: gender === "male" ? "#FF4D8D" : "#FFE1ED",
                        }}
                    >
                        <MaleSmile width={90} height={90} />
                        <Text style={{ marginTop: 6, fontSize: 13, fontWeight: "700", color: "#FF4D8D" }}>
                            {t("male")}
                        </Text>
                    </Pressable>
                </View>

                <Text style={{ marginTop: 16, fontSize: 13, fontWeight: "700", color: "#FF6F9C" }}>
                    {t("nickname")}
                </Text>
                <TextInput
                    style={{
                        marginTop: 8,
                        borderRadius: 14,
                        backgroundColor: "#FFFFFF",
                        paddingHorizontal: 14,
                        paddingVertical: 11,
                        fontSize: 14,
                        color: "#FF3B82",
                        borderWidth: 1,
                        borderColor: "#FFE1ED",
                    }}
                    placeholder={t("nicknamePlaceholder")}
                    placeholderTextColor="#FFB2C7"
                    value={nickname}
                    onChangeText={setNickname}
                    autoCapitalize="none"
                />

                {submitError && (
                    <Text style={{ marginTop: 10, textAlign: "center", fontSize: 12, fontWeight: "700", color: "#FF5D8C" }}>
                        {submitError}
                    </Text>
                )}
                {submitSuccess && (
                    <Text style={{ marginTop: 10, textAlign: "center", fontSize: 12, fontWeight: "700", color: "#33A26B" }}>
                        {submitSuccess}
                    </Text>
                )}

                <Pressable
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                    style={{
                        marginTop: 14,
                        borderRadius: 16,
                        backgroundColor: isSubmitting ? "#FFB2C7" : "#FF4D8D",
                        paddingVertical: 12,
                        alignItems: "center",
                    }}
                >
                    {isSubmitting ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={{ fontSize: 14, fontWeight: "800", color: "#fff" }}>{t("saveProfile")}</Text>
                    )}
                </Pressable>
            </View>
        </View>
    );
}

import React, { useEffect, useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../request";
import { useI18n } from "../i18n/i18n";

export default function ProfileEdit() {
    const navigation = useNavigation();
    const { t } = useI18n();
    const [nickname, setNickname] = useState("");
    const [gender, setGender] = useState<"female" | "male" | null>(null);
    const [isGenderLocked, setIsGenderLocked] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const profile = await auth.getProfile();
                if (profile.nickname) setNickname(profile.nickname);
                if (profile.gender === "female" || profile.gender === "male") {
                    setGender(profile.gender);
                    setIsGenderLocked(true);
                }
            } catch {
                // ignore and allow manual edit
            }
        })();
    }, []);

    const handleSave = async () => {
        if (!nickname.trim()) {
            Alert.alert(t("profileEditAlertTitle"), t("errorNickname"));
            return;
        }

        try {
            setIsSaving(true);
            await auth.completeProfile({
                nickname: nickname.trim(),
                ...(gender ? { gender } : {}),
            });
            if (gender) {
                setIsGenderLocked(true);
            }
            Alert.alert(t("profileEditAlertTitle"), t("profileEditSaved"));
            navigation.goBack();
        } catch (error: any) {
            const code = error?.response?.data?.code;
            if (code === "AUTH_018") {
                Alert.alert(t("profileEditAlertTitle"), t("profileEditGenderLocked"));
                return;
            }
            Alert.alert(t("profileEditAlertTitle"), t("profileEditAlertBody"));
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#FFF0F6]" style={{ flex: 1 }}>
            <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 24 }}>
                <Pressable
                    onPress={() => {
                        if (navigation.canGoBack()) {
                            navigation.goBack();
                            return;
                        }
                        navigation.navigate("ProfileHome" as never);
                    }}
                    style={{
                        alignSelf: "flex-start",
                        borderRadius: 14,
                        backgroundColor: "#FFF7FB",
                        borderWidth: 1,
                        borderColor: "#FFE1ED",
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                    }}
                >
                    <Text style={{ fontSize: 12, fontWeight: "700", color: "#FF4D8D" }}>{t("back")}</Text>
                </Pressable>
                <Text style={{ fontSize: 22, fontWeight: "800", color: "#FF4D8D" }}>{t("profileEditTitle")}</Text>
                <Text style={{ marginTop: 6, fontSize: 12, color: "#FF85A2" }}>{t("profileEditSubtitle")}</Text>

                <View style={{ marginTop: 18, gap: 12 }}>
                    <TextInput
                        style={{
                            backgroundColor: "#FFFFFF",
                            borderRadius: 14,
                            borderWidth: 1,
                            borderColor: "#FFE1ED",
                            paddingHorizontal: 14,
                            paddingVertical: 11,
                            fontSize: 14,
                            color: "#FF3B82",
                        }}
                        placeholder={t("profileEditNicknamePlaceholder")}
                        placeholderTextColor="#FFB2C7"
                        value={nickname}
                        onChangeText={setNickname}
                    />

                    <Text style={{ fontSize: 12, fontWeight: "700", color: "#C45076" }}>{t("profileGenderLabel")}</Text>
                    <View style={{ flexDirection: "row", gap: 12 }}>
                        <Pressable
                            disabled={isGenderLocked}
                            onPress={() => setGender("female")}
                            style={{
                                flex: 1,
                                borderRadius: 14,
                                paddingVertical: 12,
                                alignItems: "center",
                                backgroundColor: gender === "female" ? "#FFE3EE" : "#FFFFFF",
                                borderWidth: 1,
                                borderColor: gender === "female" ? "#FF4D8D" : "#FFE1ED",
                                opacity: isGenderLocked && gender !== "female" ? 0.5 : 1,
                            }}
                        >
                            <Text style={{ fontSize: 13, fontWeight: "700", color: "#FF4D8D" }}>{t("profileEditFemale")}</Text>
                        </Pressable>
                        <Pressable
                            disabled={isGenderLocked}
                            onPress={() => setGender("male")}
                            style={{
                                flex: 1,
                                borderRadius: 14,
                                paddingVertical: 12,
                                alignItems: "center",
                                backgroundColor: gender === "male" ? "#FFE3EE" : "#FFFFFF",
                                borderWidth: 1,
                                borderColor: gender === "male" ? "#FF4D8D" : "#FFE1ED",
                                opacity: isGenderLocked && gender !== "male" ? 0.5 : 1,
                            }}
                        >
                            <Text style={{ fontSize: 13, fontWeight: "700", color: "#FF4D8D" }}>{t("profileEditMale")}</Text>
                        </Pressable>
                    </View>
                    <Text style={{ fontSize: 11, color: "#C96C8F" }}>{t("profileEditGenderHelp")}</Text>

                    <Pressable
                        onPress={() => navigation.navigate("PasswordChange" as never)}
                        style={{
                            borderRadius: 14,
                            borderWidth: 1,
                            borderColor: "#FFD1E3",
                            backgroundColor: "#FFF7FB",
                            paddingVertical: 11,
                            alignItems: "center",
                        }}
                    >
                        <Text style={{ fontSize: 13, fontWeight: "800", color: "#C45076" }}>
                            {t("passwordChangeTitle")}
                        </Text>
                    </Pressable>
                </View>

                <Pressable
                    onPress={handleSave}
                    disabled={isSaving}
                    style={{
                        marginTop: 18,
                        borderRadius: 18,
                        backgroundColor: isSaving ? "#FF9FC0" : "#FF4D8D",
                        paddingVertical: 14,
                        alignItems: "center",
                    }}
                >
                    <Text style={{ color: "#fff", fontWeight: "800" }}>{t("profileEditSaveAction")}</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

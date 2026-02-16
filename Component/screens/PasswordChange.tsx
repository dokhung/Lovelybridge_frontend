import React, { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../request";
import { useI18n } from "../i18n/i18n";

export default function PasswordChange() {
    const navigation = useNavigation();
    const { t } = useI18n();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
    const [verified, setVerified] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleVerify = async () => {
        if (!currentPassword.trim()) {
            Alert.alert(t("passwordChangeTitle"), t("passwordChangeCurrentRequired"));
            return;
        }
        try {
            setIsSubmitting(true);
            await auth.verifyPassword({ current_password: currentPassword });
            setVerified(true);
            Alert.alert(t("passwordChangeTitle"), t("passwordChangeVerified"));
        } catch {
            Alert.alert(t("passwordChangeTitle"), t("passwordChangeVerifyFailed"));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChangePassword = async () => {
        if (!verified) return;
        if (!newPassword.trim() || !newPasswordConfirm.trim()) {
            Alert.alert(t("passwordChangeTitle"), t("passwordChangeNewRequired"));
            return;
        }
        if (newPassword !== newPasswordConfirm) {
            Alert.alert(t("passwordChangeTitle"), t("passwordChangeConfirmMismatch"));
            return;
        }

        try {
            setIsSubmitting(true);
            await auth.changePassword({
                current_password: currentPassword,
                new_password: newPassword,
                new_password_confirm: newPasswordConfirm,
            });
            Alert.alert(t("passwordChangeTitle"), t("passwordChangeSuccess"));
            navigation.goBack();
        } catch {
            Alert.alert(t("passwordChangeTitle"), t("passwordChangeFailed"));
        } finally {
            setIsSubmitting(false);
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
                        navigation.navigate("ProfileEdit" as never);
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

                <Text style={{ fontSize: 22, fontWeight: "800", color: "#FF4D8D" }}>{t("passwordChangeTitle")}</Text>
                <Text style={{ marginTop: 6, fontSize: 12, color: "#FF85A2" }}>{t("passwordChangeSubtitle")}</Text>

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
                        placeholder={t("passwordChangeCurrentPlaceholder")}
                        placeholderTextColor="#FFB2C7"
                        secureTextEntry
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                        editable={!verified}
                    />

                    {!verified ? (
                        <Pressable
                            onPress={handleVerify}
                            disabled={isSubmitting}
                            style={{
                                borderRadius: 14,
                                backgroundColor: isSubmitting ? "#FF9FC0" : "#FFD1E3",
                                paddingVertical: 12,
                                alignItems: "center",
                            }}
                        >
                            <Text style={{ fontSize: 13, fontWeight: "800", color: "#FF4D8D" }}>
                                {t("passwordChangeVerifyAction")}
                            </Text>
                        </Pressable>
                    ) : null}

                    {verified ? (
                        <>
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
                                placeholder={t("passwordChangeNewPlaceholder")}
                                placeholderTextColor="#FFB2C7"
                                secureTextEntry
                                value={newPassword}
                                onChangeText={setNewPassword}
                            />
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
                                placeholder={t("passwordChangeConfirmPlaceholder")}
                                placeholderTextColor="#FFB2C7"
                                secureTextEntry
                                value={newPasswordConfirm}
                                onChangeText={setNewPasswordConfirm}
                            />

                            <Pressable
                                onPress={handleChangePassword}
                                disabled={isSubmitting}
                                style={{
                                    borderRadius: 14,
                                    backgroundColor: isSubmitting ? "#FF9FC0" : "#FF4D8D",
                                    paddingVertical: 12,
                                    alignItems: "center",
                                }}
                            >
                                <Text style={{ fontSize: 13, fontWeight: "800", color: "#FFFFFF" }}>
                                    {t("passwordChangeSubmitAction")}
                                </Text>
                            </Pressable>
                        </>
                    ) : null}
                </View>
            </View>
        </SafeAreaView>
    );
}

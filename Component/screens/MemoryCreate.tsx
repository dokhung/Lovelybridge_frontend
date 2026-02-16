import React, { useMemo, useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../request";
import { useI18n } from "../i18n/i18n";

const formatDateTime = (value: Date) =>
    new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    }).format(value);

export default function MemoryCreate() {
    const navigation = useNavigation();
    const { t } = useI18n();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [capturedAt, setCapturedAt] = useState(() => new Date());
    const [isSubmitting, setIsSubmitting] = useState(false);

    const capturedAtLabel = useMemo(() => formatDateTime(capturedAt), [capturedAt]);

    const handleSubmit = async () => {
        if (!title.trim() || !content.trim()) {
            Alert.alert(t("memorySaveAlertTitle"), t("memoryValidationRequired"));
            return;
        }

        try {
            setIsSubmitting(true);
            const saved = await auth.createMemory({
                title: title.trim(),
                content: content.trim(),
            });

            setTitle("");
            setContent("");
            if (saved.created_at) {
                setCapturedAt(new Date(saved.created_at));
            }

            Alert.alert(t("memorySaveAlertTitle"), t("memorySaveAlertBody"));
            navigation.goBack();
        } catch {
            Alert.alert(t("memorySaveAlertTitle"), t("memorySaveErrorBody"));
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
                <Text style={{ fontSize: 22, fontWeight: "800", color: "#FF4D8D" }}>{t("memoryCreateTitle")}</Text>
                <Text style={{ marginTop: 6, fontSize: 12, color: "#FF85A2" }}>
                    {t("memoryCreateSubtitle")}
                </Text>

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
                        placeholder={t("memoryTitlePlaceholder")}
                        placeholderTextColor="#FFB2C7"
                        value={title}
                        onChangeText={setTitle}
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
                            minHeight: 120,
                        }}
                        placeholder={t("memoryContentPlaceholder")}
                        placeholderTextColor="#FFB2C7"
                        value={content}
                        onChangeText={setContent}
                        multiline
                        textAlignVertical="top"
                    />

                    <View
                        style={{
                            backgroundColor: "#FFFFFF",
                            borderRadius: 14,
                            borderWidth: 1,
                            borderColor: "#FFE1ED",
                            paddingHorizontal: 14,
                            paddingVertical: 11,
                        }}
                    >
                        <Text style={{ fontSize: 12, fontWeight: "700", color: "#FF85A2" }}>
                            {t("memoryDatePlaceholder")}
                        </Text>
                        <Text style={{ marginTop: 4, fontSize: 14, color: "#FF3B82" }}>{capturedAtLabel}</Text>
                    </View>
                </View>

                <Pressable
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                    style={{
                        marginTop: 18,
                        borderRadius: 18,
                        backgroundColor: isSubmitting ? "#FF9FC0" : "#FF4D8D",
                        paddingVertical: 14,
                        alignItems: "center",
                    }}
                >
                    <Text style={{ color: "#fff", fontWeight: "800" }}>{t("memorySaveAction")}</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

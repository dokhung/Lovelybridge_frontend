import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, TextInput, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../request";
import type { MemoryResponse } from "../request/auth";
import { useI18n } from "../i18n/i18n";

type RouteParams = {
    memoryId?: number;
};

const formatDateTime = (value: string) =>
    new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(value));

export default function MemoryDetail() {
    const navigation = useNavigation();
    const route = useRoute();
    const { t } = useI18n();

    const { memoryId } = (route.params ?? {}) as RouteParams;
    const [memory, setMemory] = useState<MemoryResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const loadMemory = async () => {
        if (!memoryId) return;
        try {
            setIsLoading(true);
            const detail = await auth.getMemory(memoryId);
            setMemory(detail);
            setTitle(detail.title);
            setContent(detail.content);
        } catch {
            Alert.alert(t("memoryDetailTitle"), t("memoryDetailLoadError"));
            navigation.goBack();
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadMemory();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [memoryId]);

    const handleSave = async () => {
        if (!memoryId || !memory) return;
        if (!title.trim() || !content.trim()) {
            Alert.alert(t("memorySaveAlertTitle"), t("memoryValidationRequired"));
            return;
        }

        try {
            const updated = await auth.updateMemory(memoryId, {
                title: title.trim(),
                content: content.trim(),
            });
            setMemory(updated);
            setIsEditing(false);
            Alert.alert(t("memorySaveAlertTitle"), t("memoryUpdateSuccess"));
        } catch {
            Alert.alert(t("memorySaveAlertTitle"), t("memoryUpdateError"));
        }
    };

    const handleDelete = () => {
        if (!memoryId) return;
        Alert.alert(t("memoryDeleteAction"), t("memoryDeleteConfirm"), [
            { text: t("close"), style: "cancel" },
            {
                text: t("memoryDeleteAction"),
                style: "destructive",
                onPress: async () => {
                    try {
                        await auth.deleteMemory(memoryId);
                        Alert.alert(t("memorySaveAlertTitle"), t("memoryDeleteSuccess"));
                        navigation.goBack();
                    } catch {
                        Alert.alert(t("memorySaveAlertTitle"), t("memoryDeleteError"));
                    }
                },
            },
        ]);
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
                        navigation.navigate("MemoryList" as never);
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

                <Text style={{ marginTop: 8, fontSize: 22, fontWeight: "800", color: "#FF4D8D" }}>
                    {t("memoryDetailTitle")}
                </Text>

                {isLoading ? (
                    <View style={{ marginTop: 20, alignItems: "center" }}>
                        <ActivityIndicator color="#FF4D8D" />
                    </View>
                ) : null}

                {!isLoading && memory ? (
                    <View style={{ marginTop: 14 }}>
                        <Text style={{ fontSize: 11, color: "#C96C8F" }}>{formatDateTime(memory.created_at)}</Text>

                        <TextInput
                            editable={isEditing}
                            value={title}
                            onChangeText={setTitle}
                            style={{
                                marginTop: 10,
                                backgroundColor: "#FFFFFF",
                                borderRadius: 14,
                                borderWidth: 1,
                                borderColor: "#FFE1ED",
                                paddingHorizontal: 14,
                                paddingVertical: 11,
                                fontSize: 14,
                                color: "#FF3B82",
                            }}
                        />

                        <TextInput
                            editable={isEditing}
                            value={content}
                            onChangeText={setContent}
                            multiline
                            textAlignVertical="top"
                            style={{
                                marginTop: 10,
                                minHeight: 180,
                                backgroundColor: "#FFFFFF",
                                borderRadius: 14,
                                borderWidth: 1,
                                borderColor: "#FFE1ED",
                                paddingHorizontal: 14,
                                paddingVertical: 11,
                                fontSize: 14,
                                color: "#FF3B82",
                            }}
                        />

                        {isEditing ? (
                            <Pressable
                                onPress={handleSave}
                                style={{
                                    marginTop: 12,
                                    borderRadius: 16,
                                    backgroundColor: "#FF4D8D",
                                    alignItems: "center",
                                    paddingVertical: 12,
                                }}
                            >
                                <Text style={{ color: "#FFFFFF", fontWeight: "800" }}>{t("memorySaveAction")}</Text>
                            </Pressable>
                        ) : (
                            <Pressable
                                onPress={() => setIsEditing(true)}
                                style={{
                                    marginTop: 12,
                                    borderRadius: 16,
                                    backgroundColor: "#FFD1E3",
                                    alignItems: "center",
                                    paddingVertical: 12,
                                }}
                            >
                                <Text style={{ color: "#FF4D8D", fontWeight: "800" }}>{t("memoryEditAction")}</Text>
                            </Pressable>
                        )}

                        <Pressable
                            onPress={handleDelete}
                            style={{
                                marginTop: 10,
                                borderRadius: 16,
                                backgroundColor: "#FFE3EE",
                                alignItems: "center",
                                paddingVertical: 12,
                                borderWidth: 1,
                                borderColor: "#FFB7CF",
                            }}
                        >
                            <Text style={{ color: "#C45076", fontWeight: "800" }}>{t("memoryDeleteAction")}</Text>
                        </Pressable>
                    </View>
                ) : null}
            </View>
        </SafeAreaView>
    );
}

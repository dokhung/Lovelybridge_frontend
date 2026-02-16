import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../request";
import type { MemoryListQuery, MemoryResponse } from "../request/auth";
import type { TranslationKey } from "../i18n/i18n";
import { useI18n } from "../i18n/i18n";

const formatDateTime = (value: string) =>
    new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(value));

const ORDER_OPTIONS: { key: MemoryListQuery["ordering"]; labelKey: TranslationKey }[] = [
    { key: "-created_at", labelKey: "memorySortLatest" },
    { key: "created_at", labelKey: "memorySortOldest" },
    { key: "title", labelKey: "memorySortTitleAsc" },
    { key: "-title", labelKey: "memorySortTitleDesc" },
];

export default function MemoryList() {
    const navigation = useNavigation();
    const { t } = useI18n();
    const [memories, setMemories] = useState<MemoryResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [query, setQuery] = useState("");
    const [ordering, setOrdering] = useState<MemoryListQuery["ordering"]>("-created_at");

    const loadMemories = useCallback(
        async (nextQuery?: string, nextOrdering?: MemoryListQuery["ordering"]) => {
            try {
                setIsLoading(true);
                setErrorMessage(null);
                const list = await auth.getMemories({
                    q: (nextQuery ?? query).trim(),
                    ordering: nextOrdering ?? ordering,
                });
                setMemories(list);
            } catch {
                setErrorMessage(t("memoryListLoadError"));
            } finally {
                setIsLoading(false);
            }
        },
        [ordering, query, t],
    );

    useFocusEffect(
        useCallback(() => {
            loadMemories();
        }, [loadMemories]),
    );

    useEffect(() => {
        const timer = setTimeout(() => {
            loadMemories(query, ordering);
        }, 300);
        return () => clearTimeout(timer);
    }, [query, ordering, loadMemories]);

    const handleSearchSubmit = () => {
        loadMemories(query, ordering);
    };

    const handleOrdering = (value: MemoryListQuery["ordering"]) => {
        setOrdering(value);
        loadMemories(query, value);
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

                <Text style={{ marginTop: 8, fontSize: 22, fontWeight: "800", color: "#FF4D8D" }}>
                    {t("memoryListTitle")}
                </Text>

                <View style={{ marginTop: 10, flexDirection: "row", gap: 8 }}>
                    <TextInput
                        value={query}
                        onChangeText={setQuery}
                        placeholder={t("memorySearchPlaceholder")}
                        placeholderTextColor="#FFB2C7"
                        onSubmitEditing={handleSearchSubmit}
                        style={{
                            flex: 1,
                            backgroundColor: "#FFFFFF",
                            borderRadius: 12,
                            borderWidth: 1,
                            borderColor: "#FFE1ED",
                            paddingHorizontal: 12,
                            paddingVertical: 10,
                            fontSize: 13,
                            color: "#FF3B82",
                        }}
                    />
                    <Pressable
                        onPress={handleSearchSubmit}
                        style={{
                            borderRadius: 12,
                            backgroundColor: "#FFD1E3",
                            paddingHorizontal: 14,
                            justifyContent: "center",
                        }}
                    >
                        <Text style={{ fontSize: 12, fontWeight: "800", color: "#FF4D8D" }}>{t("memorySearchAction")}</Text>
                    </Pressable>
                </View>

                <Text style={{ marginTop: 10, marginBottom: 6, fontSize: 12, fontWeight: "800", color: "#C45076" }}>
                    {t("memorySortLabel")}
                </Text>

                <View
                    style={{
                        borderRadius: 14,
                        borderWidth: 1,
                        borderColor: "#FFE1ED",
                        backgroundColor: "#FFF7FB",
                        paddingHorizontal: 10,
                        paddingVertical: 10,
                    }}
                >
                    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                        {ORDER_OPTIONS.map((item) => {
                            const isActive = ordering === item.key;
                            return (
                                <Pressable
                                    key={String(item.key)}
                                    onPress={() => handleOrdering(item.key)}
                                    style={{
                                        width: "48.5%",
                                        borderRadius: 12,
                                        borderWidth: 1,
                                        borderColor: isActive ? "#FF4D8D" : "#FFD1E3",
                                        backgroundColor: isActive ? "#FF4D8D" : "#FFFFFF",
                                        paddingHorizontal: 10,
                                        paddingVertical: 10,
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 12,
                                            fontWeight: "800",
                                            color: isActive ? "#FFFFFF" : "#C45076",
                                        }}
                                    >
                                        {t(item.labelKey)}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>
                </View>

                <Pressable
                    onPress={() => navigation.navigate("MemoryCreate" as never)}
                    style={{
                        marginTop: 12,
                        borderRadius: 16,
                        backgroundColor: "#FF4D8D",
                        alignItems: "center",
                        paddingVertical: 12,
                    }}
                >
                    <Text style={{ color: "#FFFFFF", fontWeight: "800" }}>{t("memoryCreateTitle")}</Text>
                </Pressable>

                <ScrollView style={{ marginTop: 12 }} contentContainerStyle={{ paddingBottom: 40 }}>
                    {isLoading ? (
                        <View style={{ marginTop: 20, alignItems: "center" }}>
                            <ActivityIndicator color="#FF4D8D" />
                        </View>
                    ) : null}

                    {errorMessage ? (
                        <Text style={{ marginTop: 10, fontSize: 12, color: "#D84A7A" }}>{errorMessage}</Text>
                    ) : null}

                    {!isLoading && memories.length === 0 ? (
                        <Text style={{ marginTop: 10, fontSize: 12, color: "#FF6F9C" }}>{t("memoryListEmpty")}</Text>
                    ) : null}

                    {!isLoading
                        ? memories.map((memory) => (
                              <Pressable
                                  key={memory.id}
                                  onPress={() => (navigation as any).navigate("MemoryDetail", { memoryId: memory.id })}
                                  style={{
                                      marginTop: 10,
                                      borderRadius: 14,
                                      borderWidth: 1,
                                      borderColor: "#FFE1ED",
                                      backgroundColor: "#FFFFFF",
                                      paddingHorizontal: 14,
                                      paddingVertical: 12,
                                  }}
                              >
                                  <Text style={{ fontSize: 14, fontWeight: "800", color: "#FF4D8D" }}>{memory.title}</Text>
                                  <Text style={{ marginTop: 6, fontSize: 12, color: "#FF8FB1" }} numberOfLines={2}>
                                      {memory.content}
                                  </Text>
                                  <Text style={{ marginTop: 8, fontSize: 11, color: "#C96C8F" }}>
                                      {formatDateTime(memory.created_at)}
                                  </Text>
                              </Pressable>
                          ))
                        : null}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

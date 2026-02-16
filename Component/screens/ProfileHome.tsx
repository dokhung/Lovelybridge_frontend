import React, { useCallback, useEffect, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { auth, clearAuthTokens } from "../request";
import { useI18n } from "../i18n/i18n";

export default function ProfileHome() {
    const navigation = useNavigation();
    const { t } = useI18n();
    const route = useRoute();
    const params = (route.params ?? {}) as { nickname?: string; gender?: "female" | "male" | "other" | null };
    const [nickname, setNickname] = useState((params.nickname ?? "").trim());
    const [gender, setGender] = useState<"female" | "male" | "other" | null>(params.gender ?? null);
    const [partnerUsernameInput, setPartnerUsernameInput] = useState("");
    const [coupleStatus, setCoupleStatus] = useState<{
        is_coupled: boolean;
        partner_username?: string;
        partner_nickname?: string;
        partner_gender?: "female" | "male" | "other" | "";
    } | null>(null);
    const [incomingRequests, setIncomingRequests] = useState<
        { id: number; requester_username: string; created_at: string }[]
    >([]);
    const [sentRequests, setSentRequests] = useState<
        { id: number; recipient_username: string; created_at: string }[]
    >([]);
    const [coupleError, setCoupleError] = useState<string | null>(null);
    const [coupleMessage, setCoupleMessage] = useState<string | null>(null);
    const [isCoupleLoading, setIsCoupleLoading] = useState(false);

    const genderLabel = (gender: "female" | "male" | "other" | "" | null | undefined) => {
        if (gender === "female") return t("genderFemale");
        if (gender === "male") return t("genderMale");
        if (gender === "other") return t("genderOther");
        return t("genderUnknown");
    };

    const getErrorMessage = (data: any, fallback: string) => {
        if (!data) return fallback;
        if (typeof data === "string") return data;
        if (typeof data.error === "string") return data.error;
        if (typeof data.detail === "string") return data.detail;
        if (Array.isArray(data.non_field_errors) && data.non_field_errors[0]) {
            return data.non_field_errors[0];
        }
        const firstKey = Object.keys(data)[0];
        if (firstKey && Array.isArray(data[firstKey]) && data[firstKey][0]) {
            return data[firstKey][0];
        }
        return fallback;
    };

    const loadCoupleData = async () => {
        try {
            const [statusData, incomingData, sentData] = await Promise.all([
                auth.getCoupleStatus(),
                auth.getIncomingCoupleRequests(),
                auth.getSentCoupleRequests(),
            ]);
            setCoupleStatus(statusData);
            setIncomingRequests(
                incomingData.map((item) => ({
                    id: item.id,
                    requester_username: item.requester_username,
                    created_at: item.created_at,
                })),
            );
            setSentRequests(
                sentData.map((item) => ({
                    id: item.id,
                    recipient_username: item.recipient_username,
                    created_at: item.created_at,
                })),
            );
        } catch (error: any) {
            setCoupleError(getErrorMessage(error?.response?.data, t("coupleErrorLoad")));
        }
    };

    const loadProfileData = useCallback(async () => {
        try {
            const profile = await auth.getProfile();
            setNickname((profile.nickname ?? "").trim());
            setGender((profile.gender ?? null) as "female" | "male" | "other" | null);
        } catch {
            // keep existing values when profile fetch fails
        }
    }, []);

    useEffect(() => {
        loadCoupleData();
        loadProfileData();
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadProfileData();
        }, [loadProfileData]),
    );

    useEffect(() => {
        if (!coupleMessage) return;
        const timer = setTimeout(() => {
            setCoupleMessage(null);
        }, 2000);
        return () => clearTimeout(timer);
    }, [coupleMessage]);

    const handleLogout = async () => {
        await clearAuthTokens();
        navigation.reset({ index: 0, routes: [{ name: "Home" as never }] });
    };

    const handleCoupleRequest = async () => {
        if (!partnerUsernameInput.trim()) {
            setCoupleError(t("coupleErrorNeedPartner"));
            return;
        }
        setIsCoupleLoading(true);
        setCoupleError(null);
        setCoupleMessage(null);
        try {
            await auth.requestCouple({ partner_username: partnerUsernameInput.trim() });
            setCoupleMessage(t("coupleRequestSent"));
            setPartnerUsernameInput("");
            await loadCoupleData();
        } catch (error: any) {
            const code = error?.response?.data?.code;
            if (code === "AUTH_019") {
                setCoupleError(t("coupleErrorAmbiguous"));
            } else {
                setCoupleError(getErrorMessage(error?.response?.data, t("coupleErrorRequestFailed")));
            }
        } finally {
            setIsCoupleLoading(false);
        }
    };

    const handleAcceptRequest = async (requestId: number) => {
        setIsCoupleLoading(true);
        setCoupleError(null);
        setCoupleMessage(null);
        try {
            await auth.acceptCoupleRequest(requestId);
            setCoupleMessage(t("coupleRequestAccepted"));
            await loadCoupleData();
        } catch (error: any) {
            setCoupleError(getErrorMessage(error?.response?.data, t("coupleErrorAcceptFailed")));
        } finally {
            setIsCoupleLoading(false);
        }
    };

    const handleRejectRequest = async (requestId: number) => {
        setIsCoupleLoading(true);
        setCoupleError(null);
        setCoupleMessage(null);
        try {
            const requests = await auth.rejectCoupleRequest(requestId);
            setIncomingRequests(
                requests.map((item) => ({
                    id: item.id,
                    requester_username: item.requester_username,
                    created_at: item.created_at,
                })),
            );
            setCoupleMessage(t("coupleRequestRejected"));
            const statusData = await auth.getCoupleStatus();
            setCoupleStatus(statusData);
        } catch (error: any) {
            setCoupleError(getErrorMessage(error?.response?.data, t("coupleErrorRejectFailed")));
        } finally {
            setIsCoupleLoading(false);
        }
    };

    const handleCancelRequest = async (requestId: number) => {
        setIsCoupleLoading(true);
        setCoupleError(null);
        setCoupleMessage(null);
        try {
            const requests = await auth.cancelCoupleRequest(requestId);
            setSentRequests(
                requests.map((item) => ({
                    id: item.id,
                    recipient_username: item.recipient_username,
                    created_at: item.created_at,
                })),
            );
            setCoupleMessage(t("coupleRequestCanceled"));
        } catch (error: any) {
            setCoupleError(getErrorMessage(error?.response?.data, t("coupleErrorCancelFailed")));
        } finally {
            setIsCoupleLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#FFF0F6]" style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 40 }}>
                <View
                    style={{
                        backgroundColor: "#FFF7FB",
                        borderRadius: 24,
                        borderWidth: 1,
                        borderColor: "#FFE1ED",
                        paddingHorizontal: 20,
                        paddingVertical: 18,
                    }}
                >
                    <Text style={{ fontSize: 20, fontWeight: "800", color: "#FF4D8D" }}>
                        {nickname ? t("welcomeUser").replace("{nickname}", nickname) : t("welcomeUserNoNickname")}
                    </Text>
                    <Text style={{ marginTop: 6, fontSize: 12, fontWeight: "700", color: "#FF85A2" }}>
                        {t("profileGenderLabel")}: {genderLabel(gender)}
                    </Text>
                </View>

                <View
                    style={{
                        marginTop: 14,
                        backgroundColor: "#FFF7FB",
                        borderRadius: 20,
                        borderWidth: 1,
                        borderColor: "#FFE1ED",
                        paddingHorizontal: 16,
                        paddingVertical: 14,
                    }}
                >
                    <Text style={{ fontSize: 14, fontWeight: "800", color: "#FF4D8D" }}>{t("coupleStatusTitle")}</Text>
                    {coupleStatus?.is_coupled ? (
                        <Text style={{ marginTop: 6, fontSize: 12, color: "#FF6F9C" }}>
                            {t("coupleConnectedWith")}: {coupleStatus.partner_nickname || coupleStatus.partner_username} ({genderLabel(coupleStatus.partner_gender)})
                        </Text>
                    ) : (
                        <Text style={{ marginTop: 6, fontSize: 12, color: "#FF6F9C" }}>{t("coupleNotConnected")}</Text>
                    )}

                    {!coupleStatus?.is_coupled && (
                        <>
                            <TextInput
                                style={{
                                    marginTop: 10,
                                    backgroundColor: "#FFFFFF",
                                    borderRadius: 12,
                                    borderWidth: 1,
                                    borderColor: "#FFE1ED",
                                    paddingHorizontal: 12,
                                    paddingVertical: 10,
                                    color: "#FF3B82",
                                }}
                                placeholder={t("partnerUsernamePlaceholder")}
                                placeholderTextColor="#FFB2C7"
                                value={partnerUsernameInput}
                                onChangeText={setPartnerUsernameInput}
                                autoCapitalize="none"
                            />
                            <Pressable
                                onPress={handleCoupleRequest}
                                disabled={isCoupleLoading}
                                style={{
                                    marginTop: 10,
                                    borderRadius: 14,
                                    backgroundColor: isCoupleLoading ? "#FFB2C7" : "#FF4D8D",
                                    paddingVertical: 11,
                                    alignItems: "center",
                                }}
                            >
                                <Text style={{ color: "#fff", fontWeight: "800" }}>{t("sendCoupleRequest")}</Text>
                            </Pressable>
                        </>
                    )}

                    <Pressable
                        onPress={loadCoupleData}
                        style={{
                            marginTop: 8,
                            alignSelf: "flex-start",
                            borderRadius: 12,
                            borderWidth: 1,
                            borderColor: "#FFE1ED",
                            backgroundColor: "#fff",
                            paddingHorizontal: 10,
                            paddingVertical: 6,
                        }}
                    >
                        <Text style={{ fontSize: 11, fontWeight: "700", color: "#FF6F9C" }}>{t("refreshAction")}</Text>
                    </Pressable>

                    {coupleError ? (
                        <Text style={{ marginTop: 8, fontSize: 12, fontWeight: "700", color: "#E23A6E" }}>{coupleError}</Text>
                    ) : null}
                    {coupleMessage ? (
                        <Text style={{ marginTop: 8, fontSize: 12, fontWeight: "700", color: "#33A26B" }}>{coupleMessage}</Text>
                    ) : null}
                </View>

                <View
                    style={{
                        marginTop: 12,
                        backgroundColor: "#FFF7FB",
                        borderRadius: 20,
                        borderWidth: 1,
                        borderColor: "#FFE1ED",
                        paddingHorizontal: 16,
                        paddingVertical: 14,
                    }}
                >
                    <Text style={{ fontSize: 14, fontWeight: "800", color: "#FF4D8D" }}>{t("incomingRequestsTitle")}</Text>
                    {incomingRequests.length === 0 ? (
                        <Text style={{ marginTop: 6, fontSize: 12, color: "#FF6F9C" }}>{t("noIncomingRequests")}</Text>
                    ) : (
                        incomingRequests.map((item) => (
                            <View
                                key={item.id}
                                style={{
                                    marginTop: 10,
                                    borderRadius: 12,
                                    borderWidth: 1,
                                    borderColor: "#FFE1ED",
                                    backgroundColor: "#FFFFFF",
                                    paddingHorizontal: 12,
                                    paddingVertical: 10,
                                }}
                            >
                                <Text style={{ fontSize: 12, fontWeight: "700", color: "#FF4D8D" }}>
                                    {t("incomingRequestFrom").replace("{username}", item.requester_username)}
                                </Text>
                                <Text style={{ marginTop: 4, fontSize: 11, color: "#FF8FB1" }}>
                                    {t("requestIdLabel").replace("{id}", String(item.id))}
                                </Text>
                                <View style={{ marginTop: 8, flexDirection: "row", gap: 8 }}>
                                    <Pressable
                                        onPress={() => handleAcceptRequest(item.id)}
                                        disabled={isCoupleLoading}
                                        style={{
                                            borderRadius: 10,
                                            backgroundColor: isCoupleLoading ? "#FFB2C7" : "#FFD1E3",
                                            paddingHorizontal: 12,
                                            paddingVertical: 7,
                                        }}
                                    >
                                        <Text style={{ fontSize: 12, fontWeight: "800", color: "#FF4D8D" }}>{t("acceptAction")}</Text>
                                    </Pressable>
                                    <Pressable
                                        onPress={() => handleRejectRequest(item.id)}
                                        disabled={isCoupleLoading}
                                        style={{
                                            borderRadius: 10,
                                            backgroundColor: isCoupleLoading ? "#F0C7D6" : "#FFE9F2",
                                            borderWidth: 1,
                                            borderColor: "#FFD1E3",
                                            paddingHorizontal: 12,
                                            paddingVertical: 7,
                                        }}
                                    >
                                        <Text style={{ fontSize: 12, fontWeight: "800", color: "#C45076" }}>{t("rejectAction")}</Text>
                                    </Pressable>
                                </View>
                            </View>
                        ))
                    )}
                </View>

                <View
                    style={{
                        marginTop: 12,
                        backgroundColor: "#FFF7FB",
                        borderRadius: 20,
                        borderWidth: 1,
                        borderColor: "#FFE1ED",
                        paddingHorizontal: 16,
                        paddingVertical: 14,
                    }}
                >
                    <Text style={{ fontSize: 14, fontWeight: "800", color: "#FF4D8D" }}>{t("sentRequestsTitle")}</Text>
                    {sentRequests.length === 0 ? (
                        <Text style={{ marginTop: 6, fontSize: 12, color: "#FF6F9C" }}>{t("noSentRequests")}</Text>
                    ) : (
                        sentRequests.map((item) => (
                            <View
                                key={item.id}
                                style={{
                                    marginTop: 10,
                                    borderRadius: 12,
                                    borderWidth: 1,
                                    borderColor: "#FFE1ED",
                                    backgroundColor: "#FFFFFF",
                                    paddingHorizontal: 12,
                                    paddingVertical: 10,
                                }}
                            >
                                <Text style={{ fontSize: 12, fontWeight: "700", color: "#FF4D8D" }}>
                                    {t("sentRequestTo").replace("{username}", item.recipient_username)}
                                </Text>
                                <Text style={{ marginTop: 4, fontSize: 11, color: "#FF8FB1" }}>
                                    {t("requestIdLabel").replace("{id}", String(item.id))}
                                </Text>
                                <Pressable
                                    onPress={() => handleCancelRequest(item.id)}
                                    disabled={isCoupleLoading}
                                    style={{
                                        marginTop: 8,
                                        alignSelf: "flex-start",
                                        borderRadius: 10,
                                        backgroundColor: isCoupleLoading ? "#F0C7D6" : "#FFE9F2",
                                        borderWidth: 1,
                                        borderColor: "#FFD1E3",
                                        paddingHorizontal: 12,
                                        paddingVertical: 7,
                                    }}
                                >
                                    <Text style={{ fontSize: 12, fontWeight: "800", color: "#C45076" }}>{t("cancelAction")}</Text>
                                </Pressable>
                            </View>
                        ))
                    )}
                </View>

                <View style={{ marginTop: 18, gap: 12 }}>
                    <Pressable
                        onPress={() => navigation.navigate("MemoryList" as never)}
                        style={{
                            backgroundColor: "#FF4D8D",
                            borderRadius: 18,
                            paddingVertical: 14,
                            alignItems: "center",
                        }}
                    >
                        <Text style={{ color: "#fff", fontWeight: "800" }}>{t("memoryCreateTitle")}</Text>
                    </Pressable>

                    <Pressable
                        onPress={() => navigation.navigate("Attendance" as never)}
                        style={{
                            backgroundColor: "#FFD1E3",
                            borderRadius: 18,
                            paddingVertical: 14,
                            alignItems: "center",
                        }}
                    >
                        <Text style={{ color: "#FF4D8D", fontWeight: "800" }}>{t("attendanceTitle")}</Text>
                    </Pressable>

                    <Pressable
                        onPress={() => navigation.navigate("ProfileEdit" as never)}
                        style={{
                            backgroundColor: "#FFF7FB",
                            borderRadius: 18,
                            paddingVertical: 14,
                            alignItems: "center",
                            borderWidth: 1,
                            borderColor: "#FFE1ED",
                        }}
                    >
                        <Text style={{ color: "#FF4D8D", fontWeight: "800" }}>{t("profileEditTitle")}</Text>
                    </Pressable>

                    <Pressable
                        onPress={() => navigation.navigate("Settings" as never)}
                        style={{
                            backgroundColor: "#FFF7FB",
                            borderRadius: 18,
                            paddingVertical: 14,
                            alignItems: "center",
                            borderWidth: 1,
                            borderColor: "#FFE1ED",
                        }}
                    >
                        <Text style={{ color: "#FF4D8D", fontWeight: "800" }}>{t("settings")}</Text>
                    </Pressable>

                    <Pressable
                        onPress={handleLogout}
                        style={{
                            backgroundColor: "#FFE3EE",
                            borderRadius: 18,
                            paddingVertical: 14,
                            alignItems: "center",
                        }}
                    >
                        <Text style={{ color: "#FF4D8D", fontWeight: "800" }}>{t("logout")}</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

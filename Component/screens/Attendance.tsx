import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../request";
import { useI18n } from "../i18n/i18n";

export default function Attendance() {
    const navigation = useNavigation();
    const { t } = useI18n();
    const [todayLabel, setTodayLabel] = useState("");
    const [streakCount, setStreakCount] = useState(0);
    const [checkedInToday, setCheckedInToday] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

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

    const loadAttendanceStatus = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const statusData = await auth.getAttendanceStatus();
            setTodayLabel(statusData.today);
            setStreakCount(statusData.streak_count);
            setCheckedInToday(statusData.checked_in_today);
        } catch (e: any) {
            setError(getErrorMessage(e?.response?.data, t("attendanceErrorLoad")));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadAttendanceStatus();
    }, []);

    const handleCheckIn = async () => {
        setIsSubmitting(true);
        setMessage(null);
        setError(null);
        try {
            const data = await auth.checkInAttendance();
            setTodayLabel(data.today);
            setStreakCount(data.streak_count);
            setCheckedInToday(data.checked_in_today);
            setMessage(data.already_checked_in ? t("attendanceAlreadyCheckedIn") : t("attendanceCheckedInSuccess"));
        } catch (e: any) {
            setError(getErrorMessage(e?.response?.data, t("attendanceErrorCheckIn")));
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
                <Text style={{ fontSize: 22, fontWeight: "800", color: "#FF4D8D" }}>{t("attendanceTitle")}</Text>
                <Text style={{ marginTop: 6, fontSize: 12, color: "#FF85A2" }}>
                    {t("attendanceSubtitle")}
                </Text>

                <View
                    style={{
                        marginTop: 18,
                        backgroundColor: "#FFF7FB",
                        borderRadius: 24,
                        borderWidth: 1,
                        borderColor: "#FFE1ED",
                        paddingHorizontal: 20,
                        paddingVertical: 18,
                    }}
                >
                    <Text style={{ fontSize: 14, fontWeight: "700", color: "#FF6F9C" }}>
                        {t("attendanceTodayDate")}
                    </Text>
                    <Text style={{ marginTop: 6, fontSize: 20, fontWeight: "800", color: "#FF4D8D" }}>
                        {todayLabel || "-"}
                    </Text>
                    <Text style={{ marginTop: 10, fontSize: 12, color: "#FF85A2" }}>
                        {t("attendanceStreakCount").replace("{count}", String(streakCount))}
                    </Text>
                    <Text style={{ marginTop: 4, fontSize: 12, color: checkedInToday ? "#33A26B" : "#FF85A2" }}>
                        {t("attendanceStatusLabel")}: {checkedInToday ? t("attendanceStatusDone") : t("attendanceStatusPending")}
                    </Text>
                </View>

                <Pressable
                    onPress={handleCheckIn}
                    disabled={isSubmitting || isLoading}
                    style={{
                        marginTop: 18,
                        borderRadius: 18,
                        backgroundColor: isSubmitting || isLoading ? "#FFE0EB" : "#FFD1E3",
                        paddingVertical: 14,
                        alignItems: "center",
                    }}
                >
                    {isSubmitting ? (
                        <ActivityIndicator color="#FF4D8D" />
                    ) : (
                        <Text style={{ color: "#FF4D8D", fontWeight: "800" }}>{t("attendanceCheckInAction")}</Text>
                    )}
                </Pressable>

                <Pressable
                    onPress={loadAttendanceStatus}
                    disabled={isLoading || isSubmitting}
                    style={{
                        marginTop: 10,
                        alignSelf: "flex-start",
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: "#FFE1ED",
                        backgroundColor: "#FFF7FB",
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                    }}
                >
                    <Text style={{ fontSize: 11, fontWeight: "700", color: "#FF6F9C" }}>
                        {t("refreshAction")}
                    </Text>
                </Pressable>

                {isLoading ? (
                    <View style={{ marginTop: 10, alignSelf: "flex-start" }}>
                        <ActivityIndicator color="#FF4D8D" />
                    </View>
                ) : null}
                {message ? (
                    <Text style={{ marginTop: 10, fontSize: 12, fontWeight: "700", color: "#33A26B" }}>
                        {message}
                    </Text>
                ) : null}
                {error ? (
                    <Text style={{ marginTop: 10, fontSize: 12, fontWeight: "700", color: "#E23A6E" }}>
                        {error}
                    </Text>
                ) : null}
            </View>
        </SafeAreaView>
    );
}

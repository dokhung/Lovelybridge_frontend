import React from "react";
import {Pressable, Text, View} from "react-native";
import {Locale, useI18n} from "./i18n";

const options: {label: string; value: Locale}[] = [
    {label: "KR", value: "ko"},
    {label: "EN", value: "en"},
    {label: "JP", value: "ja"},
    {label: "CN", value: "zh"},
];

export default function LanguageToggle({className}: {className?: string}) {
    const {locale, setLocale} = useI18n();

    return (
        <View className={className}>
            <View className="flex-row items-center rounded-full bg-white/80 px-2 py-1">
                {options.map((option) => {
                    const active = option.value === locale;
                    return (
                        <Pressable
                            key={option.value}
                            onPress={() => setLocale(option.value)}
                            className="px-2 py-1"
                            accessibilityRole="button"
                            accessibilityLabel={`language-${option.value}`}
                        >
                            <Text
                                className="text-[11px] font-semibold"
                                style={{
                                    color: active ? "#FF3B82" : "#FF9BB7",
                                }}
                            >
                                {option.label}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
}

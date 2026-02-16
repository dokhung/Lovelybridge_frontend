import { useCallback, useEffect, useRef } from "react";

const SOUND_FILE = "ui_click.mp3";

type SoundType = {
    setCategory?: (category: string, mixWithOthers?: boolean) => void;
    MAIN_BUNDLE?: string;
    new (filename: string, basePath: string | undefined, onLoad?: (error?: unknown) => void): {
        play: (onEnd?: (success: boolean) => void) => void;
        stop: (onEnd?: () => void) => void;
        release: () => void;
    };
};

export default function useClickSound() {
    const soundRef = useRef<InstanceType<SoundType> | null>(null);

    useEffect(() => {
        let SoundModule: SoundType | null = null;
        try {
            // Lazy load to avoid crash if native module isn't linked yet.
            SoundModule = require("react-native-sound") as SoundType;
        } catch {
            return;
        }

        if (!SoundModule) return;
        SoundModule.setCategory?.("Ambient", true);
        const sound = new SoundModule(SOUND_FILE, SoundModule.MAIN_BUNDLE, () => {});
        soundRef.current = sound;

        return () => {
            soundRef.current?.release();
            soundRef.current = null;
        };
    }, []);

    const playClick = useCallback(() => {
        const sound = soundRef.current;
        if (!sound) return;
        sound.stop(() => {
            sound.play();
        });
    }, []);

    return { playClick };
}

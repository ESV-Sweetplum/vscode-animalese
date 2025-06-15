import { getConfig } from "./configState";
import { DEFAULT_SETTINGS, settings } from "./pluginSettings";

export function loadSettings(firstRun: boolean) {
    (Object.keys(settings) as Array<keyof typeof settings>).forEach(
        (key: keyof typeof settings) => {
            (settings as any)[key] =
                getConfig(key, DEFAULT_SETTINGS[key], !firstRun) ?? false;
        }
    );
}

import { getConfig } from "./configState";
import { DEFAULT_SETTINGS, settings } from "./pluginSettings";

/**
 * ### (IMPURE) Gets all settings and loads them into the `settings` object, which is a defined global.
 * @param firstRun Whether or not this function has been run for the first time.
 * @return {undefined}
 */
export function loadSettings(firstRun: boolean): void {
    (Object.keys(settings) as Array<keyof typeof settings>).forEach(
        (key: keyof typeof settings) => {
            (settings as any)[key] =
                getConfig(key, DEFAULT_SETTINGS[key], !firstRun) ?? false;
        }
    );
}

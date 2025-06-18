import * as vscode from "vscode";
import { settings } from "./pluginSettings";

/**
 * ### Gets a specified setting's value.
 * @param key The vscode id of the setting, with underscores instead of dots. For example, to find `vscode-animalese.intonation.falloffTime`, this should be `intonation_falloffTime`.
 * @param defaultValue If the specified config doesn't exist, fallback to this default value.
 * @param changedConfig Whether or not the config needs to be obtained because it recently changed.
 * @returns The configuration's value, or the fallback if the setting doesn't exist.
 */
export function getConfig<T>(
    key: string,
    defaultValue: T,
    changedConfig = false
): T {
    const config = vscode.workspace.getConfiguration("vscode-animalese");

    const configKey = key.replaceAll("_", ".");
    if (changedConfig) {
        return config.inspect<T>(configKey)?.globalValue ?? defaultValue;
    }
    return config.get<T>(configKey) ?? defaultValue;
}

/**
 * ### Updates a setting's value on the vscode side.
 * @param key The vscode id of the setting, with underscores instead of dots. For example, to find `vscode-animalese.intonation.falloffTime`, this should be `intonation_falloffTime`.
 * @param value The value to assign to the setting.
 */
export function setConfig(key: keyof typeof settings, value: any) {
    const config = vscode.workspace.getConfiguration("vscode-animalese");

    (settings as any)[key] = value;
    config.update(key.replaceAll("_", "."), value, true); // Always save to global by passing `true` as the third param.
}

import * as vscode from "vscode";
import { settings } from "./pluginSettings";

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

export function setConfig(key: keyof typeof settings, value: any) {
    const config = vscode.workspace.getConfiguration("vscode-animalese");

    (settings as any)[key] = value;
    config.update(key.replaceAll("_", "."), value, true);
}

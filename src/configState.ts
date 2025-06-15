import * as vscode from "vscode";

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

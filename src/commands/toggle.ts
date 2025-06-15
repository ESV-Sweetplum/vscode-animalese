import * as vscode from "vscode";
import { extensionEnabled, setExtensionEnabled } from "../extension";
import { disablingText, enablingText } from "../constants/popupText";

export function getToggleCommand() {
    const toggleCmd = vscode.commands.registerCommand(
        "vscode-animalese.toggle",
        () => {
            setExtensionEnabled(!extensionEnabled);
            vscode.window.showInformationMessage(
                extensionEnabled ? enablingText : disablingText
            );
        }
    );
    return toggleCmd;
}

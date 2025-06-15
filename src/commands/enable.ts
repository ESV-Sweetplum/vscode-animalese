import * as vscode from "vscode";
import { setExtensionEnabled } from "../extension";
import { enablingText } from "../constants/popupText";

export function getEnableCommand() {
    const enableCmd = vscode.commands.registerCommand(
        "vscode-animalese.enable",
        () => {
            setExtensionEnabled(true);
            vscode.window.showInformationMessage(enablingText);
        }
    );

    return enableCmd;
}

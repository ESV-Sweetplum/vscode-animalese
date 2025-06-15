import * as vscode from "vscode";
import { settings } from "../settings/pluginSettings";
import { setConfig } from "../settings/configState";

export function getSetVolumeCommand() {
    const setVolumeCmd = vscode.commands.registerCommand(
        "vscode-animalese.setVolume",
        () => {
            const oldVolume = settings.volume ?? 50;
            vscode.window
                .showInputBox({
                    title: "Set Volume",
                    prompt: "What would you like the volume % to be? The response should be an integer within 1-100.",
                    placeHolder: oldVolume.toString(),
                    validateInput: (str) => {
                        if (isNaN(parseInt(str))) {
                            return {
                                message: "The input provided is not a number.",
                                severity: 3,
                            };
                        }
                        if (!Number.isInteger(parseFloat(str))) {
                            return {
                                message:
                                    "The input provided should be an integer.",
                                severity: 2,
                            };
                        }
                        return "";
                    },
                })
                .then((v) => {
                    if (!v) return;
                    const percentage = parseInt(v);
                    vscode.window.showInformationMessage(
                        `Successfully set volume to ${percentage}%.`
                    );
                    setConfig("volume", percentage);
                });
        }
    );

    return setVolumeCmd;
}

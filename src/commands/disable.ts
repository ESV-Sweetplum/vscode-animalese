import * as vscode from 'vscode';
import { setExtensionEnabled } from '../extension';
import { disablingText } from '../constants/popupText';

export function getDisableCommand() {
    const disableCmd = vscode.commands.registerCommand(
        'vscode-animalese.disable',
        () => {
            setExtensionEnabled(false);
            vscode.window.showInformationMessage(disablingText);
        }
    );

    return disableCmd;
}

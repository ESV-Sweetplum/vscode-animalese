import * as vscode from 'vscode';
import { settings } from '../settings/pluginSettings';
import { setConfig } from '../settings/configState';

export function getToggleSFXCommand() {
    const toggleSFXCmd = vscode.commands.registerCommand('vscode-animalese.toggleSFX', () => {
        const newValue = !settings.onlySFX;
        setConfig('onlySFX', newValue);
        vscode.window.showInformationMessage(
            newValue
                ? 'Disabled individual sounds for alphabetical keys.'
                : 'Enabled individual sounds for alphabetical keys.',
        );
    });
    return toggleSFXCmd;
}

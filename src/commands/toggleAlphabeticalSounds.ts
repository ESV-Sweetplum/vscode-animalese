import * as vscode from 'vscode';
import { settings } from '../settings/pluginSettings';
import { setConfig } from '../settings/configState';

export function getToggleSoundsCommand() {
    const toggleSoundsCmd = vscode.commands.registerCommand('vscode-animalese.toggleSounds', () => {
        const newValue = !settings.alphabeticalSounds;
        setConfig('alphabeticalSounds', newValue);
        vscode.window.showInformationMessage(
            newValue
                ? 'Disabled individual sounds for alphabetical keys.'
                : 'Enabled individual sounds for alphabetical keys.',
        );
    });
    return toggleSoundsCmd;
}

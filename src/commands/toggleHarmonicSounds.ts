import * as vscode from 'vscode';
import { settings } from '../settings/pluginSettings';
import { setConfig } from '../settings/configState';

export function getToggleHarmonicSoundsCommand() {
    const toggleHarmonicSoundsCmd = vscode.commands.registerCommand('vscode-animalese.toggleHarmonicSounds', () => {
        const newValue = !settings.harmonicSounds;
        setConfig('harmonicSounds', newValue);
        vscode.window.showInformationMessage(
            newValue ? 'Enabled harmonic sounds for the number keys.' : 'Disabled harmonic sounds for the number keys.',
        );
    });
    return toggleHarmonicSoundsCmd;
}

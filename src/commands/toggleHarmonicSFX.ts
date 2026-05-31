import * as vscode from 'vscode';
import { settings } from '../settings/pluginSettings';
import { setConfig } from '../settings/configState';

export function getToggleHarmonicSFXCommand() {
    const toggleHarmonicSFXCmd = vscode.commands.registerCommand('vscode-animalese.toggleHarmonicSFX', () => {
        const newValue = !settings.harmonicSFX;
        setConfig('harmonicSFX', newValue);
        vscode.window.showInformationMessage(
            newValue ? 'Enabled harmonic sounds for the number keys.' : 'Disabled harmonic sounds for the number keys.',
        );
    });
    return toggleHarmonicSFXCmd;
}

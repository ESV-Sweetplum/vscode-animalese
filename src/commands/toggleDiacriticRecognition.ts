import * as vscode from 'vscode';
import { settings } from '../settings/pluginSettings';
import { setConfig } from '../settings/configState';

export function getToggleDiacriticRecognitionCommand() {
    const toggleDiacriticRecognitionCmd = vscode.commands.registerCommand(
        'vscode-animalese.toggleDiacriticRecognition',
        () => {
            const newValue = !settings.diacriticRecognition;
            setConfig('diacriticRecognition', newValue);
            vscode.window.showInformationMessage(
                newValue ? 'Enabled diacritic recognition.' : 'Disabled diacritic recognition..',
            );
        },
    );
    return toggleDiacriticRecognitionCmd;
}

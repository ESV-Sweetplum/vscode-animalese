import * as vscode from 'vscode';
import { settings } from '../settings/pluginSettings';
import { setConfig } from '../settings/configState';
import { VOICE_LIST } from '../constants/voiceList';

export function getSetVoiceCommand() {
    const setVoiceCmd = vscode.commands.registerCommand(
        'vscode-animalese.setVoice',
        () => {
            const oldVoice = settings.voice ?? 'Female Voice 1 (Sweet)';
            vscode.window
                .showQuickPick(VOICE_LIST, {
                    title: 'Set Voice',
                    placeHolder: oldVoice,
                })
                .then((v) => {
                    if (!v) return;
                    vscode.window.showInformationMessage(
                        `Successfully set voice to ${v}.`
                    );
                    setConfig('voice', v);
                });
        }
    );
    return setVoiceCmd;
}

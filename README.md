# vscode-animalese

![Typescript Image](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) ![Webpack Image](https://img.shields.io/badge/Webpack-8DD6F9?style=for-the-badge&logo=Webpack&logoColor=white)

![Visual Studio Marketplace Installs](https://img.shields.io/visual-studio-marketplace/i/AidanHsiao.vscode-animalese?style=plastic&color=%23e0d0b4) ![Visual Studio Marketplace Release Date](https://img.shields.io/visual-studio-marketplace/release-date/AidanHsiao.vscode-animalese) ![GitHub License](https://img.shields.io/github/license/esv-sweetplum/vscode-animalese) ![Visual Studio Marketplace Rating](https://img.shields.io/visual-studio-marketplace/stars/AidanHsiao.vscode-animalese)

<center><i><b> "Not Strictly Advisable From A Business Perspective, But Quite Generous. Yes yes!"  - Tom Nook</b></i></center>

### Write code with the whimsical style of "Animal Crossing"-esque characters!

[`vscode-animalese`](https://marketplace.visualstudio.com/items?itemName=AidanHsiao.vscode-animalese) is a [Visual Studio Code](https://code.visualstudio.com/) extension that functions similarly to the chrome plugin [`Animalese Typing`](https://chromewebstore.google.com/detail/animalese-typing/djbgadolfboockbofalipohdncimebic?hl=en), made by [DageXVIII](https://github.com/joshxviii). Each time you type a character in a file, a corresponding animalese sound will play with nearly 0 delay. Not very practical; but certainly very fun!

## Special Thanks To:

-   [DageXVIII](https://github.com/joshxviii/animalese-typing) for the original chrome extension and audio assets; without them, none of this would have been possible.
-   Mel for the introduction to animalese-style keysounds.
-   Amity for the icon.
-   [ircam-ismm](https://github.com/ircam-ismm) for the fantastic [`node-web-audio-api`](https://www.npmjs.com/package/node-web-audio-api) package, which served as a great low-latency alternative to the simpler albeit jankier [`sound-play`](https://www.npmjs.com/package/sound-play) package.

## Command List

> **All commands are prefaced with the namespace `vscode-animalese:`.**

-   `Enable/Disable/Toggle Animalese Sounds`: Self-explanatory.
-   `Set Animalese Volume/Voice`: Self-explanatory

## More Detailed Configuration List

> ⚠️ **The execution of this plugin is very rudimentary, and has not been tested on any other platform besides Windows.** If there is a pressing issue to solve, please raise an issue within the [GitHub repository](https://github.com/ESV-Sweetplum/vscode-animalese).

-   `vscode-animalese.volume` (integer between 0-100): Controls the volume of the keysounds, where 100% is max volume.
-   `vscode-animalese.voice` (selectable from 8 different voices): Customize the timbre of the keysounds with 8 different voice profiles (yoinked from [`animalese-typing`](https://www.npmjs.com/package/sound-play)).
-   `vscode-animalese.specialPunctuation` (boolean): By default, `!`, `?` and `Enter` produce special sounds that represent the ends of sentences. To override this with a standard voice, set this setting to `true`. This will result in the following characters-to-sounds map:
    -   `?` -> `です？` or "desuka?"
    -   `!` -> `グア~` or "gwah~"
    -   `Enter` -> `おーけ` or "OK"
-   `vscode-animalese.intonation.falloffTime` (positive number): Determines how many seconds it takes for the audio to fade out (although each keysound is not above a second regardless, so this value should be like 0.75 at most).
-   `vscode-animalese.intonation.pitchVariation` (positive integer): Adjusts the strength of pitch variation between duplicate key pressed. If set to 0, all keypresses of the same key (such as pressing the `e` key 7 times) will sound identical.

# Changelog

## v0.2.2

-   vscode-animalese now works on MacOS and Linux! Big thanks to [iandoesallthethings](https://github.com/iandoesallthethings) for writing the PR.

## v0.2.1

-   Reduced file size by around half
-   Now automatically removes silent audio at the beginning of samples to reduce latency even further
-   Added a custom sound override, where you can replace all keypresses with a sound of your choice
-   Changed some setting descriptions to be more accurate
-   Fixed bug where ^ symbol would be included in alphabetical search
-   Now properly restricts input of volume command to be within [0-100].

## v0.2.0

-   Decreased sound latency by 15% using caches
-   Complete backend overhaul to reduce complexity of files
-   New exponential falloff setting to more sharply decrease amplitude of audio over time

## v0.1.2

-   Added even more metadata to the marketplace

## v0.1.1

-   Added more metadata to the marketplace

## v0.1.0

-   Now cleans up previous audio contexts to eliminate static noise after too much usage.

## v0.0.2

-   Made sure to actually include the `node-web-audio-api` package this time... so the extension doesn't immediately fucking crash

## v0.0.1

-   Made the extension in 12 hours
-   Added support for all alphanumeric keys and most standard special characters found on a 60% keyboard.
-   Added rudimentary settings so you don't get your ears blasted.

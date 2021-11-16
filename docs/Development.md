# Development

## Installation Prerequisites:

  * latest [Visual Studio Code](https://code.visualstudio.com/) (Insiders recommended)
  * [Node.js](https://nodejs.org/) at least v14.x.x (latest LTS recommended)
  * [Yarn](https://classic.yarnpkg.com/en/docs/install#windows-stable) Classic Stable (^v1.22.4 recommended)

## Building (Develop with Watcher)

1. Clone this repository and cd to the project root
1. Install the dependencies:
	```bash
	$ yarn install
	```
1. To run the extension, start VSCode and open the 'Run and Debug' view from its Activity Bar (Ctrl+Shift+D).
1. Select and run 'Launch Extension' at the top left by hitting the green arrow:

	![ Launch Extension ](./images/launch_extension.png)

	- The `npm: watch` command requires the [TypeScript + Webpack Problem Matchers](https://marketplace.visualstudio.com/items?itemName=amodio.tsl-problem-matcher) extension to be installed.

## Debugging Guides

- [Running and Debugging Your Extension](https://vscode.readthedocs.io/en/latest/extensions/debugging-extensions/)
- [Debugging in Visual Studio Code](https://code.visualstudio.com/docs/editor/debugging)
- [Diagnosing Terminal Issues](https://github.com/microsoft/vscode/wiki/Terminal-Issues#diagnosing-terminal-issues) - Particularly useful if error notifications or the terminal output not providing enough information (such as `The terminal process terminated with exit code: 1`)
- [Inspect Context Keys utility](https://code.visualstudio.com/api/references/when-clause-contexts#inspect-context-keys-utility) and the Developer Tools (`Ctrl+Shift+I` or via **Help > Toggle Developer Tools** menu) to debug the UI.

## Building (Production Package)

1. Install VSCE ([The Visual Studio Code Extension Manager](https://github.com/microsoft/vscode-vsce#vsce)) globally via yarn:
	```bash
	$ yarn global add vsce
	```
	or via npm:
	```bash
	$ npm install -g vsce
	```
1. Follow the steps 1 and 2 from [Building (Develop with Watcher)](#building-develop-with-watcher)
1. In the project root, build the package by running:
	```bash
	$ yarn run package
	```
1. Install the resulting VSIX package `semantic-crosswalk-editor-0.xx.x.vsix` under VS Code -> Extensions (preferable in a VS Code Insiders instance):

	![ Install Extension ](./images/install_extension_highlighted.png)

## Known Issues

1. Warning `The engine "vscode" appears to be invalid.` when launching the watcher or trying to package the extension is a known issue with VS Code and yarn and can be fixed by running `yarn config set ignore-engines true`  

	If you don't want to ignore engines globally with yarn in your environment, but just for this repository, use the `--ignore-engines` flag prior during the initial install via `yarn install --ignore-engines` at [Building (Develop with Watcher)](#building-develop-with-watcher) step 1.

2. Debug error `[DEP0005] DeprecationWarning: Buffer() is deprecated due to security and usability issues.` is an issue related to VS Code (the bootstrap-fork to be more specific) and your current node version. Either update/reinstall to the latest VS Code or Node version (or both).

# Semantic Crosswalk Editor

Editor to improve Data Interoperability by bridging Standards using human-centric Semantics.

## Development Installation

### Installation Prerequisites:

  * latest [Visual Studio Code](https://code.visualstudio.com/)
  * [Node.js](https://nodejs.org/) v4.0.0 or higher
  * [JDK 8+](http://www.oracle.com/technetwork/java/javase/downloads/index.html)
  * [Maven](https://maven.apache.org/)

### Building (Develop with Watcher)

1. Clone this repository
1. Fill the Git submodules with content: ```git submodule update --init```
1. `cd lemminx/`
1. Install the maven dependencies Mac/Linux:
	```bash
	$ ./mvnw verify
	```
	or for Windows:
	```bash
	$ mvnw.cmd verify
1. `cd vscode-xml/`
1. Install the dependencies:
	```bash
	$ npm install
	```

	- If you have a space in your Windows user name (e.g. `'C:\Users\Firstname Lastname'`) and should recieve an error similar to:
		```
		Error: EEXIST: file already exists, mkdir 'C:\Users\Firstname'
		command not found: npm-force-resolutions
		...
		```
		The workaround is to provide a different path without spaces for the npm-cache, e.g. create a `.npmrc` config file in your user directory and define the path there via:
		```
		cache=C:\some-directory-without-space\npm-cache
		```

1. In `vscode-xml/`, build the server by running:
	```bash
	$ npm run build-server
	```
1. To run the extension, start VSCode and open the 'Run and Debug' view from its Activity Bar (Ctrl+Shift+D).
1. Select and run 'Launch Extension' at the top left by hitting the green arrow:

	![ Launch Extension ](./images/launch_extension.png)

	- If VSCode complains about the 'Red Hat Commons' extension is not supported in Restricted Mode:
	Go to **File > Preferences > Settings**, search for `security.workspace.trust.enabled` and uncheck it.
	- The `npm: watch` command requires the [TypeScript + Webpack Problem Matchers](https://marketplace.visualstudio.com/items?itemName=eamodio.tsl-problem-matcher) extension to be installed.

### Debugging Guides

- [Running and Debugging Your Extension](https://vscode.readthedocs.io/en/latest/extensions/debugging-extensions/)
- [Debugging in Visual Studio Code](https://code.visualstudio.com/docs/editor/debugging)
- [Diagnosing Terminal Issues](https://github.com/microsoft/vscode/wiki/Terminal-Issues#diagnosing-terminal-issues) - Particularly useful if error notifications or the terminal output not providing enough information (such as `The terminal process terminated with exit code: 1`)

### Tracing Language Server Communication

1. Turn on `xml.trace.server` in the VSCode preferences
1. Go to `View -> Output -> XML Support` (drop down menu top right)

### Building (Production Package)

1. Install VSCE ([The Visual Studio Code Extension Manager](https://github.com/microsoft/vscode-vsce#vsce)):
	```bash
	$ npm install -g vsce
	```
1. Follow the steps 1-7 from [Building (Develop with Watcher)](#building-develop-with-watcher)
1. In `vscode-xml/`, build the package by running:
	```bash
	$ vsce package
	```
	- If you receive a `Command failed: npm list --production --parseable --depth=99999 --loglevel=error` followed by many `npm ERR! missing` ([due to an issue with npm 7+](https://github.com/microsoft/vscode-vsce/issues/439#issue-597647066)), the workaround is:
	```bash
	$ vsce package --yarn
	```
1. Install the resulting VSIX package `vscode-xml/semantic-crosswalk-editor-0.xx.x.vsix` under VS Code -> Extensions (preferable in a VS Code Insiders instance):

	![ Install Extension ](./images/install_extension_highlighted.png)

## Binary Server Testing

### Testing a binary version of LemMinX

1. Copy the binary version of LemMinX to:

   | OS | Location (relative to root of repository) |
   | --- | --- |
   | Linux | `./vscode-xml/server/lemminx-linux` |
   | macOS | `./vscode-xml/server/lemminx-darwin-x86_64` |
   | Windows | `.\vscode-xml\server\lemminx-win32.exe` |

   Alternatively, you can set the `xml.server.binary.path` preference to specify the path of the binary to run.

1. Make sure that you set `xml.server.preferBinary` to `true`,
disable any [LemMinX extensions](https://github.com/DAPSI-IDISS/vscode-xml/blob/master/docs/Extensions.md)
by commenting out `xml.extension.jars` in your `settings.json`,
and uninstall or disable any VS Code extensions that provide extra LemMinX features.

1. Launch vscode-xml in development mode, and double check that the binary server is running by checking the server logging (Output > XML Support)

# Semantic Crosswalk Editor

Editor to improve Data Interoperability by bridging Standards using human-centric Semantics.

## Development Installation

### Installation Prerequisites:

  * latest [Visual Studio Code](https://code.visualstudio.com/)
  * [Node.js](https://nodejs.org/) v4.0.0 or higher
  * [JDK 8+](http://www.oracle.com/technetwork/java/javase/downloads/index.html)
  * [Maven](https://maven.apache.org/)

### Building

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
1. In `vscode-xml/`, build the server by running:

	```bash
	$ npm run build-server
	```
1. To run the extension, open the Debugging tab in VSCode.
1. Select and run 'Launch Extension' at the top left:

    ![ Launch Extension ](./images/launch_extension.png)

	- If VSCode complains about the 'Red Hat Commons' extension is not supported in Restricted Mode:  
	Go to **File > Preferences > Settings**, search for `security.workspace.trust.enabled` and uncheck it.
	- The `npm: watch` command requires the [TypeScript + Webpack Problem Matchers](https://marketplace.visualstudio.com/items?itemName=eamodio.tsl-problem-matcher) extension to be installed.

### Debugging Guides

- [Running and Debugging Your Extension](https://vscode.readthedocs.io/en/latest/extensions/debugging-extensions/)
- [Debugging in Visual Studio Code](https://code.visualstudio.com/docs/editor/debugging)
- [Diagnosing Terminal Issues](https://github.com/microsoft/vscode/wiki/Terminal-Issues#diagnosing-terminal-issues) - Particularly useful if error notifications or the terminal output not providing enough information (such as `The terminal process terminated with exit code: 1`)

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

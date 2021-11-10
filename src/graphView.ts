import * as vscode from "vscode";

export class GraphView implements vscode.WebviewViewProvider {
  constructor(private context: vscode.ExtensionContext) {
    // Provide WebviewPanel (Editor Tab)
    vscode.commands.registerCommand('graphView.start', () => {
      // Create and show panel
      const panel = vscode.window.createWebviewPanel(
        'graphView',
        'Graph View',
        vscode.ViewColumn.One,
        this.webViewOptions
      );

      // Set custom icon for the Editor Tab
      panel.iconPath = {
        light: vscode.Uri.joinPath(this._extensionUri, "icons", "project-diagram-solid-blue.svg"),
        dark: vscode.Uri.joinPath(this._extensionUri, "icons", "project-diagram-solid-blue.svg")
      }

      // And set its HTML content
      panel.webview.html = this._getHtmlForWebview(panel.webview);
    })
  }

  // Provide WebviewView (Sidebar Menu)
  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    webviewView.webview.options = this.webViewOptions;
    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
  }

  // Properties and methods below are shared between Webviews
  private _extensionUri = this.context.extensionUri;
  private webViewOptions = {
    // Allow scripts and local resources in the webview
    enableScripts: true,
    localResourceRoots: [this._extensionUri],
  }

  public static readonly viewType = "graphView";

  public _getHtmlForWebview(webview: vscode.Webview) {
    // Get cytoscape script uri from modules
    const cytoscapeUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "node_modules", "cytoscape", "dist", "cytoscape.min.js")
    );
    // Get the local path from main script to run in the webview
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "webview-resources", "graphView.js")
    );

    // Do the same for the stylesheet.
    const styleResetUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "webview-resources", "reset.css")
    );
    const styleVSCodeUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "webview-resources", "vscode.css")
    );
    const styleMainUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "webview-resources", "graphView.css")
    );

    // Use a nonce to only allow a specific script to be run
    const nonce = getNonce();

    return `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <!--
          Use a content security policy to only allow loading images & css from https or from our extension directory,
          and only allow scripts that have a specific nonce.
        -->
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}'; img-src 'self' *;">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <link href="${styleResetUri}" rel="stylesheet">
        <link href="${styleVSCodeUri}" rel="stylesheet">
        <link href="${styleMainUri}" rel="stylesheet">

        <title>Graph View</title>
      </head>
      <body>
        <div id="cy"></div>

        <script nonce="${nonce}" src="${cytoscapeUri}"></script>
        <script nonce="${nonce}" src="${scriptUri}"></script>
      </body>
      </html>`;
  }
}

function getNonce() {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

export class GraphViewSerializer implements vscode.WebviewPanelSerializer {
  constructor(private graphViewProvider: GraphView) {}
  async deserializeWebviewPanel(webviewPanel: vscode.WebviewPanel, state: any) {
    // `state` is the state persisted using `setState` inside the webview
    console.log(`Restored state: ${JSON.stringify(state)}`);
    // Restore the content of our webview.
    // Make sure we hold on to the `webviewPanel` passed in here and also restore any event listeners we need on it.
    webviewPanel.webview.html = this.graphViewProvider._getHtmlForWebview(webviewPanel.webview);
  }
}

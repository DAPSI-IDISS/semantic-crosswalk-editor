import * as vscode from "vscode";

export class ExperimentalView implements vscode.WebviewViewProvider {
  public static readonly viewType = "experimentalView";

  private _view?: vscode.WebviewView;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,

      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage((data) => {
      switch (data.type) {
        case "snippetSelected": {
          vscode.window.activeTextEditor?.insertSnippet(
            new vscode.SnippetString(
              `
<semantic id="BG-1" level="1" card="0..n" bt="${data.value}" desc="Add a description for this subject...">
  <xml path="null" type="ELEMENT" card="0..n"/>
</semantic>`
            )
          );
          break;
        }
      }
    });
  }

  public addSnippet() {
    if (this._view) {
      this._view.show?.(true); // `show` is not implemented in 1.49 but is for 1.50 insiders
      this._view.webview.postMessage({ type: "experimentalView.addSnippet" });
    }
  }

  public clearSnippets() {
    if (this._view) {
      this._view.webview.postMessage({ type: "experimentalView.clearSnippets" });
    }
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    // Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "webview-resources", "experimentalView.js")
    );

    // Do the same for the stylesheet.
    const styleResetUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "webview-resources", "reset.css")
    );
    const styleVSCodeUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "webview-resources", "vscode.css")
    );
    const styleMainUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "webview-resources", "experimentalView.css")
    );

    // And images.
    const xmlLogoUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "webview-resources", "xml-logo-alt.png")
    );

    // Use a nonce to only allow a specific script to be run.
    const nonce = getNonce();

    return `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">

        <!--
          Use a content security policy to only allow loading images from https or from our extension directory,
          and only allow scripts that have a specific nonce.
        -->
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}'; img-src 'self' *;">

        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <link href="${styleResetUri}" rel="stylesheet">
        <link href="${styleVSCodeUri}" rel="stylesheet">
        <link href="${styleMainUri}" rel="stylesheet">

        <title>Custom Web View</title>
      </head>
      <body>
        <div style="width: 100%; text-align: center; display: inline-block; margin-bottom: 20px; border: 1px dashed; border-color: #666; border-radius: 10px; padding: 15px;">
          <img src="${xmlLogoUri}" width="70" />
          <p>
            <small>Custom Web-View Renderer injected to the Side Bar</small><br>
            <small>(This area could be used as Dropzone target)</small>
          </p>
        </div>

        <ul class="snippet-list">
        </ul>

        <button class="add-snippet-button">Add XML Binding</button>

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

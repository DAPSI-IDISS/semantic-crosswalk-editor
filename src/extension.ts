/**
 *  Copyright (c) 2021 DAPSI IDISS and others.
 *  All rights reserved. This program and the accompanying materials
 *  are made available under the terms of the MIT License
 */

import * as vscode from 'vscode'; // TODO: Fix imports to only require the ones we use

import { ExperimentalView } from './experimentalView';
import { SemanticView } from './semanticView';
import { XMLView } from './xmlView';

let idissStatusBarItem: vscode.StatusBarItem;
let semanticView: SemanticView;
let decorationProvider: DecorationProvider;
let decorationProviderDisposable: vscode.Disposable;

export async function activate(context: vscode.ExtensionContext): Promise<void> {
  semanticView = new SemanticView(context);
  new XMLView(context);

  // Register decoration
  decorationProvider = new DecorationProvider();
  decorationProviderDisposable = vscode.window.registerFileDecorationProvider(decorationProvider);

  const experimentalViewProvider = new ExperimentalView(context.extensionUri);

  // Part below should be probably moved to registerCommands.ts
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(ExperimentalView.viewType, experimentalViewProvider));

  context.subscriptions.push(
    vscode.commands.registerCommand('experimentalView.addSnippet', () => {
      experimentalViewProvider.addSnippet();
    }));

  context.subscriptions.push(
    vscode.commands.registerCommand('experimentalView.clearSnippets', () => {
      experimentalViewProvider.clearSnippets();
    }));

  context.subscriptions.push(
    vscode.languages.registerDocumentSymbolProvider(
      {scheme: "file", language: "xml"},
      new SyntaxBindingDocumentSymbolProvider())
  );

  // Register a command that is invoked when the status bar item is selected
  const statusMessageCommand = 'idiss.showSelectionCount';
  context.subscriptions.push(vscode.commands.registerCommand(statusMessageCommand, () => {
    const semanticsCount = getNumberFromSemanticsAttribute(vscode.window.activeTextEditor, 'semantic-nodes');
    const xmlCount = getNumberFromSemanticsAttribute(vscode.window.activeTextEditor, 'syntax-nodes');
    vscode.window.showInformationMessage(`${semanticsCount} Semantic(s) found, ${xmlCount} XML Bindings(s) found`);
  }));

  // Create a new status bar item that we can now manage
  idissStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  idissStatusBarItem.command = statusMessageCommand;
  context.subscriptions.push(idissStatusBarItem);

  // Register some listener that make sure the status bar item is always up-to-date
  context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(updateStatusBarItem));
  context.subscriptions.push(vscode.window.onDidChangeTextEditorSelection(updateStatusBarItem));

  // Update status bar item once at start
  updateStatusBarItem();

  // Register listener to update decorators
  context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(updateDecorationProvider));
}

class SyntaxBindingDocumentSymbolProvider implements vscode.DocumentSymbolProvider {
  public provideDocumentSymbols(
    document: vscode.TextDocument,
    token: vscode.CancellationToken): Promise<vscode.DocumentSymbol[]> {
    return new Promise((resolve, reject) => {
      let symbols: vscode.DocumentSymbol[] = [];
      for (let i = 0; i < document.lineCount; i++) {
        const line = document.lineAt(i);
        if (line.text.includes("/rsm:")) {
          // Some hacky JS slice'n'dice way with hardcoded values/offsets ... should be replaced with some regexp
          let name = line.text.slice(line.text.lastIndexOf('/', line.text.lastIndexOf('/') - 1) + 1, line.text.lastIndexOf('/'));
            name = name.slice(0, name.indexOf('"'));
          let colPosition = line.text.indexOf('"', line.text.indexOf('"') + 1) + 7 - name.length;
          let symbol = new vscode.DocumentSymbol(
            name, `Syntax Binding [Ln ${i + 1}, Col ${colPosition}]`,
            vscode.SymbolKind.Function,
            line.range, line.range)
          symbols.push(symbol)
        }
      }
      resolve(symbols);
    });
  }
}

const updateStatusBarItem = (): void => {
  const semanticsCount = getNumberFromSemanticsAttribute(vscode.window.activeTextEditor, 'semantic-nodes');
  const xmlCount = getNumberFromSemanticsAttribute(vscode.window.activeTextEditor, 'syntax-nodes');
  if (semanticsCount > 0) {
    idissStatusBarItem.text = `$(combine) ${semanticsCount} Semantic(s) found, ${xmlCount} XML Bindings(s) found`;
    idissStatusBarItem.show();
  } else {
    idissStatusBarItem.hide();
  }
  // For now, update TreeView title & description at the same time (update "fake badge" via description)
  vscode.commands.executeCommand('semanticView.changeTitle', {title: 'Semantic View', description: `(${semanticsCount})`});
  vscode.commands.executeCommand('xmlView.changeTitle', {title: 'XML View', description: `(${xmlCount})`});
}

const getNumberFromSemanticsAttribute = (editor: vscode.TextEditor | undefined, attributeName: string): number => {
  let number = 0;
  if (editor) {
    let line: vscode.TextLine;
    for (let i = 0; i < editor.document.lineCount; i++) {
      line = editor.document.lineAt(i);
      if (line.text.includes(attributeName)) {
        const regex = new RegExp(`${attributeName}\=\"([A-Za-z0-9 _]*)\"`);
        number = parseInt(regex.exec(line.text)[1], 10);
        break;
      }
    }
  }

  return number;
}

const getNumberOfSearchItemOccurrence = (editor: vscode.TextEditor | undefined, searchItem: string): number => {
  let matches = 0;
  if (editor) {
    const escapedSearchItem = searchItem.includes('&nodePath=') ? searchItem.split('&nodePath=')[0] : searchItem;
    const query = new RegExp(escapedSearchItem, 'g');
    matches = (editor.document.getText().match(query) || []).length;
  }

  return matches;
}

// Git-like badges (badge API?) seems to be not exposed yet - https://github.com/Microsoft/vscode/issues/62783 (Workaround: Showing a number in the Tree View Title or Description per view, and via DecorationProvider per node is possible)
// Following is just a workaround sample to add a "fake badge" to Tree View node labels, pass counts retrieved from here to the node's tooltip and colorize some items
class DecorationProvider implements vscode.FileDecorationProvider {
  public _onDidChangeDecorations = new vscode.EventEmitter<vscode.Uri | vscode.Uri[]>();
  onDidChangeFileDecorations?: vscode.Event<vscode.Uri | vscode.Uri[]> = this._onDidChangeDecorations.event;

  public collectedDecoratorUris: string[] = [];

  public provideDecoratorPerScheme = (uri: vscode.Uri, color?: vscode.ThemeColor) => {
    // collect URI as string that we want to update again
    if (this.collectedDecoratorUris.indexOf(uri.toString()) === -1) {
      this.collectedDecoratorUris.push(uri.toString());
    }
    const count = getNumberOfSearchItemOccurrence(vscode.window.activeTextEditor, uri.path);
    return {
      badge: `${count > 99 ? '∞' : count}`, // Seems to be limited to a string length of 2 ... alternatives could be 'GT' or '>' = Greater Than, '‰' per mile (per thousand?) '∞' infinite (of course not the correct meaning but 99+ can be infinite)
      // See ThemeColors used in provideFileDecoration below - Samples: debugTokenExpression.boolean = semantic blue ... debugTokenExpression.string = path value red ... gitDecoration.ignoredResourceForeground = light grey
      // couldn't figure out the "real" color definition used for the Syntax Highlighting yet
      color,
      tooltip: `${count} result(s) in current file`,
    };
  }
  provideFileDecoration(uri: vscode.Uri, token: vscode.CancellationToken): vscode.ProviderResult<vscode.FileDecoration> {
    // Apply different decorators per view "uri.scheme"
    if(uri.scheme === 'semanticView') {
      // TODO: make use of uri.query / uri.fragment and a parser integration to efficiently use additonal uri data (e.g. 'nodePath') and keep the uri.path clean
      let nodePathUri = uri.path.includes('&nodePath=') ? uri.path.split('&nodePath=')[1] : undefined;
      if (semanticView.unusedSemantics.includes(nodePathUri)) {
        return this.provideDecoratorPerScheme(uri, new vscode.ThemeColor('debugTokenExpression.boolean'));
      }
      if (nodePathUri && !semanticView.unusedSemantics.find(node => node === nodePathUri)) {
        return this.provideDecoratorPerScheme(uri, new vscode.ThemeColor('gitDecoration.ignoredResourceForeground'));
      }
      return this.provideDecoratorPerScheme(uri);
    }
    if(uri.scheme === 'xmlView') {
      return this.provideDecoratorPerScheme(uri, new vscode.ThemeColor('debugTokenExpression.string'));
    }
  }
}

let timeout;

const updateDecorationProvider = (changeEvent): void => {
  if (changeEvent.document.languageId === 'xml') {
    // use a threshold for update trigger
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      // TODO: find a better way to handle the dispose to avoid flickering of the decorators (due to resetDecorationProvider)...
      // for now just discard everything after collecting 250 items and recreate the DecorationProvider to avoid getting out of sync and free resources
      if (decorationProvider.collectedDecoratorUris.length > 250) {
        resetDecorationProvider();
      } else {
        // map URI strings back to fire update per vscode.Uri
        decorationProvider._onDidChangeDecorations.fire(decorationProvider.collectedDecoratorUris.map(uri => vscode.Uri.parse(uri)));
      }
    }, 500); // keep timeout >= semanticView timeout in onDidChangeTextDocument, otherwise decorator still has the old semanticView.unusedSemantics state
  }
}

const resetDecorationProvider = (): void => {
  decorationProviderDisposable.dispose();
  decorationProvider = new DecorationProvider();
  decorationProviderDisposable = vscode.window.registerFileDecorationProvider(decorationProvider);
}

import * as vscode from 'vscode';
import * as json from 'jsonc-parser';
import * as xmlData from './../sample-data/xmlData.json';
import * as xmlTestData from './../sample-data/xmlTestData.json';

const idissConfig = vscode.workspace.getConfiguration('idiss');

export class XMLView implements vscode.TreeDataProvider<number> {
  private _onDidChangeTreeData: vscode.EventEmitter<number | undefined> = new vscode.EventEmitter<number | undefined>();
  readonly onDidChangeTreeData: vscode.Event<number | undefined> = this._onDidChangeTreeData.event;
  private treeData = idissConfig.get('useReducedTestData') ? xmlTestData : xmlData;
  private tree: json.Node;
  private text: string;
  private editor: vscode.TextEditor;
  private document: vscode.TextDocument;

  constructor(private context: vscode.ExtensionContext) {
    // Add sample tree data
    this.parseTree();

    const view = vscode.window.createTreeView('xmlView', { treeDataProvider: this, showCollapseAll: true, canSelectMany: true });
    context.subscriptions.push(view);
    vscode.commands.registerCommand('xmlView.reveal', async () => {
      const key = await vscode.window.showInputBox({ placeHolder: 'Type the Node Path of the XML item to reveal' });
      if (key) {
        view.reveal(this.getElementOffsetByPath(key), { focus: true, select: false, expand: true });
      }
    });
    vscode.commands.registerCommand('xmlView.changeTitle', async (args) => {
      if (args.title && args.description) {
        view.title = args.title;
        view.description = args.description;
      } else {
        const title = await vscode.window.showInputBox({ prompt: 'Type the new title for the XML View', placeHolder: view.title });
        if (title) {
          view.title = title;
        }
      }
    });
    // probably better practice than 'search.action.openNewEditor' to allow quickly jumping to the lines in the current file
    // FindInFilesCommand details: https://github.com/microsoft/vscode/blob/17de08a829e56657e44213a70cf69d18f06e74a5/src/vs/workbench/contrib/search/browser/searchActions.ts#L160-L188
    vscode.commands.registerCommand('xmlView.searchEntry', (offset: number) => {
      vscode.commands.executeCommand('search.action.openNewEditor', {query: this.getLabel(this.getValueNode(offset)), isCaseSensitive: true});
    });
    vscode.commands.registerCommand('xmlView.searchEntryInline', (offset: number) => {
      vscode.commands.executeCommand('workbench.action.findInFiles', {query: this.getLabel(this.getValueNode(offset)), isCaseSensitive: true});
    });
    // Adds snippet based on Node Path
    vscode.commands.registerCommand('xmlView.addEntry', (offset: number) => {
      this.createXMLSnippet(offset);
    });
  }

  // Tree data provider

  public getChildren(offset?: number): Thenable<number[]> {
    if (offset) {
      const path = json.getLocation(this.text, offset).path;
      const node = json.findNodeAtLocation(this.tree, path);
      return Promise.resolve(this.getChildrenOffsets(node));
    } else {
      return Promise.resolve(this.tree ? this.getChildrenOffsets(this.tree) : []);
    }
  }

  public getTreeItem(offset: number): vscode.TreeItem {
    const valueNode = this.getValueNode(offset);
    if (valueNode) {
      const treeItem: vscode.TreeItem = new vscode.TreeItem(this.getLabel(valueNode));
      const hasChildren = valueNode.type === 'object' || valueNode.type === 'array' ? valueNode.children.length ? true : false : false;
      const defaultCollapsibleState = idissConfig.get('expandTreeViewsOnInit') ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.Collapsed;
      // second defaultCollapsibleState can be used to differ for array types
      treeItem.collapsibleState = hasChildren ? valueNode.type === 'object' ? defaultCollapsibleState : defaultCollapsibleState : vscode.TreeItemCollapsibleState.None;
      treeItem.iconPath = new vscode.ThemeIcon('symbol-field');
      treeItem.contextValue = valueNode.type;
      treeItem.resourceUri = vscode.Uri.parse(`xmlView:${this.getLabel(valueNode)}`);
      treeItem.tooltip = `Node Path: '${json.getNodePath(valueNode).join('/')}'`;
      treeItem.command = {
        command: undefined, // disable collapsible on label click
        title: '',
      };

      return treeItem;
    }
    return undefined;
  }

  // required to allow TreeView.reveal
  public getParent(offset?: number): number {
    return 0;
  }

  // ----------------------------------------
  // Helper methods
  // ----------------------------------------

  private parseTree(): void {
    this.text = JSON.stringify(this.treeData).toString();
    this.tree = json.parseTree(this.text);
  }

  private getChildrenOffsets(node: json.Node): number[] {
    const offsets: number[] = [];
    for (const child of node.children) {
      const childPath = json.getLocation(this.text, child.offset).path;
      const childNode = json.findNodeAtLocation(this.tree, childPath);
      if (childNode) {
        offsets.push(childNode.offset);
      }
    }
    return offsets;
  }

  private getLabel(node: json.Node): string {
    if (node.parent.type === 'array') {
      const prefix = node.parent.children.indexOf(node).toString();
      if (node.type === 'object' || node.type === 'array') {
        return prefix;
      }
      return prefix + ':' + node.value.toString();
    } else {
      const property = node.parent.children[0].value.toString();
      if (node.type === 'array' || node.type === 'object') {
        return property;
      }
      const value = node.value;

      return `${property}: ${value}`;
    }
  }

  private getValueNode(offset: number): json.Node {
    const path = json.getLocation(this.text, offset).path;
    const valueNode = json.findNodeAtLocation(this.tree, path);

    return valueNode;
  }

  private getElementOffsetByPath(path: string): number {
    // remove preceding slash
    const pathString = (path.length && path[0] === '/') ? path.slice(1) : path;
    // split path to a sequence of strings (representing an object property) or converted numbers (for array indices)
    const nodePath: json.JSONPath = pathString.split('/').map(str => this.isNumeric(str) ? Number(str) : str);
    const nodeElement = json.findNodeAtLocation(this.tree, nodePath);

    return nodeElement.offset;
  }

  private isNumeric = (num: string) => {
    return !isNaN(num as unknown as number)
  }

  private isSemanticClosingLine = (textLine: string): boolean => {
    // TODO: self-closing multi-line semantic tag is currently ignored
    return textLine.includes('</semantic>') || textLine.includes('<semantic ') && textLine.includes('/>');
  }

  private isSemanticsRootLine = (textLine: string): boolean => {
    return (textLine.includes('<semantics ') || textLine.includes('xmlns') || textLine.includes('xmlns:xsi') || textLine.includes('xsi:schemaLocation')) && textLine.includes('>');
  }

  private isOutOfSemanticScope = (textLine: string): boolean => {
    // TODO: would be more accurate to check if we are really in the range of <semantic>...</semantic> elements
    return this.isSemanticsRootLine(textLine) || textLine.includes('<?xml');
  }

  private isPlaceHolderLine = (textLine: string): boolean => {
    return textLine.includes('<!-- [Select XML]');
  }

  private getTabsCount = (textLine: string): number => {
    let count = 0;
    let index = 0;
    while (textLine.charAt(index++) === "\t") {
      count++;
    }
    return count;
  }

  private createXMLSnippet(offset: number): void {
    const snippet = new vscode.SnippetString();
    const nodeValue = this.getValueNode(offset);
    const label = this.getLabel(nodeValue);
    // if label starts with '@' the type is 'ATTRIBUTE', otherwise 'ELEMENT'
    const xmlType = (label.length && label[0] === '@') ? 'ATTRIBUTE' : 'ELEMENT';

    // get current document
    this.editor = vscode.window.activeTextEditor;
    this.document = this.editor.document;

    // get current cursor position
    const position = this.editor.selection.active;
    // get current line
    let line = this.document.lineAt(position);
    // variable lines/positions
    let nextClosingTagLine: number;
    let nextClosingTagEndPosition: number;

    // get line/end position of the next semantic closing tag and go 1 line back as we always append to the end of xml list
    for (let i = position.line; i < this.document.lineCount; i++) {
      line = this.document.lineAt(i);
      if (this.isSemanticClosingLine(line.text)) {
        line = this.document.lineAt(i-1);
        nextClosingTagLine = i-1;
        nextClosingTagEndPosition = line.range.end.character;
        break;
      }
      if (this.isOutOfSemanticScope(line.text)) {
        break;
      }
    }

    if (nextClosingTagLine) {
      // TODO: open semantic element if its self-closing and append closing tag after xml
      snippet.appendText(`${this.isPlaceHolderLine(line.text) ? '' : '\n'}<xml path="/${json.getNodePath(nodeValue).join('/')}" type="${xmlType}"/>`);

      // set cursor and insert snippet, select whole line (exept tabs) to replace if its a placeholder
      const anchorPosition = position.with(nextClosingTagLine, this.isPlaceHolderLine(line.text) ? this.getTabsCount(line.text) : nextClosingTagEndPosition);
      const targetPosition = position.with(nextClosingTagLine, nextClosingTagEndPosition);
      const targetSelection = new vscode.Selection(anchorPosition, targetPosition);

      this.editor.selection = targetSelection;
      this.editor.insertSnippet(snippet);
    } else {
      vscode.window.showErrorMessage(`No semantic element selected.`)
    }
  }
}

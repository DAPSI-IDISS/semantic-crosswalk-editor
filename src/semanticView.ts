import * as vscode from 'vscode';
import * as json from 'jsonc-parser';
import * as semanticData from './../sample-data/semanticData.json';
import * as semanticTestData from './../sample-data/semanticTestData.json';

const idissConfig = vscode.workspace.getConfiguration('idiss');

export class SemanticView implements vscode.TreeDataProvider<number> {
  private _onDidChangeTreeData: vscode.EventEmitter<number | undefined | void> = new vscode.EventEmitter<number | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<number | undefined | void> = this._onDidChangeTreeData.event;
  private treeData = idissConfig.get('useReducedTestData') ? semanticTestData : semanticData;
  private tree: json.Node;
  private text: string;
  private editor: vscode.TextEditor;
  private document: vscode.TextDocument;
  public unusedSemantics = [];

  constructor(private context: vscode.ExtensionContext) {
    let timeout: NodeJS.Timeout = undefined;
    // Add sample tree data
    this.parseTree();
    // update once at TreeView init to get "enablement" of unusedSemantics
    this.unusedSemantics = this.getUnusedSemantics();
    vscode.commands.executeCommand('setContext', 'unusedSemantics', this.unusedSemantics);

    const view = vscode.window.createTreeView('semanticView', { treeDataProvider: this, showCollapseAll: true, canSelectMany: true });
    context.subscriptions.push(view);

    // register commands
    vscode.commands.registerCommand('semanticView.reveal', async () => {
      const key = await vscode.window.showInputBox({ placeHolder: 'Type the Node Path of the Semantic item to reveal' });
      if (key) {
        view.reveal(this.getElementOffsetByPath(key), { focus: true, select: false, expand: true });
      }
    });
    vscode.commands.registerCommand('semanticView.changeTitle', async (args) => {
      if (args.title && args.description) {
        view.title = args.title;
        view.description = args.description;
      } else {
        const title = await vscode.window.showInputBox({ prompt: 'Type the new title for the Semantic View', placeHolder: view.title });
        if (title) {
          view.title = title;
        }
      }
    });
    vscode.commands.registerCommand('semanticView.searchEntry', (offset: number) => {
      const valueNode = this.getValueNode(offset);
      vscode.commands.executeCommand('search.action.openNewEditor', {query: this.isSemanticNode(valueNode) ? this.getSemanticAttributeValue(valueNode, 'bt') : this.getUriValue(valueNode), isCaseSensitive: true});
    });
    vscode.commands.registerCommand('semanticView.searchEntryInline', (offset: number) => {
      const valueNode = this.getValueNode(offset);
      vscode.commands.executeCommand('workbench.action.findInFiles', {query: this.isSemanticNode(valueNode) ? this.getSemanticAttributeValue(valueNode, 'bt') : this.getUriValue(valueNode), isCaseSensitive: true});
    });
    // Adds snippet based on Node Path array index and its children (properties)
    vscode.commands.registerCommand('semanticView.addEntry', (offset: number) => {
      this.createSemanticSnippet(offset).then(() => {
        // async update tree view
        const valueNode = this.getValueNode(offset);
        // remove item directly so we don't have to iterate over the whole array.map -> document ids per item
        this.removeItem(this.unusedSemantics, json.getNodePath(valueNode).join('/'));
        vscode.commands.executeCommand('setContext', 'unusedSemantics', this.unusedSemantics).then(() => {
          if (timeout) {
            clearTimeout(timeout);
          }
          this.refresh(offset); // refresh only this TreeItem
        });
      });
    });

    // register workspace event listeners
    vscode.window.onDidChangeActiveTextEditor(changeEvent => {this.updateUnusedSemantics(changeEvent.document, timeout)});
    vscode.workspace.onDidChangeTextDocument(changeEvent => {this.updateUnusedSemantics(changeEvent.document, timeout)});
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
      const treeItemLabel = this.isSemanticNode(valueNode) ? this.getSemanticAttributeValue(valueNode, 'bt') : this.getLabel(valueNode);
      const treeItem: vscode.TreeItem = new vscode.TreeItem(treeItemLabel);
      const hasChildren = valueNode.type === 'object' || valueNode.type === 'array' ? valueNode.children.length ? true : false : false;
      const defaultCollapsibleState = idissConfig.get('expandTreeViewsOnInit') ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.Collapsed;
      // second defaultCollapsibleState can be used to differ for array types
      treeItem.collapsibleState = hasChildren ? valueNode.type === 'object' ? defaultCollapsibleState : defaultCollapsibleState : vscode.TreeItemCollapsibleState.None;
      treeItem.iconPath = this.isSemanticNode(valueNode) ? new vscode.ThemeIcon('symbol-variable') : undefined;
      treeItem.contextValue = this.isSemanticNode(valueNode) ? json.getNodePath(valueNode).join('/') : undefined;
      treeItem.resourceUri = vscode.Uri.parse(`semanticView:${this.isSemanticNode(valueNode) ? `${this.getSemanticAttributeValue(valueNode, 'bt')}&nodePath=${json.getNodePath(valueNode).join('/')}` : this.getUriValue(valueNode)}`);
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

  public refresh(offset?: number): void {
    this._onDidChangeTreeData.fire(offset);
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

  private getSemanticAttributes(node: json.Node): string {
    if (node.parent.type === 'array') {
      const attributes: string[] = [];
      for (const child of node.children) {
        attributes.push(`${child.children[0].value}="${child.children[1].value}"`);
      }
      return attributes.join(' ');
    }
  }

  private getSemanticAttributeValue(node: json.Node, attribute: string): string {
    if (node.parent.type === 'array') {
      return node.children.find(child => child.children[0].value === attribute).children[1].value;
    }
  }

  private getSemanticId(node: json.Node): string {
    if (node.parent.type === 'array') {
      return node.children[0].children[1].value;
    }
  }

  // pass relevant "searchable" values instead of labels to DecorationProvider for the semantic badge counter
  private getUriValue(node: json.Node): string {
    if (node.parent.type === 'array') {
      return;
    } else {
      const property = node.parent.children[0].value.toString();
      if (node.type === 'array' || node.type === 'object') {
        return property;
      }
      const value = node.value;

      return `${property}="${value}"`;
    }
  }

  private isSemanticNode(node: json.Node): boolean {
    return node.parent.type === 'array' && this.getLabel(node.parent) === 'semantics';
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

  private isSemanticOpeningLine = (textLine: string): boolean => {
    return textLine.includes('<semantic ') && textLine.includes('id="');
  }

  private isSemanticsRootLine = (lineNumber: number): boolean => {
    let isSemanticsRootElement = false;
    let textLine = this.document.lineAt(lineNumber).text;
    if (textLine.includes('>') && !textLine.includes('<semantic ') && !textLine.includes('</semantic') && !textLine.includes('<xml ') && !textLine.includes('</xml')) {
      for (let i = lineNumber; i > 0; i--) {
        textLine = this.document.lineAt(i).text;
        if (textLine.includes('<semantics ') || textLine.includes('xmlns') || textLine.includes('xmlns:xsi') || textLine.includes('xsi:schemaLocation') || textLine.includes('syntax-nodes')) {
          isSemanticsRootElement = true;
          break;
        }
      }
    }
    return isSemanticsRootElement;
  }

  private getTabsCount = (textLine: string): number => {
    let count = 0;
    let index = 0;
    while (textLine.charAt(index++) === "\t") {
      count++;
    }
    return count;
  }

  private isRelatedIdGroupLine = (textLine: string, idGroup: string): boolean => {
    return textLine.includes('<semantic ') && textLine.includes(`id="${idGroup}`);
  }

  private getSemanticElementId = (textLine: string): any => {
    const regex = new RegExp('id\=\"([A-Z-0-9]*)\"');
    return regex.exec(textLine)[1];
  }

  private getSemanticIdGroup = (id: string): string => {
    return id.slice(0, 2); // BT, BG
  }

  private getSemanticIdNumber = (id: string): number => {
    return parseInt(id.slice(3), 10);
  }

  private createSemanticSnippet = async (offset: number): Promise<void> => {
    /* TODO: Add treatment for:
    *  - sub ids like BT-30-1 or BT-158-2 (not sorted correctly yet - inserts currently before BT-30 / BT-158)
    *  - no semantic element exists yet (just inserts on current cursor position, should indent correctly)
    *  - self-closing multi-line semantic tag (skips to the next semantic with self-closing single-line or with closing tag)
    */

    const snippet = new vscode.SnippetString();
    const nodeValue = this.getValueNode(offset);
    const idGroup = this.getSemanticIdGroup(this.getSemanticId(nodeValue));
    const idNumber = this.getSemanticIdNumber(this.getSemanticId(nodeValue));
    let rootIndent: string = '';

    // get current document
    this.editor = vscode.window.activeTextEditor;
    this.document = this.editor.document;

    // get current cursor position
    const position = this.editor.selection.active;
    // get current line
    let line = this.document.lineAt(position);
    // variable lines/positions
    let startingPositionLine: number;
    let nextClosingTagLine: number;
    let nextClosingTagEndPosition: number;
    let lastRelatedIdGroupElementLine: number;
    let lastUnrelatedIdGroupElementLine: number;

    // get the line with the next lower id value from the related id group
    // loop reverse from last line, as we can assume it will be most likely added to the end of the list
    for (let i = this.document.lineCount-1; i > 0; i--) {
      line = this.document.lineAt(i);
      // if we insert BT and the id group doesn't exist (exit early as it always appends to the end)
      if (idGroup === 'BT' && lastUnrelatedIdGroupElementLine) {
        startingPositionLine = lastUnrelatedIdGroupElementLine;
        break;
      }
      if (this.isRelatedIdGroupLine(line.text, idGroup)) {
        const elementId = this.getSemanticElementId(line.text);
        if (this.getSemanticIdNumber(elementId) < idNumber) {
          startingPositionLine = i;
          break;
        }
        lastRelatedIdGroupElementLine = i;
      } else if (this.isSemanticOpeningLine(line.text)) {
        lastUnrelatedIdGroupElementLine = i;
      }
    }
    // if we insert BG and the id group doesn't exist (get line after the loop)
    if (!startingPositionLine && !lastRelatedIdGroupElementLine){
      if (idGroup === 'BG' && lastUnrelatedIdGroupElementLine) {
        startingPositionLine = lastUnrelatedIdGroupElementLine-1;
      }
    }
    // if no lower previous id exists
    if (!startingPositionLine && lastRelatedIdGroupElementLine) {
      startingPositionLine = lastRelatedIdGroupElementLine-1;
    }
    // if line is semantics root
    if (startingPositionLine && this.isSemanticsRootLine(startingPositionLine)) {
      rootIndent = this.getTabsCount(this.document.lineAt(startingPositionLine).text) < 1 ? '\t' : '';
      // use line/end position of the semantics root closing tag
      nextClosingTagLine = startingPositionLine;
      nextClosingTagEndPosition = this.document.lineAt(startingPositionLine).range.end.character;
    } else {
      // use current cursor position if no matching element can be retrieved
      startingPositionLine = startingPositionLine ? startingPositionLine : position.line;
      // get line/end position of the next semantic closing tag
      for (let i = startingPositionLine; i < this.document.lineCount; i++) {
        line = this.document.lineAt(i);
        if (this.isSemanticClosingLine(line.text)) {
          nextClosingTagLine = i;
          nextClosingTagEndPosition = line.range.end.character;
          break;
        }
      }
    }

    // self-closing snippet:
    // snippet.appendText(`\n<semantic ${this.getSemanticAttributes(nodeValue)}/>`);

    // multi-line snippet with placeholder (snippet variants could be triggered via context menu, alt+click, or a default insert mode switch via settings):
    snippet.appendText(`\n${rootIndent}<semantic ${this.getSemanticAttributes(nodeValue)}>`);
    snippet.appendText(`\n${rootIndent}\t<!-- [Select XML] Create a binding by adding elements from the XML View -->`);
    snippet.appendText(`\n${rootIndent}</semantic>`);

    // set cursor and insert snippet
    const targetPosition = position.with(nextClosingTagLine, nextClosingTagEndPosition);
    const targetSelection = new vscode.Selection(targetPosition, targetPosition);

    this.editor.selection = targetSelection;
    await this.editor.insertSnippet(snippet);
  }

  // it would make more sense to just collect already used semantics but the "not in" operator is still missing for "when clauses"
  // therefore we have to collect unused ones and check via the "in" operator to control the "enablement" per viewItem
  // see: https://github.com/microsoft/vscode/issues/131819#issuecomment-917228191
  private getUnusedSemantics(): Array<string> {
    const unusedSemantics = this.getSemanticsPathList();
    // get current document
    this.editor = vscode.window.activeTextEditor;
    this.document = this.editor?.document;

    // only iterate over the content if editor has a document and it's an XML file
    if (this.document && this.document.languageId === 'xml') {
      let line: vscode.TextLine;

      for (let i = 0; i < this.document.lineCount; i++) {
        line = this.document.lineAt(i);
        if (this.isSemanticOpeningLine(line.text)) {
          for (const semanticPath of unusedSemantics) {
            if (this.getSemanticElementId(line.text) === this.getSemanticAttributeValue(this.getValueNode(this.getElementOffsetByPath(semanticPath)), 'id')) {
              this.removeItem(unusedSemantics, semanticPath);
              break;
            }
          }
        }
      }
    }

    return unusedSemantics;
  }

  public updateUnusedSemantics(document: vscode.TextDocument, timeout: NodeJS.Timeout) {
    if (document.languageId === 'xml') {
      // use a threshold for update trigger
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => {
        // async update tree view (only update if unusedSemantics changed)
        let changedUnusedSemantics = this.getUnusedSemantics();
        if (this.unusedSemantics.toString() !== changedUnusedSemantics.toString()) {
          this.unusedSemantics = changedUnusedSemantics;
          vscode.commands.executeCommand('setContext', 'unusedSemantics', this.unusedSemantics).then(() => {
            this.refresh(0); // refresh the whole Tree - TODO: refresh only the changed semantics here
          });
        }
      }, 500);
    }
  }

  private getSemanticsPathList(): Array<string> {
    // TODO: index values shouldn't be hardcoded here
    return this.tree.children[3].children[1].children.map(child => {
      return json.getNodePath(child).join('/');
    });
  }

  private removeItem<T>(arr: Array<T>, value: T): Array<T> {
    const index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }
}

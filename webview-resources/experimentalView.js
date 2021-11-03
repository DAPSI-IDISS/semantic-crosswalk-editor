// @ts-check

// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
  // @ts-ignore
  const vscode = acquireVsCodeApi();

  const oldState = vscode.getState() || { snippets: [] };

  /** @type {Array<{ value: string }>} */
  let snippets = oldState.snippets || [];

  updateSnippetList(snippets);

  document.querySelector('.add-snippet-button').addEventListener('click', () => {
    addSnippet();
  });

  // Handle messages sent from the extension to the webview
  window.addEventListener('message', event => {
    const message = event.data; // The json data that the extension sent
    switch (message.type) {
      case 'experimentalView.addSnippet':
        {
          addSnippet();
          break;
        }
      case 'experimentalView.clearSnippets':
        {
          snippets = [];
          updateSnippetList(snippets);
          break;
        }
    }
  });

  /**
   * @param {Array<{ value: string }>} snippets
   */
  function updateSnippetList(snippets) {
    const ul = document.querySelector('.snippet-list');
    ul.textContent = '';
    for (const snippet of snippets) {
      const li = document.createElement('li');
      li.className = 'snippet-entry';

      const snippetPreview = document.createElement('div');
      snippetPreview.className = 'snippet-preview';
      // snippetPreview.style.backgroundColor = `#${snippet.value}`;
      snippetPreview.addEventListener('click', () => {
          onSnippetClicked(snippet.value);
      });
      li.appendChild(snippetPreview);

      const input = document.createElement('input');
      input.className = 'snippet-input';
      input.type = 'text';
      input.value = snippet.value;
      input.addEventListener('change', (e) => {
        // @ts-ignore
        const value = e.target.value;
        if (!value) {
          // Treat empty value as delete
          snippets.splice(snippets.indexOf(snippet), 1);
        } else {
          snippet.value = value;
        }
        updateSnippetList(snippets);
      });
      li.appendChild(input);

      ul.appendChild(li);
    }

    // Update the saved state
    vscode.setState({ snippets: snippets });
  }

  /** 
   * @param {string} snippet 
   */
  function onSnippetClicked(snippet) {
    vscode.postMessage({ type: 'snippetSelected', value: snippet });
  }

  /**
   * @returns string
   */
  function getRandomSnippetData() {
    const snippets = [
      'SELLER POSTAL ADDRESS',
      'SELLER CONTACT',
      'BUYER POSTAL ADDRESS',
      'DOCUMENT LEVEL CHARGES',
      'PAYMENT INSTRUCTIONS',
      'ADDITIONAL SUPPORTING DOCUMENTS',
      'DELIVERY OR INVOICE PERIOD',
      'DELIVER TO ADDRESS',
      'LINE VAT INFORMATION',
      'CREDIT TRANSFER',
      'SELLER TAX REPRESENTATIVE PARTY'
    ];

    return snippets[Math.floor(Math.random() * snippets.length)];
  }

  function addSnippet() {
    snippets.push({ value: getRandomSnippetData() });
    updateSnippetList(snippets);
  }
}());

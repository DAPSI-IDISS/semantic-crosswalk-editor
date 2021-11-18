// @ts-check
// TODO: Try to implement a pre-build/watch (transpiler) script to be run before the actual watcher/build
// to empower such Webview specific js scripts with full TypeScript support, after the prototype phase.
// For now we just go with the js solution to speed up the initial development,
// inherited types (e.g. for cytoscape) can still be checked via ts-check...

// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
  // @ts-ignore
  const vscode = acquireVsCodeApi();

  /*
  const elementsData = [ // Sample for a minimal element setup of the graph, for complete notation see: https://js.cytoscape.org/#notation/elements-json
    // Nodes
    {
      data: { id: 'a' }
    },
    {
      data: { id: 'b' }
    },
    {
      data: { id: 'c' }
    },
    {
      data: { id: 'b-0' }
    },
    {
      data: { id: 'b-1' }
    },
    {
      data: { id: 'c-0' }
    },
    {
      data: { id: 'c-1' }
    },
    // Edges
    {
      data: { id: 'ab', source: 'a', target: 'b' }
    },
    {
      data: { id: 'ac', source: 'a', target: 'c' }
    },
    {
      data: { id: 'bb-0', source: 'b', target: 'b-0' }
    },
    {
      data: { id: 'bb-1', source: 'b', target: 'b-1' }
    },
    {
      data: { id: 'cc-0', source: 'c', target: 'c-0' }
    },
    {
      data: { id: 'cc-1', source: 'c', target: 'c-1' }
    },
  ];
  */

  // Test to access the nonce within the script
  // let nonce = document.querySelector('script[nonce]').nonce;
  // console.log(nonce)

  const initialState = {
    container: document.getElementById('cy'), // Container to render in
    // @ts-ignore
    elements: elementsData, // External file imported via elementsData in graphView.ts
    style: [ // The stylesheet for the graph, for all options see https://js.cytoscape.org/#style
      {
        selector: 'node',
        style: {
          'width': 80,
          // Sample to get the width based on label length
          // 'width': (node) => { return node.data('sbgnlabel') ? node.data('sbgnlabel').length * 7 : node.data('id').length * 7 },
          'height': 20,
          'background-color': '#222',
          'border-width': 2,
          'border-style': 'solid',
          'border-color': '#999',
          'label': (node) => { return node.data('sbgnlabel') ? node.data('sbgnlabel') : node.data('id') },
          'shape': 'rectangle',
          'color': '#fff',
          'font-size': 12,
          'text-halign': 'center',
          'text-valign': 'center',
          'text-max-width': 80,
          'text-wrap': 'wrap',
          'padding': 10,
          'padding-relative-to': 'width',
          'line-height': 1.2,
        },
      },
      {
        selector: 'edge',
        style: {
          'width': 3,
          'line-color': '#999',
          'target-arrow-color': '#999',
          'target-arrow-shape': 'triangle',
          'curve-style': 'taxi',
          'taxi-direction': 'vertical',
        }
      }
    ],
    layout: { // The initial layout, for built-in layouts/algorithms see: https://js.cytoscape.org/#layouts
      name: 'elk',
      elk: {
        // All options are available at http://www.eclipse.org/elk/reference.html
        // 'org.eclipse.elk.' can be dropped from the Identifier
        // Or look at demo-demo.js for an example.
        // Enums use the name of the enum e.g.
        // 'searchOrder': 'DFS'
        //
        // The main field to set is `algorithm`, which controls which particular
        // layout algorithm is used.
        algorithm: 'layered',
      },

      fit: true, // Whether to fit the viewport to the graph
      padding: 20, // Padding on fit
      spacingFactor: 1.1, // Positive spacing factor, larger => more space between nodes (N.B. n/a if causes overlap)
      boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
      avoidOverlap: true, // Prevents node overlap, may overflow boundingBox if not enough space
      nodeDimensionsIncludeLabels: false, // Excludes the label when calculating node bounding boxes for the layout algorithm
      roots: undefined, // The roots of the trees
      maximal: false, // Whether to shift nodes down their natural BFS depths in order to avoid upwards edges (DAGS only)
      animate: false, // Whether to transition the node positions
      animationDuration: 500, // Duration of animation in ms if enabled
      animationEasing: undefined, // Easing of animation if enabled,
      animateFilter: function ( node, i ){ return true; }, // A function that determines whether the node should be animated.  All nodes animated by default on animate enabled.  Non-animated nodes are positioned immediately when the layout starts
      ready: () => {
        // Import from previous vscode state (just mutate the required objects)
        cy.json({
          elements: graphData.elements,
          pan: graphData.pan,
          zoom: graphData.zoom
        });
      }, // Callback on layoutready
      stop: undefined, // Callback on layoutstop
      transform: function ( node, position ){ return position; }, // Transform a given node position. Useful for changing flow direction in discrete layouts
      priority: function( edge ){ return null; }, // Edges with a non-nil value are skipped when geedy edge cycle breaking is enabled
    },
  };

  // Uncomment to reset state on next init
  // vscode.setState(initialState);

  const oldState = vscode.getState() || initialState;

  let graphData = oldState;
  // @ts-ignore
  const cy = cytoscape(initialState);

  // Re-apply the layout (will be used to trigger layout reset via the UI later)
  // cy.layout(graphData.layout).run();

  // Catch any updates on render change for now
  // TODO: This has to be replaced later with specific events to keep state changes/mutations performant:
  // e.g. only pass specific element property updates on mouse release event of a specific element selector.
  cy.on('render', () => {
    // Export changes back to vscode state
    vscode.setState(cy.json());
  });
}());

// @ts-check

// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
  // @ts-ignore
  const vscode = acquireVsCodeApi();

  const testData = [
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

  const initialState = {
    container: document.getElementById('cy'), // container to render in
    elements: testData,
    style: [ // the stylesheet for the graph, for all options see https://js.cytoscape.org/#style
      {
        selector: 'node',
        style: {
          'width': 80,
          'height': 40,
          'background-color': '#222',
          'border-width': 2,
          'border-style': 'solid',
          'border-color': '#999',
          'label': 'data(id)',
          'shape': 'rectangle',
          'color': '#fff',
          'font-size': 12,
          'text-halign': 'center',
          'text-valign': 'center',
        },
      },
      {
        selector: 'edge',
        style: {
          'width': 3,
          'line-color': '#999',
          'target-arrow-color': '#999',
          'target-arrow-shape': 'triangle',
          'curve-style': 'bezier',
        }
      }
    ],
    layout: { // the initial layout, for built-in layouts/algorithms see: https://js.cytoscape.org/#layouts
      name: 'breadthfirst',

      fit: true, // whether to fit the viewport to the graph
      directed: true, // whether the tree is directed downwards (or edges can point in any direction if false)
      padding: 20, // padding on fit
      circle: false, // put depths in concentric circles if true, put depths top down if false
      grid: false, // whether to create an even grid into which the DAG is placed (circle:false only)
      spacingFactor: 1.2, // positive spacing factor, larger => more space between nodes (N.B. n/a if causes overlap)
      boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
      avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
      nodeDimensionsIncludeLabels: false, // Excludes the label when calculating node bounding boxes for the layout algorithm
      roots: undefined, // the roots of the trees
      maximal: false, // whether to shift nodes down their natural BFS depths in order to avoid upwards edges (DAGS only)
      animate: false, // whether to transition the node positions
      animationDuration: 500, // duration of animation in ms if enabled
      animationEasing: undefined, // easing of animation if enabled,
      animateFilter: function ( node, i ){ return true; }, // a function that determines whether the node should be animated.  All nodes animated by default on animate enabled.  Non-animated nodes are positioned immediately when the layout starts
      ready: undefined, // callback on layoutready
      stop: undefined, // callback on layoutstop
      transform: function ( node, position ){ return position; } // transform a given node position. Useful for changing flow direction in discrete layouts
    }
  };

  // Uncomment to reset state on next init
  // vscode.setState(initialState);

  const oldState = vscode.getState() || initialState;

  let graphData = oldState;
  // @ts-ignore
  const cy = cytoscape(initialState);

  // Import from previous vscode state (just mutate the required objects)
  cy.json({
    elements: graphData.elements,
    pan: graphData.pan,
    zoom: graphData.zoom
  });

  // Re-apply the layout (will be used to trigger layout reset via the UI later)
  // cy.layout(graphData.layout).run();

  // Catch any updates on render change for now,
  // this has to be replaced later with specific events to keep state changes performant
  cy.on('render', () => {
    // Export changes back to vscode state
    vscode.setState(cy.json());
  });
}());

/* eslint-disable no-param-reassign */
import G6 from '@antv/g6';
import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import useThemeState from '../state/useThemeState';
import { useGraphData } from '../use-graph-data';

const body = document.querySelector('body');

const getCssVar = (variable) =>
  getComputedStyle(body).getPropertyValue(`--${variable}`);

const getStyles = (theme) => ({
  theme,
  labelText: getCssVar('color-graph-text'),
  nodeColor: getCssVar('color-graph-node'),
  nodeColorHover: getCssVar('color-graph-node-hover'),
  edgeColor: getCssVar('color-graph-edge'),
});

const prepareNodes = (nodes, styles) => {
  nodes.map((n) => {
    if (!n.syle) n.style = {};
    if (!n.labelCfg) n.labelCfg = {};
    if (!n.labelCfg.style) n.labelCfg.style = {};
    n.labelCfg.style.fill = styles.labelText;
    n.style.fill = styles.nodeColor;
    return n;
  });
  return nodes;
};

const prepareEdges = (edges, styles) => {
  edges.map((e) => {
    e.id = `${e.source}-${e.target}`;
    if (!e.style) e.style = {};
    e.style.color = styles.edgeColor;
    return e;
  });
  return edges;
};

const GraphChart = ({ nodes, edges, navigate, setGraphVisible, styles }) => {
  const graphContainerRef = useRef();
  const [graph, setGraph] = useState(null);

  useEffect(() => {
    if (!graphContainerRef || !graphContainerRef.current) return;

    if (!graph) {
      const nGraph = new G6.Graph({
        container: graphContainerRef.current,
        height: 500,
        width: 900,
        linkCenter: true,
        modes: {
          default: ['drag-canvas', 'zoom-canvas'],
        },
        fitView: false,
        layout: {
          type: 'force',
          preventOverlap: true,
          linkDistance: 50, // Edge length
          nodeStrength: -1000,
          edgeStrength: 0.6,
          nodeSpacing: 20,
          collideStrength: 0.8,
          nodeSize: 30,
          alpha: 0.3,
          alphaDecay: 0.028,
          alphaMin: 0.01,
          forceSimulation: null,
        },
        defaultNode: {
          style: {
            size: 15,
            style: {
              stroke: '#5B8FF9',
            },
          },
          labelCfg: {
            position: 'bottom',
          },
        },
        nodeStateStyles: {
          // The node style when the state 'hover' is true
          hover: {
            fill: styles.nodeColorHover,
          },
        },
        defaultEdge: {
          color: styles.edgeColor,
          style: {
            endArrow: {
              path: G6.Arrow.vee(7, 10, 5),
              fill: styles.edgeColor,
            },
          },
        },
      });
      setGraph(nGraph);

      // Mouse enter a node
      nGraph.on('node:mouseenter', (e) => {
        const nodeItem = e.item; // Get the target item
        nGraph.setItemState(nodeItem, 'hover', true); // Set the state 'hover' of the item to be true
      });

      // Mouse leave a node
      nGraph.on('node:mouseleave', (e) => {
        const nodeItem = e.item; // Get the target item
        nGraph.setItemState(nodeItem, 'hover', false); // Set the state 'hover' of the item to be false
      });

      nGraph.on('node:click', (e) => {
        // eslint-disable-next-line no-underscore-dangle
        navigate(e.item._cfg.model.slug);
        setGraphVisible(false);
      });

      nGraph.on('node:touchstart', (e) => {
        // eslint-disable-next-line no-underscore-dangle
        navigate(e.item._cfg.model.slug);
        setGraphVisible(false);
      });

      nGraph.data({ nodes, edges });
      nGraph.render();
    } else {
      graph.data({ nodes, edges });
      graph.render();
    }
  }, [graph, edges, navigate, nodes, setGraphVisible, styles.edgeColor, styles.nodeColorHover]);

  return <div id="graph-container" ref={graphContainerRef} />;
};

const G6GraphViz = ({ graphVisible, setGraphVisible }) => {
  const [nodesData, linksData, navigate /* , highlight */] = useGraphData();
  const { theme } = useThemeState();
  const cancelButtonRef = useRef();

  const styles = useMemo(() => getStyles(theme), [theme]);

  const nodes = useMemo(
    () => prepareNodes(nodesData, styles),
    [nodesData, styles]
  );
  const edges = useMemo(
    () => prepareEdges(linksData, styles),
    [linksData, styles]
  );

  return createPortal(
    <Transition.Root show={graphVisible} as={Fragment}>
      <Dialog
        as="div"
        static
        open={graphVisible}
        className="fixed z-10 inset-0 overflow-y-auto"
        initialFocus={cancelButtonRef}
        onClose={() => setGraphVisible(false)}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-800 bg-opacity-50 transition-opacity backdrop-filter backdrop-blur-lg" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block align-bottom bg-skin-popover rounded px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6 md:max-w-screen-lg m-auto">
              <div className="flex justify-between text-skin-base">
                <Dialog.Title as="h2" className="text-xl font-semibold">
                  Graph
                </Dialog.Title>
                <button
                  type="button"
                  className="p-2 rounded focus:outline-none focus:ring focus:ring-skin-base"
                  onClick={() => setGraphVisible(false)}
                  ref={cancelButtonRef}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="">
                <GraphChart
                  nodes={nodes}
                  edges={edges}
                  navigate={navigate}
                  setGraphVisible={setGraphVisible}
                  styles={styles}
                />
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>,
    document.body
  );
};

export default G6GraphViz;

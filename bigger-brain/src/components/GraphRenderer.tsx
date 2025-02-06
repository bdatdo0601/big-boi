import React, { useMemo, useRef, useEffect, useState } from 'react';
import { ForceGraph2D } from 'react-force-graph';
import { useRouter } from 'next/navigation';

interface Items {
  title: string;
  path: string;
  backlinks: string[];
}

const GraphRenderer = ({ items, onNodeClick }: { items: Items[], onNodeClick: Function }) => {
  const graphRef = useRef<any>(null);
  const router = useRouter();

  const data = useMemo(() => {
    const nodes = items.map(item => ({ id: item.title, name: item.title, path: item.path, linkCount: 0 }));
    const links = items.flatMap(item => 
      item.backlinks
        .filter(backlinkItem => items.find(node => node.title === backlinkItem))
        .map(backlinkItem => ({ source: item.title, target: backlinkItem }))
    );

    links.forEach(link => {
      const targetNode = nodes.find(node => node.id === link.target);
      if (targetNode) {
        targetNode.linkCount++;
      }
    });

    return { nodes, links };
  }, [items]);

  const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
      setIsMounted(true);
    }, []);
    if (!isMounted || typeof window === 'undefined') {
      return null;
    }
  

  const handleNodeClick = (node: any) => {
    router.push(`/docs/doc/${node.path}`);
    onNodeClick(node);
  };

  return (
    <ForceGraph2D
      ref={graphRef}
      graphData={data}
      nodeLabel="name"
      minZoom={3}
      nodeAutoColorBy="id"
      linkDirectionalArrowLength={7}
      linkDirectionalArrowRelPos={3}
      backgroundColor='#000000'
      nodeRelSize={8}
      linkColor="#ffffff"
      linkDirectionalArrowColor="#ffffff"
      linkAutoColorBy={"source"}
      onNodeClick={handleNodeClick}
      nodeCanvasObject={(node: any, ctx, globalScale) => {
        const label = node.name;
        const fontSize = 12/globalScale;
        ctx.font = `${fontSize}px Sans-Serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'white';

        const baseSize = 5;
        const scaleFactor = 1.5;
        const nodeSize = baseSize + (node.linkCount * scaleFactor);

        ctx.beginPath();
        ctx.arc(node.x!, node.y!, nodeSize, 0, 2 * Math.PI, false);
        ctx.fillStyle = node.color;
        ctx.fill();

        ctx.fillStyle = 'white';
        ctx.fillText(label, node.x!, node.y! + nodeSize + 5);
      }}
    />
  );
};

export default GraphRenderer;

import { visit } from 'unist-util-visit'
import { FlattenFileTree } from '../tree';

export function remarkBacklinks({ files }: { files: FlattenFileTree[] }) {
  return (tree: any) => {
    visit(tree, 'text', (node) => {
      const matches = node.value.match(/\[\[(.*?)\]\]/g)
      if (matches) {
        const newNodes = []
        let lastIndex = 0

        matches.forEach((match: string) => {
          const linkText = match.slice(2, -2)
          const startIndex = node.value.indexOf(match, lastIndex)
          
          if (startIndex > lastIndex) {
            newNodes.push({
              type: 'text',
              value: node.value.slice(lastIndex, startIndex),
            })
          }
          newNodes.push({
            type: 'link',
            url: `/docs/doc/${files.find(file => file.name === linkText)?.path}`,
            children: [{
              type: 'text',
              value: linkText,
            }],
            data: {
              hProperties: {
                className: 'backlink',
              },
            },
          })

          lastIndex = startIndex + match.length
        })

        if (lastIndex < node.value.length) {
          newNodes.push({
            type: 'text',
            value: node.value.slice(lastIndex),
          })
        }

        node.type = 'paragraph'
        node.children = newNodes
        delete node.value
      }
    })
  }
}
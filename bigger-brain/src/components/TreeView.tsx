'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FileTree } from '@/utils/tree'
import { eq } from 'lodash'
import { useState } from 'react'
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'

interface TreeItemProps {
  item: FileTree
  level?: number
  pathPrefix?: string
}

const TreeItem = ({ item, level = 0, pathPrefix = '/docs/doc/' }: TreeItemProps) => {
  const pathname = usePathname()
  const isActive = eq(pathname, encodeURI(`${pathPrefix}${item.path}`));
  const [isOpen, setIsOpen] = useState(true)

  if (item.type === 'directory') {
    return (
      <div className="ml-1">
        <div
          className="font-semibold my-2 flex items-center cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <KeyboardArrowDown sx={{ fontSize: 16 }} /> : <KeyboardArrowRight sx={{ fontSize: 16 }} />}
          <span className="ml-1">{item.name}</span>
        </div>
        {isOpen && (item.children || []).map((child, index) => (
          <TreeItem key={index} item={child} level={level + 1} pathPrefix={pathPrefix} />
        ))}
      </div>
    )
  }

  return (
    <Link
      href={`${pathPrefix}${item.path}`}
      className={`block ml-2 py-1 hover:bg-popover-foreground text-nowrap border-none ${isActive ? 'text-primary font-medium' : ''
        }`}
    >
      <span>{item.name}</span>
    </Link>
  )
}

export default function TreeView({ tree }: { tree: FileTree[] }) {
  return (
    <>
      {tree.map((item, index) => (
        <TreeItem key={index} item={item} />
      ))}
    </>
  )
}
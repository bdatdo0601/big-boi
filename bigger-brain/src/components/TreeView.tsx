'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FileTree } from '@/utils/tree'
import { eq } from 'lodash'
import { useState } from 'react'
import { KeyboardArrowDown, KeyboardArrowRight, Menu } from '@mui/icons-material'
// import component 👇
import Drawer from 'react-modern-drawer'

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
  const [isOpen, setIsOpen] = useState(false)
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState)
  }

  return (
    <>
      <button onClick={toggleDrawer} className='bg-primary rounded-full fixed p-2 top-4 right-4 hover:cursor-pointer'><Menu /></button>
      <Drawer
        open={isOpen}
        direction='right'
        className='min-w-[300px]'
        onClose={toggleDrawer}
      >
        <div className="w-full h-full overflow-y-auto border-r p-4 bg-popover">
          <h5>Dat's Documentation</h5>
          {tree.map((item, index) => (
            <TreeItem key={index} item={item} />
          ))}
        </div>
      </Drawer>
    </>
  )
}
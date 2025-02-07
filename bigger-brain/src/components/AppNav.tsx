'use client'

import { FileTree, FlattenFileTreeWithData } from '@/utils/tree'
import { useEffect, useState } from 'react'
import { Close, Map as MapIcon, Menu } from '@mui/icons-material'
// import component 👇
import Drawer from 'react-modern-drawer'
import TreeView from './TreeView'
import dynamic from 'next/dynamic'
import Search from './Search'
import { useRouter } from 'next/navigation'

const GraphRenderer = dynamic(() => import('./GraphRenderer'), {
  ssr: false,
});

export default function AppNav({ tree, flattenTree, children }: { tree: FileTree[], flattenTree: FlattenFileTreeWithData[], children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter();
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState)
  }

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) {
    return null;
  }

  return (
    <div id="AppNav" className='w-full flex flex-col'>
      <div className='top-0 w-full bg-accent'>
        <div className='flex flex-row flex-wrap justify-between p-4 items-center gap-2'>
          <h1 className='text-2xl font-bold'>Big Brain</h1>
          <div className='flex flex-row gap-2 items-center'>
            <Search items={flattenTree.map(item => ({ name: item.name, content: item.content, path: item.path }))} onResultSelect={(result) => {
              router.push(`/docs/doc/${result.path}`);
            }} />
            <button onClick={toggleDrawer} className='bg-primary rounded-full p-1.5 hover:cursor-pointer'><MapIcon /></button>
          </div>
        </div>
      </div>
      <div className='fixed p-2 top-1 right-4 flex flex-row gap-2'>
      </div>
      <div className='flex flex-wrap gap-2 p-4 items-start'>
        {children}
        <div className="min-sm:fixed min-sm:right-1 max-sm:mx-auto overflow-y-auto border-2 rounded-md p-4 bg-popover min-w-[250px]">
          <h5>Dat's Documentation</h5>
          <TreeView tree={tree} />
        </div>
      </div>

      <Drawer
        open={isOpen}
        direction='top'
        onClose={toggleDrawer}
        className='h-full'
        style={{
          height: '80%',
          maxHeight: '600px',
        }}
      >
        <div className="w-full h-full bg-popover flex flex-col items-center min-sm:p-4 p-2">
          <button className='fixed top-2 left-2 p-2 bg-secondary rounded-full z-50 hover:cursor-pointer' onClick={toggleDrawer}><Close /></button>
          <h2 className='pb-2'>Graph View</h2>
          <div className='overflow-hidden h-full grow w-full border-primary border-1 rounded-md'>
            <GraphRenderer onNodeClick={toggleDrawer} items={flattenTree.map(item => ({ title: item.name, backlinks: item.backlinks, path: item.path }))} />
          </div>
        </div>
      </Drawer>
    </div>
  )
}
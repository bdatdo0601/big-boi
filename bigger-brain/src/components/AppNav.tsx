'use client'

import { FileTree, FlattenFileTreeWithData } from '@/utils/tree'
import { useEffect, useState } from 'react'
import ArrowDropDown from '@mui/icons-material/ArrowDropDown'
import ArrowLeft from '@mui/icons-material/ArrowLeft'
import Close from '@mui/icons-material/Close'
import MapIcon from '@mui/icons-material/Map'
// import component 👇
import Drawer from 'react-modern-drawer'
import TreeView from './TreeView'
import dynamic from 'next/dynamic'
import Search from './Search'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const GraphRenderer = dynamic(() => import('./GraphRenderer'), {
  ssr: false,
});

export default function AppNav({ tree, flattenTree, children }: { tree: FileTree[], flattenTree: FlattenFileTreeWithData[], children: React.ReactNode }) {
  const [isGraphDrawerOpen, setIsGraphDrawerOpen] = useState(false)
  const [isTreeOpen, setIsTreeOpen] = useState(false);
  const router = useRouter();
  const toggleGraphDrawer = () => {
    setIsGraphDrawerOpen((prevState) => !prevState)
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
          <Link href="/docs"><h1 className='text-2xl font-bold'>Big Brain</h1></Link>
          <div className='flex flex-row gap-2 items-center'>
            <Search items={flattenTree.map(item => ({ name: item.name, content: item.content, path: item.path }))} onResultSelect={(result) => {
              router.push(`/docs/doc/${result.path}`);
            }} />
            <button onClick={toggleGraphDrawer} className='bg-primary rounded-full p-1.5 hover:cursor-pointer'><MapIcon /></button>
          </div>
        </div>
      </div>
      <div className='w-full px-1 relative'>
        <div className='min-lg:fixed min-lg:right-2 min-lg:top-24 max-lg:mx-auto max-lg:mt-2 overflow-y-auto border-2 rounded-md p-4 bg-popover min-w-[250px]'>
          <div className='flex flex-row justify-between items-center flex-wrap gap-10'>
            <h5>Document Tree</h5>
            <button onClick={() => { setIsTreeOpen(prevState => !prevState) }} className='bg-primary rounded-full p-1.5 hover:cursor-pointer float-right'>{isTreeOpen ? <ArrowDropDown /> : <ArrowLeft />}</button>
          </div>
          {isTreeOpen && <TreeView tree={tree} />}
        </div>
        {children}
      </div>

      <Drawer
        open={isGraphDrawerOpen}
        direction='top'
        onClose={toggleGraphDrawer}
        className='h-full'
        style={{
          height: '80%',
          maxHeight: '600px',
        }}
      >
        <div className="w-full h-full bg-popover flex flex-col items-center min-sm:p-4 p-2">
          <button className='fixed top-2 left-2 p-2 bg-secondary rounded-full z-50 hover:cursor-pointer' onClick={toggleGraphDrawer}><Close /></button>
          <h2 className='pb-2'>Graph View</h2>
          <div className='overflow-hidden h-full grow w-full border-primary border-1 rounded-md'>
            <GraphRenderer onNodeClick={toggleGraphDrawer} items={flattenTree.map(item => ({ title: item.name, backlinks: item.backlinks, path: item.path }))} />
          </div>
        </div>
      </Drawer>
    </div>
  )
}
'use client'

import { FileTree, FlattenFileTreeWithData } from '@/utils/tree'
import { useEffect, useState } from 'react'
import { Close, Map as MapIcon, Menu } from '@mui/icons-material'
// import component 👇
import Drawer from 'react-modern-drawer'
import TreeView from './TreeView'
import Modal from 'react-modal';
import dynamic from 'next/dynamic'

const GraphRenderer = dynamic(() => import('./GraphRenderer'), {
  ssr: false,
});

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  },
};

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('body');

export default function AppNav({ tree, flattenTree }: { tree: FileTree[], flattenTree: FlattenFileTreeWithData[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false);
  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

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
    <div id="AppNav" className='w-full'>
      <div className='fixed p-2 top-4 right-4 flex flex-col gap-2'>
        <button onClick={toggleDrawer} className='bg-primary rounded-full p-2 hover:cursor-pointer'><Menu /></button>
        <button onClick={toggleModal} className='bg-primary rounded-full p-2 hover:cursor-pointer'><MapIcon /></button>
      </div>
      <Drawer
        open={isOpen}
        direction='right'
        className='min-w-[300px]'
        onClose={toggleDrawer}
      >
        <div className="w-full h-full overflow-y-auto border-r p-4 bg-popover">
          <h5>Dat's Documentation</h5>
          <TreeView tree={tree} />
        </div>
      </Drawer>
      <Modal
        isOpen={modalOpen}
        onAfterOpen={() => { }}
        onRequestClose={toggleModal}
        style={customStyles}
        contentLabel="Graph Modal"
      >
        <div className="max-w-4xl max-h-[800px]">
          <button className='fixed top-2 left-2 p-2 bg-secondary rounded-full z-50 hover:cursor-pointer' onClick={toggleModal}><Close /></button>
          <GraphRenderer onNodeClick={toggleModal} items={flattenTree.map(item => ({ title: item.name, backlinks: item.backlinks, path: item.path }))} />
        </div>
      </Modal>
    </div>
  )
}
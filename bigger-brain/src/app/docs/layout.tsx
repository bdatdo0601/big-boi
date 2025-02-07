import './globals.css'
import { getCachedFileTree, getFlattenFileTreeWithContent } from '@/utils/tree'

//import styles 👇
import 'react-modern-drawer/dist/index.css'
import dynamic from 'next/dynamic'

const AppNav = dynamic(() => import('@/components/AppNav'))

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const tree = await getCachedFileTree();
  const flattenTree = await getFlattenFileTreeWithContent();

  return (
    <html lang="en" className='dark'>
      <head>
        <title>Big Boi Documentation</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@docsearch/css@3" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css" integrity="sha384-Xi8rHCmBmhbuyyhbI88391ZKP2dmfnOl4rT9ZfRI7mLTdk1wblIUnrIq35nqwEvC" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen">
        <AppNav tree={tree} flattenTree={flattenTree} >
          <main className="p-8 w-full flex flex-col gap-2">{children}</main>
        </AppNav>
      </body>
    </html>
  )
}
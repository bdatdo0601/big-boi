import { getMDXContent } from '@/utils/mdx'
import { getFlattenFileTree, getFlattenFileTreeWithContent } from '@/utils/tree'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import dynamic from 'next/dynamic'

const MDXContent = dynamic(() => import('@/components/MDXContent'))
const Backlinks = dynamic(() => import('@/components/Backlinks'))
const References = dynamic(() => import('@/components/References'))

interface PageProps {
  params: Promise<{
    slug?: string[],
    content: MDXRemoteSerializeResult<Record<string, unknown>, Record<string, unknown>>,
    backlinks: string[],
    incomingBacklinks: string[],
    metadata: Record<string, unknown>
  }>
}

export default async function Page({ params }: PageProps) {
  const flattenFiles = await getFlattenFileTreeWithContent();
  const awaitedParams = await params
  const slug = awaitedParams?.slug ? awaitedParams.slug.join('/') : 'index'
  if (slug.split(".").length > 1) {
    return (
      <div className="p-8">
        <h1>Attachments</h1>
      </div>
    )
  }
  const { content, backlinks } = await getMDXContent(slug, flattenFiles);
  return (
    <div className="p-1 break-words hyphens-auto w-full mx-auto">
      <MDXContent source={content} />
      <Backlinks links={flattenFiles.filter(item => backlinks.includes(item.name))} />
      <References links={flattenFiles.filter(item => item.backlinks.some(backlink => decodeURI(slug).includes(backlink)))} />
    </div>
  )
}

export async function generateStaticParams() {
  const flattenFiles = await getFlattenFileTree();
  const staticParams = await Promise.all(flattenFiles.filter(file => file.type === 'file').map(async (file) => {
    return {
      slug: [...file.path.split('/')]
    }
  }))
  return staticParams;
}

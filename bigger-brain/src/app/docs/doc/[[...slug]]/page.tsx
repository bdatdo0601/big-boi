import { getMDXContent, findBacklinks } from '@/utils/mdx'
import { getFlattenFileTree } from '@/utils/tree'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import dynamic from 'next/dynamic'

const MDXContent = dynamic(() => import('@/components/MDXContent'))
const Backlinks = dynamic(() => import('@/components/Backlinks'))

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
  const flattenFiles = await getFlattenFileTree();
  const awaitedParams = await params
  const slug = awaitedParams?.slug ? awaitedParams.slug.join('/') : 'index'
  if (slug.split(".").length > 1) {
    return (
      <div className="p-8">
        <h1>Attachments</h1>
      </div>
    )
  }
  const { content } = await getMDXContent(slug, flattenFiles);
  const incomingBacklinks = await findBacklinks(slug);

  return (
    <div className="p-1 break-words hyphens-auto">
      <MDXContent source={content} />
      <Backlinks links={incomingBacklinks} />
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

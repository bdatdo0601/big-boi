import { getMDXContent, findBacklinks } from '@/utils/mdx'
import MDXContent from '@/components/MDXContent'
import Backlinks from '@/components/Backlinks'
import { getFlattenFileTree } from '@/utils/tree'

interface PageProps {
  params: Promise<{
    slug?: string[]
  }>
}

export default async function Page({ params }: PageProps) {
  const awaitedParams = await params
  const slug = awaitedParams?.slug ? awaitedParams.slug.join('/') : 'index'
  if (slug.split(".").length > 1) {
    return (
      <div className="p-8">
        <h1>Attachments</h1>
      </div>
    )
  }
  const { content } = await getMDXContent(slug);
  const incomingBacklinks = await findBacklinks(slug)

  return (
    <div className="p-8">
      <MDXContent source={content} />
      <Backlinks links={incomingBacklinks} />
    </div>
  )
}

export async function generateStaticParams() {
  const flattenFiles = await getFlattenFileTree();
  const staticParams = flattenFiles.filter(file => file.type === 'file').map((file) => ({
    slug: [...file.path.split('/')],
  }))
  return staticParams;
}

import fs from 'fs/promises'
import path from 'path'
import { glob } from 'glob'
import { getSource } from './mdx'

export interface FileTree {
  type: 'file' | 'directory' | 'attachment'
  name: string
  path: string
  children?: FileTree[]
  attachmentData?: string;
  slug: string[];
}

export interface FlattenFileTree {
  type: 'file' | 'directory' | 'attachment'
  name: string
  path: string
  attachmentData?: string;
  slug: string[];
}

export interface FlattenFileTreeWithData extends FlattenFileTree {
  content: string;
  backlinks: string[];
}

const contentDirectory = path.join(process.cwd(), 'content')

export async function buildFileTree(dir: string = contentDirectory, basePath: string = '', ignoreAttachment: boolean = true): Promise<FileTree[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const tree: FileTree[] = []

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    const relativePath = path.join(basePath, entry.name)

    if (entry.isDirectory()) {
      const children = await buildFileTree(fullPath, relativePath, ignoreAttachment)
      if (children.length > 0) {
        tree.push({
          type: 'directory',
          name: entry.name,
          path: relativePath,
          children,
          slug: relativePath.split('/')
        })
      }
    } else if (entry.name.endsWith('.mdx')) {
      tree.push({
        type: 'file',
        name: entry.name.replace('.mdx', ''),
        path: relativePath.replace('.mdx', ''),
        slug: relativePath.replace('.mdx', '').split('/')
      })
    } else if (!ignoreAttachment) {
      const fileBuffer = await fs.readFile(fullPath)
      tree.push({
        type: 'attachment',
        name: entry.name,
        attachmentData: fileBuffer.toString('base64'),
        path: fullPath,
        slug: fullPath.split('/')
      })
    }
  }

  // Sort directories first, then files, both alphabetically
  return tree.sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === 'directory' ? -1 : 1
    }
    return a.name.localeCompare(b.name)
  })
}

let cachedFileTree: FileTree[] | undefined;

export const getCachedFileTree = async (): Promise<FileTree[]> => {
  if (cachedFileTree) {
    return cachedFileTree
  }
  const fileTree = await buildFileTree(contentDirectory, '', true)
  cachedFileTree = fileTree
  return fileTree
}

export const getFlattenFileTree = async (): Promise<FlattenFileTree[]> => {
  const fileTree = await getCachedFileTree()
  const flattenFileTree: FlattenFileTree[] = []
  const flatten = (tree: FileTree[], parentPath: string) => {
    tree.forEach((item) => {
      const path = `${parentPath}/${item.name}`
      if (item.type === 'directory') {
        flatten(item.children || [], path)
      } else {
        flattenFileTree.push({
          name: item.name,
          path: path.replace(/^\//, ''),
          type: item.type,
          attachmentData: item.attachmentData,
          slug: path.split('/')
        })
      }
    })
  }
  flatten(fileTree, '')
  return flattenFileTree
}

export const getFlattenFileTreeWithContent = async (): Promise<FlattenFileTreeWithData[]> => {
  const flattenFileTree = await getFlattenFileTree()
  const flattenFileTreeWithData: FlattenFileTreeWithData[] = []
  await Promise.all(flattenFileTree.map(async (item) => {
    const content = await getSource(item.path);
    const backlinkMatches = content.match(/\[\[(.*?)\]\]/g)
    const backlinks = backlinkMatches ? backlinkMatches.map(match => match.replace(/\[\[|\]\]/g, '')) : []
    flattenFileTreeWithData.push({
      ...item,
      content: await getSource(item.path),
      backlinks
    })
  }))
  return flattenFileTreeWithData
}

export async function getAllPaths(): Promise<string[]> {
  const files = await glob('**/*.mdx', { cwd: contentDirectory })
  return files.map(file => file.replace('.mdx', ''))
}
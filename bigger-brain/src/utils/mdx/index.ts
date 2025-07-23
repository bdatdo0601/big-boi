import fs from 'fs/promises';
import { glob } from 'glob';
import matter from 'gray-matter';
import { initial } from 'lodash';
import { serialize } from 'next-mdx-remote/serialize';
import path from 'path';
import { FileTree } from '../tree';
import { remarkBacklinks } from './remarkBacklinks';

const contentDirectory = path.join(process.cwd(), 'content');

async function getAttachmentData(fullPath: string) {
  const data = await fs.readFile(fullPath, 'base64');
  return `data:${getMimeType(fullPath)};base64,${data}`;
}

function getMimeType(filePath: string) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.gif':
      return 'image/gif';
    case '.pdf':
      return 'application/pdf';
    case '.svg':
      return 'image/svg+xml';
    case '.txt':
      return 'text/plain';
    default:
      return 'application/octet-stream';
  }
}

export const getSource = async (slug: string) => {
  const extensions = ['.mdx', '.markdown', '.md'];
  let source;

  for (const ext of extensions) {
    const fullPath = path.join(contentDirectory, `${slug}${ext}`);
    try {
      source = await fs.readFile(fullPath, 'utf8');
      return source;
    } catch (error: any) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }

  throw new Error(`No file found for slug: ${slug}`);
};
export async function getMDXContent(slug: string, files: FileTree[]) {
  const decodedSlug = decodeURIComponent(slug);
  const source = await getSource(decodedSlug);
  const { data, content } = matter(source);
  const backlinks = content.match(/\[\[(.*?)\]\]/g) || [];
  const processedBacklinks = backlinks.map(link => link.slice(2, -2));

  const contentWithAttachments = await replaceAttachments(content, initial(decodedSlug.split('/')).join('/'));

  const mdxSource = await serialize(contentWithAttachments, {
    mdxOptions: {
      remarkPlugins: [[remarkBacklinks, { files }]],
    },
  });

  return {
    slug,
    metadata: data,
    content: mdxSource,
    backlinks: processedBacklinks,
  };
}

async function replaceAttachments(content: string, contentPath: string) {
  let updatedContent = content;
  const attachmentRegex = /\"(?:\.{1,2}\/)+[a-zA-Z0-9_/-]+\.[a-zA-Z0-9]+\"/g;
  const matches = content.match(attachmentRegex) || [];
  for (const match of matches) {
    const relativePath = match.replace(/\"/g, '');
    const attachmentPath = path.join(contentDirectory, contentPath, relativePath);
    try {
      if (attachmentPath && !attachmentPath.startsWith('http')) {
        const attachmentData = await getAttachmentData(attachmentPath);
        updatedContent = content.replace(match, `"${attachmentData}"`);
      }
    } catch (error) {
      console.error(`Attachment not found: ${attachmentPath}`, error);
      continue;
    }
  }

  return updatedContent;
}

'use client';

import Link from 'next/link';
import { FlattenFileTree } from '@/utils/tree';

interface BacklinksProps {
  links: FlattenFileTree[];
}

export default function Backlinks({ links }: BacklinksProps) {
  if (!links || links.length === 0) return null;

  return (
    <div className="mt-8 pt-4 rounded-lg border-primary border-1 bg-popover p-4 ">
      <h3 className="mb-4">Backlinks</h3>
      <ul className="space-y-1 pl-2">
        {links.map((link, index) => (
          <li className="list-none" key={index}>
            <Link href={`/docs/doc/${link.path}`} className="inline-flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

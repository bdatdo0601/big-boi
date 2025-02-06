'use client'

import Link from 'next/link'

interface BacklinksProps {
  links: string[]
}

export default function Backlinks({ links }: BacklinksProps) {
  if (!links || links.length === 0) return null

  return (
    <div className="mt-8 pt-4 border-t">
      <h3 className="text-lg font-semibold mb-2">Backlinks</h3>
      <ul className="space-y-1">
        {links.map((link, index) => (
          <li key={index}>
            <Link
              href={`/${link}`}
              className="text-blue-600 hover:underline inline-flex items-center"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
              {link}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
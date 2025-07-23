import { getAllPaths } from '@/utils/tree';

export default async function Home() {
  const paths = await getAllPaths();

  return (
    <div className="p-8 max-w-4xl mx-auto flex flex-col gap-2">
      <h1 className="text-3xl font-bold mb-6">Welcome to the Big Boi Documentation</h1>
      <h5>You can also navigate them as tree structure through the menu drawer</h5>
      <div className="prose max-w-none">
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Available Pages</h2>
          <ul className="space-y-2">
            {paths.map((path: string) => (
              <li key={path}>
                <a href={`docs/doc/${path}`}>{path}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-6">The page you're looking for doesn't exist or has been moved.</p>
        <Link href="/">Return Home</Link>
      </div>
    </div>
  );
}

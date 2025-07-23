'use client';

import NextError from 'next/error';

export default function NotFound() {
  return <NextError statusCode={404} />;
}

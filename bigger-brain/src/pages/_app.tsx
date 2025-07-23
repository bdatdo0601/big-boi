// `pages/_app.js`
import { AppProps } from 'next/app';
import './globals.css';
import { isIframe } from '@/utils';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="p-4 max-w-[1200px] mx-auto">
      <div className="flex justify-end items-end mx-auto pt-4">
        {!isIframe() && (
          <a href="https://datbdo.com/" className="text-muted-foreground">
            {'> Go to Main Site'}
          </a>
        )}
      </div>
      <Component {...pageProps} />
    </div>
  );
}

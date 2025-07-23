import { type ClassValue, clsx } from 'clsx';
import { shuffle } from 'lodash';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: 'accurate' | 'normal';
  } = {}
): string {
  const { decimals = 0, sizeType = 'normal' } = opts;

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const accurateSizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB'];
  if (bytes === 0) return '0 Byte';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / 1024 ** i).toFixed(decimals)} ${
    sizeType === 'accurate' ? (accurateSizes[i] ?? 'Bytes') : (sizes[i] ?? 'Bytes')
  }`;
}

export function composeEventHandlers<E>(
  originalEventHandler?: (event: E) => void,
  ourEventHandler?: (event: E) => void,
  { checkForDefaultPrevented = true } = {}
): (event: E) => void {
  return function handleEvent(event: E) {
    originalEventHandler?.(event);

    if (checkForDefaultPrevented === false || !(event as unknown as Event).defaultPrevented) {
      return ourEventHandler?.(event);
    }
  };
}

export const createFile = async (path: string, name: string, type: string): Promise<File> => {
  const response = await fetch(path);
  const data = await response.blob();
  const metadata = {
    type: type,
  };
  return new File([data], name, metadata);
};

export const downloadUrl = (url: string, fileName: string): void => {
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

export const stringToTextBlob = (text: string, filename: string): File => {
  const blob = new Blob([text], { type: 'text/plain' });
  return new File([blob], filename, { type: 'text/plain' });
};

export const gcd = (a: number, b: number): number => {
  if (!b) {
    return a;
  }
  return gcd(b, a % b);
};

export const isTouchDevice = (): boolean => {
  return (
    !!(
      typeof window !== 'undefined' &&
      ('ontouchstart' in window ||
        ((window as any).DocumentTouch &&
          typeof document !== 'undefined' &&
          document instanceof (window as any).DocumentTouch))
    ) || !!(typeof navigator !== 'undefined' && (navigator.maxTouchPoints || (navigator as any).msMaxTouchPoints))
  );
};

interface MetaData {
  aspectWidth: number;
  aspectHeight: number;
  cols?: number;
}

interface Item {
  metaData: MetaData;
  [key: string]: any;
}
export const formatGridList = (data: Item[], colAmount: number, isWeb: boolean): Item[] => {
  let amount = 0;
  if (data.length <= 0) return [];
  const result = shuffle(data).map(item => {
    let cols = 0;
    if (item.metaData.aspectWidth === item.metaData.aspectHeight) {
      cols = isWeb ? 2 : 1;
    } else if (item.metaData.aspectWidth > item.metaData.aspectHeight) {
      cols = Math.min(item.metaData.aspectWidth, isWeb ? 4 : 1);
    } else {
      cols = Math.min(item.metaData.aspectWidth, isWeb ? 4 : 1);
    }
    amount += cols;
    if (isWeb && Math.abs(colAmount - amount) <= 3) {
      cols += colAmount - amount;
      amount = 0;
    }
    return { ...item, metaData: { ...item.metaData, cols } };
  });
  return result;
};

interface ImageMeta {
  width: number;
  height: number;
  aspectWidth: number;
  aspectHeight: number;
}
export const getImageMeta = async (url: string): Promise<ImageMeta> =>
  new Promise((res, rej) => {
    const img = new Image();
    img.src = url;
    img.onload = function (event) {
      const target = event.target as HTMLImageElement;
      const divisor = gcd(target.width, target.height);
      res({
        width: target.width,
        height: target.height,
        aspectWidth: target.width / divisor,
        aspectHeight: target.height / divisor,
      });
    };
    img.onerror = function onError() {
      rej(new Error('Unable to get image meta data'));
    };
  });

export const subdomain = window.location.host.split('.')[0];

export const getDomainWithoutSubdomain = (): string => {
  const urlParts = window.location.hostname.split('.');

  const mainDomain = urlParts
    .slice(0)
    .slice(-(urlParts.length === 4 ? 3 : 2))
    .join('.');

  if (navigator.userAgent === 'ReactSnap') {
    return '/';
  }

  return mainDomain === 'localhost' ? `http://${mainDomain}:3000` : `https://${mainDomain}`;
};

export default {
  getImageMeta,
};

'use client';

export const isIframe = () => {
  return typeof window !== `undefined` && window.parent && window.parent !== window;
};

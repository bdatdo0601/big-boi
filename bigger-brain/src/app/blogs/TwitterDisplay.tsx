"use client"
import { useEffect, useState } from "react";

export default function TwitterDisplay({
  tweetID,
}: TwitterDisplayProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if ((window as any).twttr) {
      (window as any).twttr.widgets.load(
        tweetID,
        document.getElementById(tweetID),
        {
          align: 'center',
          conversation: 'none',
          dnt: true,
          theme: 'dark',
        }
      ).then(() => setIsLoading(false));
    };
  }, [tweetID]);

  return (
    <div className="w-full animate-fadeIn" id={tweetID}>
      {isLoading && <p>LOADING</p>}
    </div>
  );
};

interface TwitterDisplayProps {
  tweetID: string,
};
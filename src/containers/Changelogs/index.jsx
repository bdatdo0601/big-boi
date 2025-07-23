import React from 'react';
import MarkdownDisplayer from '../../components/MarkdownDisplayer';
import useGetTextFileFromURL from '../../utils/hooks/useFetchTextFromURL';

const CHANGELOG_URL = 'https://raw.githubusercontent.com/bdatdo0601/big-boi/develop/CHANGELOG.md';

export default function ChangeLogs() {
  const { text } = useGetTextFileFromURL(CHANGELOG_URL);

  return (
    <div className="section-container html-wrap">
      <MarkdownDisplayer value={text} style={{ padding: '4rem', overflowWrap: 'break-word' }} />
    </div>
  );
}

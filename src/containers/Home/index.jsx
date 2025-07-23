import { get } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useStorageResume } from '@/components/Vitae/withResumeProvider';
import { useGetFile, useGetFileURL } from '../../utils/awsStorage';
import { RESUME } from '../../utils/constants';
import Landing from './Landing';

export default function Home() {
  const { resume } = useStorageResume();

  return (
    <div className="container-div">
      <Landing
        keywords={get(resume, 'custom.keywordTags', [])}
        contacts={get(resume, 'custom.contacts', [])}
        bio={get(resume, 'custom.bio', [])}
      />
    </div>
  );
}

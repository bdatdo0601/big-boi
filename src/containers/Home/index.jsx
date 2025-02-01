import React, { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { get } from 'lodash';
import Landing from './Landing';
import { useGetFile, useGetFileURL } from '../../utils/awsStorage';
import { RESUME } from '../../utils/constants';
import { useStorageResume } from '@/components/Vitae/withResumeProvider';

export default function Home() {
  const { resume, loading } = useStorageResume();

  if (loading) {
    return <div className="w-full *:text-center mx-auto"><CircularProgress /></div>;
  }

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

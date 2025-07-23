import { Button, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import withResumeProvider from '@/components/Vitae/withResumeProvider';
import ProfileCard from '../../../../components/ProfileCard';
import { ResumeProvider } from '../../../../components/Vitae';
import { useGetFile } from '../../../../utils/awsStorage';
import { RESUME } from '../../../../utils/constants';
import ResumeDisplay from './ResumeDisplay';

const Background = () => {
  return (
    <div className="mx-auto flex flex-col items-center">
      <ResumeDisplay />
    </div>
  );
};

export default withResumeProvider(Background);

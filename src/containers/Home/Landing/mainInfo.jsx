import { CircularProgress, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React, { lazy, Suspense } from 'react';
import LandingProfile from '../../../components/Profile';

const DataStack = lazy(() => import('../../../components/DataStack'));

const MainInfo = ({ keywords, containerStyle, className, animation }) => (
  <div
    className={`px-4 ${className}`}
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      justifyItems: 'center',
      alignItems: 'center',
      alignContent: 'center',
      flexDirection: 'column',
      ...containerStyle,
    }}
  >
    <LandingProfile containerStyle={{ zIndex: 1 }} imageStyle={{ zIndex: 1 }} animation={animation} />
    <div style={{ flex: 1, width: '100%' }}>
      <DataStack
        dataList={keywords.map(keyword => (
          <h4 key={keyword} className="text-input text-3xl" style={{ fontFamily: 'Kalam' }}>
            {keyword}
          </h4>
        ))}
        listStyle={{
          marginTop: 50,
          paddingTop: 0,
        }}
        itemContainerStyle={{
          height: 140,
          width: 350,
          cursor: 'pointer',
          textAlign: 'center',
          zIndex: 3,
        }}
        itemStyle={{
          backgroundImage: `
              linear-gradient(to bottom, var(--popover-foreground) 0.5px, transparent 0.3px),
              linear-gradient(var(--popover) 42px, var(--popover-foreground) 0.5px)
            `,
          backgroundSize: '28px 28px, 28px 28px, 20% 12px',
          backgroundPosition: '0 0, 0 0, 0 1px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
          border: '2.5px solid var(--accent-foreground)',
          borderRadius: '24px',
        }}
      />
    </div>
  </div>
);

MainInfo.propTypes = {
  className: PropTypes.string,
  keywords: PropTypes.arrayOf(PropTypes.string),
  containerStyle: PropTypes.object,
  animation: PropTypes.bool,
};

MainInfo.defaultProps = {
  className: '',
  keywords: [],
  containerStyle: {},
  animation: false,
};

export default MainInfo;

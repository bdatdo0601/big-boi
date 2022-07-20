import React, { useEffect } from 'react'
import { Global, css } from '@emotion/react'
import { Fragment } from 'react'

export const PageElement = ({ children }) => {
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])

  return (
    <Fragment>
      <Global
        styles={css`
          @font-face {
            font-family: 'Inconsolata';
            font-weight: 400;
            font-style: normal;
          }
          @font-face {
            font-family: 'Inconsolata';
            font-weight: 700;
            font-style: normal;
          }
        `}
      />
      {children}
    </Fragment>
  )
}

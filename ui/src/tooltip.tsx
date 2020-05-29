import * as Fluent from '@fluentui/react';
import React from 'react';
import { stylesheet } from 'typestyle';
import { Markdown } from './markdown';
import { B, S } from './telesync';

const
  css = stylesheet({
    container: {
      display: 'flex',
      alignItems: 'flex-start',
      alignContent: 'flex-start'
    },
    element: {
      flexGrow: 1
    },
    icon: {
      color: '#323130',
      fontWeight: 400,
      fontSize: '14px',
      userSelect: 'none',
      textAlign: 'left',
      marginLeft: '0.5em',
      cursor: 'pointer'
    }
  })

export const
  XToolTip = ({ children, content, showIcon, expand }: {
    children: React.ReactChild,
    content?: S,
    showIcon?: B,
    expand?: B
  }) => {
    if (!content) return <>{children}</>

    showIcon = showIcon === undefined ? true : showIcon
    expand = expand === undefined ? true : expand

    const
      tooltipProps: Fluent.ITooltipProps = {
        onRenderContent: () => (<div><Markdown source={content} /></div>)
      }
    if (showIcon) {
      return (
        <div className={css.container}>
          <div className={expand ? css.element : ''}>{children}</div>
          <Fluent.TooltipHost tooltipProps={tooltipProps}>
            <Fluent.FontIcon className={css.icon} iconName='Info' />
          </Fluent.TooltipHost>
        </div>
      )
    } else {
      return (
        <div className={css.container}>
          <Fluent.TooltipHost tooltipProps={tooltipProps}>
            {children}
          </Fluent.TooltipHost>
        </div>
      )
    }
  }
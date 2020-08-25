import * as Fluent from '@fluentui/react'
import React from 'react'
import { stylesheet } from 'typestyle'
import { Markdown } from './markdown'
import { B, S } from './qd'

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

    const
      tooltipProps: Fluent.ITooltipProps = {
        onRenderContent: () => (<div><Markdown source={content} /></div>)
      }
    return (
      <div className={css.container} data-test='tooltip'>
        {
          showIcon === undefined || showIcon
            ? (
              <>
                <div className={expand === undefined || expand ? css.element : ''}>{children}</div>
                <Fluent.TooltipHost tooltipProps={tooltipProps}>
                  <Fluent.FontIcon className={css.icon} iconName='Info' />
                </Fluent.TooltipHost>
              </>
            )
            : <Fluent.TooltipHost tooltipProps={tooltipProps}>{children}</Fluent.TooltipHost>
        }
      </div>
    )
  }
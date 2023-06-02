// Copyright 2020 H2O.ai, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as Fluent from '@fluentui/react'
import { B, S } from 'h2o-wave'
import React from 'react'
import { stylesheet } from 'typestyle'
import { Markdown } from './markdown'
import { clas, cssVar } from './theme'

const
  css = stylesheet({
    container: {
      display: 'flex',
      alignItems: 'flex-start',
      alignContent: 'flex-start',
      height: '100%'
    },
    expand: {
      flexGrow: 1
    },
    icon: {
      color: cssVar('$text'),
      fontWeight: 400,
      fontSize: '14px',
      userSelect: 'none',
      textAlign: 'left',
      marginLeft: '0.5em',
      cursor: 'pointer'
    },
    preventOverflow: {
      minWidth: 0
    },
    tooltipWrapper: {
      height: 'inherit'
    }
  })

export const
  XToolTip = ({ children, content, showIcon = true, expand = true }: {
    children: React.ReactChild,
    content?: S,
    showIcon?: B,
    expand?: B
  }) => {
    if (!content) return <>{children}</>

    const tooltipProps: Fluent.ITooltipProps = { onRenderContent: () => <div><Markdown source={content} /></div> }
    return (
      <div className={css.container} data-test='tooltip'>
        {
          showIcon
            ? (
              <>
                <div className={clas(css.preventOverflow, css.tooltipWrapper, expand ? css.expand : '')}>{children}</div>
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
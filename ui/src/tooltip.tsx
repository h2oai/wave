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
import { B, S } from './core'
import React from 'react'
import { stylesheet } from 'typestyle'
import { Markdown } from './markdown'
import { clas, cssVar } from './theme'

const
  css = stylesheet({
    flexContainer: {
      display: 'flex',
    },
    alignStart: {
      alignItems: 'flex-start',
      alignContent: 'flex-start'
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
    }
  })

export const
  XToolTip = ({ children, content, showIcon = true, expand = true }: {
    children: React.ReactElement,
    content?: S,
    showIcon?: B,
    expand?: B
  }) => {
    if (!content) return <>{children}</>

    const
      isFullHeight = children.props.model?.height === '1',
      tooltipProps: Fluent.ITooltipProps = { onRenderContent: () => <Markdown source={content} /> }
    return (
      <div className={clas(css.flexContainer, isFullHeight ? css.expand : css.alignStart)} data-test='tooltip'>
        {
          showIcon
            ? (
              <>
                <div className={clas(css.preventOverflow, expand ? css.expand : '', isFullHeight ? css.flexContainer : '')}>{children}</div>
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
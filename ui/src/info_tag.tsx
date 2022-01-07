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

import React from 'react'
import { stylesheet } from 'typestyle'
import { clas, cssVar, getContrast } from './theme'
import { S } from 'h2o-wave'

const css = stylesheet({
  tag: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    boxSizing: 'border-box',
  },
  large: {
    minWidth: 49,
    height: 49,
    padding: '0 18px',
  },
  small: {
    minWidth: 24,
    height: 26,
    padding: '0 10px',
  }
})

/** Create an information tag with text inside. */
export interface InfoTag {
  /** An identifying name for this component. */
  name: S
  /** The text displayed within the tag. */
  label: S
  /** Tag's background color. */
  color: S
  /** Tag's label color. If not specified, black or white will be picked based on correct contrast with background. */
  label_color?: S
  /** Tag's size. Defaults to 'small'. */
  size?: 'small' | 'large'
}

export const XInfoTag = ({ model }: { model: InfoTag }) => {
  const
    tagColor = model.color || '$text',
    color = cssVar(model.label_color || getContrast(tagColor)),
    styles = React.useMemo(() => model.size === 'large' ?
      { font: 'wave-s18 wave-w6', size: css.large } : { font: 'wave-s14', size: css.small }, [model.size])
  
  return (
    <div data-test={model.name} style={{ background: cssVar(tagColor), color }} className={clas(css.tag, styles.font, styles.size)}>
      {model.label}
    </div>
  )
}
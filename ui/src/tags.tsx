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
import { Tag } from './tag_table_cell_type'

const css = stylesheet({
  container: {
    display: 'flex',
    justifyContent: 'center',
  },
  tag: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    boxSizing: 'border-box',
    minWidth: 49,
    height: 49,
    padding: '0 18px',
    marginRight: 10,
  }
})

/** Create a set of tags laid out horizontally. */
export interface Tags {
  /** Tags in this set. */
  items: Tag[]
}

export const XTags = ({ model }: { model: Tags }) => {
  const tags = model.items.map((tag, idx) => {
    const
      tagColor = tag.color || '$text',
      color = cssVar(tag.label_color || getContrast(tagColor))
  
    return (
      <div key={idx} style={{ background: cssVar(tagColor), color }} className={clas(css.tag, 'wave-s18 wave-w6' )}>
        {tag.label}
      </div>
    )
  })
  
  return (
    <div className={css.container}>
      {tags}
    </div>
  )
}
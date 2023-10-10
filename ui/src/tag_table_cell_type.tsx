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

import { B, S, U } from './core'
import React from 'react'
import { stylesheet } from 'typestyle'
import { clas, cssVar, getContrast, padding } from './theme'


/** 
 * Creates a collection of tags, usually used for rendering state values.
 * In case of multiple tags per row, make sure the row values are
 * separated by "," within a single cell string.
 * E.g. ui.table_row(name="...", cells=["cell1", "TAG1,TAG2"]).
 * Each value should correspond to a `ui.tag.label` attr.
 * For the example above: [
 *  ui.tag(label="TAG1", color="red"),
 *  ui.tag(label="TAG2", color="green"),
 * ]
 */
export interface TagTableCellType {
  /** An identifying name for this component. */
  name: S
  /** Tags to be rendered. */
  tags?: Tag[]
}

/**
 * Create a tag.
 */
export interface Tag {
  /** The text displayed within the tag. */
  label: S
  /** Tag's background color. */
  color: S
  /** Tag's label color. If not specified, black or white will be picked based on correct contrast with background. */
  label_color?: S
}
const css = stylesheet({
  tag: {
    display: 'inline-block',
    borderRadius: 4,
    padding: padding(4, 16),
    '&:not(:last-child)': {
      marginRight: 8
    }
  },
  multiline: {
    marginTop: 4,
    marginBottom: 4
  }
})

export const XTagTableCellType = ({ model, serializedTags, isMultiline }: { model: TagTableCellType, serializedTags: S, isMultiline?: B }) => {
  const
    mapTags = ((tagLabel: S, i: U) => {
      const
        tag = model.tags?.find(({ label }) => label === tagLabel),
        tagColor = tag?.color || '$text',
        background = cssVar(tagColor),
        color = cssVar(tag?.label_color || getContrast(tagColor))

      return <span key={i} style={{ background, color }} className={clas(css.tag, 'wave-s12 wave-w6', isMultiline ? css.multiline : '')}>{tagLabel}</span>
    })
  return <div data-test={model.name}>{serializedTags.split(',').filter(tag => tag !== '').map(mapTags)}</div>
}

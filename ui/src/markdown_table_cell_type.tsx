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

import { S } from 'h2o-wave'
import React from 'react'
import { XLink } from './link'
import { Markdown } from './markdown'

/**
 * Create a cell type that renders Markdown content.
*/
export interface MarkdownTableCellType {
  /** An identifying name for this component. */
  name?: S
}

export const XMarkdownTableCellType = ({ content }: { content: S}) => {
  const [, label, path] = /\[(.*)\]\((.+)\)/.exec(content) || []
  if (path) {
    const isPathAbsolute = /https*:\/\//.exec(path)
    return <XLink model={{ label, path, target: isPathAbsolute ? '_blank' : undefined }} />
  } else {
    return <Markdown source={content} />
  }
}
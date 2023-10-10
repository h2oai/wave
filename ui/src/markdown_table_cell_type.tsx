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

import { S } from './core'
import React from 'react'
import { Markdown } from './markdown'

/**
 * Create a cell type that renders Markdown content.
*/
export interface MarkdownTableCellType {
  /** An identifying name for this component. */
  name?: S
  /** Where to display the link. An empty string or `'_blank'` opens the link in a new tab. `_self` opens in the current tab. */
  target?: S
}

export const XMarkdownTableCellType = ({ model: m }: { model: MarkdownTableCellType & { content: S } }) => {
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    ref.current!.querySelectorAll<HTMLAnchorElement>('a')?.forEach(a => { if (m.target) a.target = m.target })
  }, [m.target])

  return (
    <div data-test={m.name} ref={ref}>
      <Markdown source={m.content} />
    </div>
  )
}
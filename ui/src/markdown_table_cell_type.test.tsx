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

import { render } from '@testing-library/react'
import React from 'react'
import { XMarkdownTableCellType } from './markdown_table_cell_type'

describe('MarkdownTableCellType.tsx', () => {

  const
    label = 'wave',
    url = 'https://wave.h2o.ai',
    absoluteLink = `[${label}](${url})`,
    relativeLink = `[${label}](/wave)`

  it('Renders link with label', () => {
    const { queryByText } = render(<XMarkdownTableCellType content={absoluteLink} />)
    expect(queryByText(label)).toBeInTheDocument()
    expect(queryByText(url)).not.toBeInTheDocument()
  })

  it('Opens absolute links in new tab', () => {
    const { container } = render(<XMarkdownTableCellType content={absoluteLink} />)
    const anchor = container.querySelector(`a[href="${url}"]`) as HTMLAnchorElement
    expect(anchor?.target).toBe('_blank')
  })

  it('Opens relative links in same tab', () => {
    const { container } = render(<XMarkdownTableCellType content={relativeLink} />)
    const anchor = container.querySelector(`a[href="${url}"]`) as HTMLAnchorElement
    expect(anchor?.target).toBeUndefined()
  })
})
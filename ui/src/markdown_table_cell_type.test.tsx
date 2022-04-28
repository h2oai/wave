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

const
  label = 'wave',
  link = `[${label}](https://wave.h2o.ai)`

describe('MarkdownTableCellType.tsx', () => {

  it('Opens link in same tab', () => {
    const { getByText } = render(<XMarkdownTableCellType model={{content: link}} />)
    expect(getByText(label).getAttribute('target')).toBeNull()
  })
  
  it('Opens link in new tab', () => {
    const { getByText } = render(<XMarkdownTableCellType model={{ target: '_blank', content: link }} />)
    expect(getByText(label).getAttribute('target')).toBe('_blank')
  })
})
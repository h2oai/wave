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
import { ProgressTableCellType, XProgressTableCellType } from './progress_table_cell_type'

const
  name = 'progress-cell',
  progress = 0.0,
  progressCellProps: ProgressTableCellType = { name }

describe('ProgressTableCellType.tsx', () => {

  it('Does not render data-test attr ', () => {
    const { container } = render(<XProgressTableCellType model={{}} progress={progress} />)
    expect(container.querySelectorAll('[data-test]')).toHaveLength(0)
  })

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<XProgressTableCellType model={progressCellProps} progress={progress} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Renders decimal values with correct precision ', () => {
    const {getByText} = render(<XProgressTableCellType model={progressCellProps} progress={progress} decimals={true}/>)
    const expectedTextDecimalTrue = `${Math.round(progress * 10000) / 100}%`
    expect(getByText(expectedTextDecimalTrue)).toBeInTheDocument()
  })
  
  it('Renders decimal values with correct precision ', () => {
    const {getByText} = render(<XProgressTableCellType model={progressCellProps} progress={progress} decimals={false}/>)
    const expectedTextDecimalFalse = `${Math.round(progress * 100)}%`
    expect(getByText(expectedTextDecimalFalse)).toBeInTheDocument()
  })
  
})
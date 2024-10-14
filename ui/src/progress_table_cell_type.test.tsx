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
  progressCellProps: ProgressTableCellType = { name },
  progressValues = [
    {input: 0.88, output: '88%'},
    {input: 0.888, output: '88.8%'},
    {input: 0.8888, output: '88.88%'},
    {input: 0.88888, output: '88.89%'},
    {input: 0.88899, output: '88.90%'},
    {input: 0.88999, output: '89.00%'},],
  progressFloatingPointValues = [
      {input: 0.14, output: '14%'},
      {input: 0.148, output: '14.8%'},
      {input: 0.1414, output: '14.14%'},
      {input: 0.141414, output: '14.14%'},
      {input: 0.29, output: '29%'},
      {input: 0.58, output: '58%'},
      {input: 0.592, output: '59.2%'},]       

describe('ProgressTableCellType.tsx', () => {

  it('Does not render data-test attr ', () => {
    const { container } = render(<XProgressTableCellType model={{}} progress={progress} />)
    expect(container.querySelectorAll('[data-test]')).toHaveLength(0)
  })

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<XProgressTableCellType model={progressCellProps} progress={progress} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Renders data-test attr with decimal values', () => {
    const { queryByTestId, rerender } = render(<XProgressTableCellType model={progressCellProps} progress={progress} />)
    progressValues.map(progressValue => {
      rerender(<XProgressTableCellType model={progressCellProps} progress={progressValue.input} />)
      expect(queryByTestId(name)).toBeInTheDocument()
      expect(queryByTestId(name)).toHaveTextContent(progressValue.output)      
    })
  })
  
  it('Handle potential floating-point decimal errors', () => {
    const { queryByTestId, rerender } = render(<XProgressTableCellType model={progressCellProps} progress={progress} />)
    progressFloatingPointValues.map(progressValue => {
      rerender(<XProgressTableCellType model={progressCellProps} progress={progressValue.input} />)
      expect(queryByTestId(name)).toBeInTheDocument()
      expect(queryByTestId(name)).toHaveTextContent(progressValue.output)      
    })
  })   
})

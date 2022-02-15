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

import { fireEvent, render } from '@testing-library/react'
import React from 'react'
import { Checklist, XChecklist } from './checklist'
import { wave } from './ui'

const name = 'checklist'
const checklistProps: Checklist = { name, choices: [{ name: 'Choice1' }, { name: 'Choice2' }, { name: 'Choice3' },] }
describe('Checklist.tsx', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    wave.args[name] = null
  })

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<XChecklist model={checklistProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Sets args - single selection', () => {
    const { getByText } = render(<XChecklist model={checklistProps} />)
    fireEvent.click(getByText('Choice1').parentElement!)

    expect(wave.args[name]).toMatchObject(['Choice1'])
  })

  it('Sets args - multi selection', () => {
    const { getByText } = render(<XChecklist model={checklistProps} />)
    fireEvent.click(getByText('Choice1').parentElement!)
    fireEvent.click(getByText('Choice2').parentElement!)
    fireEvent.click(getByText('Choice3').parentElement!)

    expect(wave.args[name]).toMatchObject(['Choice1', 'Choice2', 'Choice3'])
  })

  it('Sets all choices as args after select all', () => {
    const { getByText } = render(<XChecklist model={checklistProps} />)
    fireEvent.click(getByText('Select All'))

    expect(wave.args[name]).toMatchObject(['Choice1', 'Choice2', 'Choice3'])
  })

  it('Sets empty args after deselect all', () => {
    const { getByText } = render(<XChecklist model={checklistProps} />)
    fireEvent.click(getByText('Choice1').parentElement!)
    fireEvent.click(getByText('Choice2').parentElement!)
    fireEvent.click(getByText('Choice3').parentElement!)
    fireEvent.click(getByText('Deselect All'))

    expect(wave.args[name]).toMatchObject([])
  })

  it('Calls sync - trigger specified', () => {
    const pushMock = jest.fn()
    const { getByText } = render(<XChecklist model={{ ...checklistProps, trigger: true }} />)

    wave.push = pushMock
    fireEvent.click(getByText('Choice1').parentElement!)

    expect(pushMock).toHaveBeenCalled()
  })

  it('Does not call sync - trigger not specified', () => {
    const pushMock = jest.fn()
    const { getByText } = render(<XChecklist model={checklistProps} />)

    wave.push = pushMock
    fireEvent.click(getByText('Choice1').parentElement!)

    expect(pushMock).not.toHaveBeenCalled()
  })

  it('Calls sync - select all', () => {
    const pushMock = jest.fn()
    const { getByText } = render(<XChecklist model={{ ...checklistProps, trigger: true }} />)

    wave.push = pushMock
    fireEvent.click(getByText('Select All'))

    expect(pushMock).toHaveBeenCalled()
  })

  it('Calls sync - deselect all', () => {
    const pushMock = jest.fn()
    const { getByText } = render(<XChecklist model={{ ...checklistProps, trigger: true }} />)

    wave.push = pushMock
    fireEvent.click(getByText('Deselect All'))

    expect(pushMock).toHaveBeenCalled()
  })
})
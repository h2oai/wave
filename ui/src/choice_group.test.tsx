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
import { ChoiceGroup, XChoiceGroup } from './choice_group'
import { wave } from './ui'

const name = 'choiceGroup'
const choiceGroupProps: ChoiceGroup = { name, choices: [{ name: 'Choice1' }, { name: 'Choice2' }, { name: 'Choice3' },] }
describe('ChoiceGroup.tsx', () => {
  beforeEach(() => { wave.args[name] = null })

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<XChoiceGroup model={choiceGroupProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Sets args - single selection', () => {
    const { getByText } = render(<XChoiceGroup model={choiceGroupProps} />)
    fireEvent.click(getByText('Choice1').parentElement!)

    expect(wave.args[name]).toBe('Choice1')
  })

  it('Sets args - multi selection', () => {
    const { getByText } = render(<XChoiceGroup model={choiceGroupProps} />)
    fireEvent.click(getByText('Choice1').parentElement!)
    fireEvent.click(getByText('Choice2').parentElement!)
    fireEvent.click(getByText('Choice3').parentElement!)

    expect(wave.args[name]).toBe('Choice3')
  })

  it('Does not call sync - trigger not specified', () => {
    const { getByText } = render(<XChoiceGroup model={choiceGroupProps} />)
    const pushMock = jest.fn()

    wave.push = pushMock
    fireEvent.click(getByText('Choice1').parentElement!)

    expect(pushMock).toBeCalledTimes(0)
  })

  it('Calls sync - trigger specified', () => {
    const { getByText } = render(<XChoiceGroup model={{ ...choiceGroupProps, trigger: true }} />)
    const pushMock = jest.fn()

    wave.push = pushMock
    fireEvent.click(getByText('Choice1').parentElement!)

    expect(pushMock).toHaveBeenCalled()
  })
})
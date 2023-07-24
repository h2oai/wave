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

import { initializeIcons } from '@fluentui/react'
import { fireEvent, render } from '@testing-library/react'
import React from 'react'
import { Checkbox, XCheckbox } from './checkbox'
import { wave } from './ui'

const name = 'checkbox'
const checkboxProps: Checkbox = { name }

describe('Checkbox.tsx', () => {
  beforeAll(() => initializeIcons())
  beforeEach(() => {
    jest.clearAllMocks()
    wave.args[name] = null
  })

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<XCheckbox model={checkboxProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Does not display checkbox when visible is false', () => {
    const { queryByTestId } = render(<XCheckbox model={{ ...checkboxProps, visible: false }} />)
    expect(queryByTestId(name)).toBeInTheDocument()
    expect(queryByTestId(name)).not.toBeVisible()
  })

  it('Does not call sync when trigger is off', () => {
    const pushMock = jest.fn()
    const { getByTestId } = render(<XCheckbox model={checkboxProps} />)

    wave.push = pushMock
    fireEvent.click(getByTestId(name))

    expect(pushMock).toHaveBeenCalledTimes(0)
  })

  it('Calls sync when trigger is on', () => {
    const pushMock = jest.fn()
    const { getByTestId } = render(<XCheckbox model={{ ...checkboxProps, trigger: true }} />)

    wave.push = pushMock
    fireEvent.click(getByTestId(name))

    expect(pushMock).toHaveBeenCalled()
  })

  it('Sets args on click', () => {
    const { getByTestId } = render(<XCheckbox model={checkboxProps} />)
    fireEvent.click(getByTestId(name))

    expect(wave.args[name]).toBe(true)
  })

  it('Set args when value is updated', () => {
    const { rerender } = render(<XCheckbox model={{ name, value: true }} />)
    expect(wave.args[name]).toBe(true)
    rerender(<XCheckbox model={{ name, value: false }} />)
    expect(wave.args[name]).toBe(false)
  })

})
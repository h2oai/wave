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
import { Toggle, XToggle } from './toggle'
import { wave } from './ui'

const name = 'toggle'
const toggleProps: Toggle = { name }

describe('Toggle.tsx', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    wave.args[name] = null
  })

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<XToggle model={toggleProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Calls sync when trigger is on', () => {
    const pushMock = jest.fn()
    const { getByTestId } = render(<XToggle model={{ ...toggleProps, trigger: true }} />)

    wave.push = pushMock
    fireEvent.click(getByTestId(name))

    expect(pushMock).toHaveBeenCalled()
  })

  it('Does not call sync when trigger is off', () => {
    const pushMock = jest.fn()
    const { getByTestId } = render(<XToggle model={toggleProps} />)

    wave.push = pushMock
    fireEvent.click(getByTestId(name))

    expect(pushMock).toHaveBeenCalledTimes(0)
  })

  it('Sets args on click', () => {
    const { getByTestId } = render(<XToggle model={toggleProps} />)
    fireEvent.click(getByTestId(name))

    expect(wave.args[name]).toBe(true)
  })

})
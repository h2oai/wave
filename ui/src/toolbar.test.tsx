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
import * as T from 'h2o-wave'
import React from 'react'
import { View } from './toolbar'
import { wave } from './ui'

const
  name = 'toolbar',
  commandName = 'toolbar_command',
  commandNameWithHash = '#toolbar_command',
  commandValue = 'toolbar_command_value',
  toolbarProps: T.Model<any> = {
    name,
    state: { items: [{ name: commandName, label: commandName }] },
    changed: T.box(true)
  },
  toolbarPropsWithHash: T.Model<any> = {
    name,
    state: { items: [{ name: commandNameWithHash, label: commandNameWithHash }] },
    changed: T.box(true)
  }

describe('Toolbar.tsx', () => {
  beforeEach(() => {
    wave.args[commandName] = null
    jest.clearAllMocks()
  })

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<View {...toolbarProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Sets args and calls sync on click - with value attr', () => {
    const pushMock = jest.fn()
    wave.push = pushMock

    const { getByText } = render(<View {...toolbarProps} {...{
      state: {
        items: [{
          name: commandName,
          value: commandValue,
          label: commandName
        }]
      }
    }} />)

    fireEvent.click(getByText(commandName))

    expect(pushMock).toBeCalled()
    expect(wave.args[commandName]).toBe(commandValue)
  })

  it('Sets args and calls sync on click - without value attr', () => {
    const pushMock = jest.fn()
    wave.push = pushMock

    const { getByText } = render(<View {...toolbarProps} />)
    fireEvent.click(getByText(commandName))

    expect(pushMock).toBeCalled()
    expect(wave.args[commandName]).toBe(true)
  })

  it('Does not set args and calls sync on click when command name starts with hash', () => {
    const pushMock = jest.fn()
    wave.push = pushMock

    const { getByText } = render(<View {...toolbarPropsWithHash} />)

    fireEvent.click(getByText(commandNameWithHash))
    expect(wave.args[commandNameWithHash]).toBe(false)
    expect(pushMock).toHaveBeenCalledTimes(0)
  })

  it('Sets window location hash when command name starts with hash', () => {
    const { getByText } = render(<View {...toolbarPropsWithHash} />)
    fireEvent.click(getByText(commandNameWithHash))

    expect(window.location.hash).toBe(commandNameWithHash)
  })

})

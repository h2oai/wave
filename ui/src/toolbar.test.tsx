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

import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import { View } from './toolbar'
import * as T from './qd'

const
  name = 'toolbar',
  commandName = 'toolbar_command',
  commandValue = 'toolbar_command_value',
  commandLabel = commandName,
  toolbarProps: T.Card<any> = {
    name,
    state: { items: [] },
    changed: T.box(false)
  },
  toolbarPropsWithValueAttr: T.Card<any> = {
    name,
    state: { items: [{ name: commandName, value: commandValue, label: commandLabel }] },
    changed: T.box(false)
  },
  toolbarPropsWithoutValueAttr: T.Card<any> = {
    name,
    state: { items: [{ name: commandName, label: commandLabel }] },
    changed: T.box(false)
  }

describe('Toolbar.tsx', () => {
  beforeEach(() => {
    T.qd.args[commandName] = null
    jest.clearAllMocks()
  })

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<View {...toolbarProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Sets args and calls sync on click - with value attr', () => {
    const syncMock = jest.fn()
    T.qd.sync = syncMock

    const {getByText} = render(<View {...toolbarPropsWithValueAttr} />)
    fireEvent.click(getByText(commandLabel))

    expect(T.qd.args[commandName]).toBe(commandValue)
  })

  it('Sets args and calls sync on click - without value attr', () => {
    const syncMock = jest.fn()
    T.qd.sync = syncMock

    const {getByText} = render(<View {...toolbarPropsWithoutValueAttr} />)
    fireEvent.click(getByText(commandLabel))

    expect(T.qd.args[commandName]).toBe(true)
  })

})

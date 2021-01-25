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
import { render, fireEvent } from '@testing-library/react'
import { View } from './toolbar'
import * as T from './qd'

const
  name = 'toolbar',
  hashName = `#${name}`,
  label = 'label',
  toolbarProps: T.Card<any> = {
    name,
    state: { items: [{ name, label }] },
    changed: T.box(false)
  }

describe('Toolbar.tsx', () => {

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<View {...toolbarProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Sets args - init', () => {
    render(<View {...toolbarProps} />)
    expect(T.qd.args[name]).toBe(false)
  })

  it('Sets args and calls sync on click', () => {
    const syncMock = jest.fn()
    T.qd.sync = syncMock

    const { getByText } = render(<View {...toolbarProps} />)
    fireEvent.click(getByText(label))

    expect(T.qd.args[name]).toBe(true)
    expect(syncMock).toHaveBeenCalled()
    expect(window.location.hash).toBe('')
  })

  it('Does not set args, calls sync on click, updates browser hash when name starts with hash', () => {
    const syncMock = jest.fn()
    T.qd.sync = syncMock
    toolbarProps.state.items[0].name = hashName

    const { getByText } = render(<View {...toolbarProps} />)
    fireEvent.click(getByText(label))

    expect(T.qd.args[hashName]).toBe(false)
    expect(syncMock).toHaveBeenCalledTimes(0)
    expect(window.location.hash).toBe(hashName)
  })
})
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
import { View as Toolbar } from './toolbar'
import { box, Model } from './core'
import { wave } from './ui'

const
  name = 'toolbar',
  label = name,
  path = 'https://wave.h2o.ai/img/logo.svg',
  toolbarProps: Model<any> = {
    name,
    state: { items: [{ name, label }] },
    changed: box(false)
  },
  pushMock = jest.fn()

describe('Toolbar.tsx', () => {
  beforeAll(() => wave.push = pushMock)
  beforeEach(() => {
    wave.args[name] = null
    pushMock.mockReset()
    window.location.hash = ''
  })

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<Toolbar {...toolbarProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Sets args and calls sync on click - with value attr', () => {
    const value = 'value'
    const { getByText } = render(<Toolbar {...{ ...toolbarProps, state: { items: [{ name, value, label }] } }} />)
    fireEvent.click(getByText(label))

    expect(pushMock).toHaveBeenCalled()
    expect(wave.args[name]).toBe(value)
  })

  it('Sets args and calls sync on click - without value attr', () => {
    const { getByText } = render(<Toolbar {...toolbarProps} />)
    fireEvent.click(getByText(label))

    expect(pushMock).toHaveBeenCalled()
    expect(wave.args[name]).toBe(true)
    expect(window.location.hash).toBe('')
  })

  it('Does not set args or calls sync on click when command name starts with hash', () => {
    const hashName = `#${name}`
    const { getByText } = render(<Toolbar {...{ ...toolbarProps, state: { items: [{ name: hashName, label }] } }} />)

    fireEvent.click(getByText(label))
    expect(wave.args[hashName]).toBe(false)
    expect(pushMock).not.toHaveBeenCalled()
    expect(window.location.hash).toBe(hashName)
  })

  it('Does not set args and calls sync on click when command has download link specified', () => {
    const value = 'value'
    const { getByText } = render(<Toolbar {...{ ...toolbarProps, state: { items: [{ name, value, label, path, download: true }] } }} />)
    fireEvent.click(getByText(label))

    expect(pushMock).not.toHaveBeenCalled()
    expect(wave.args[name]).toBe(false)
  })

  it('Ignores items when command has download link specified', () => {
    const props = {
      ...toolbarProps, state: {
        items: [{
          name,
          label,
          path,
          download: true,
          items: [{ name: 'item', label: 'item' }]
        }]
      }
    }
    const { queryByText, getByText } = render(<Toolbar {...props} />)

    expect(queryByText('item')).not.toBeInTheDocument()
    fireEvent.click(getByText(label))

    expect(queryByText('item')).not.toBeInTheDocument()
  })

  it('Opens link in a new tab when command has path specified', () => {
    const windowOpenMock = jest.fn()
    window.open = windowOpenMock
    const { getByText } = render(<Toolbar {...{ ...toolbarProps, state: { items: [{ name, label, path }] } }} />)

    fireEvent.click(getByText(label))

    expect(windowOpenMock).toHaveBeenCalled()
    expect(windowOpenMock).toHaveBeenCalledWith(path, '_blank')
  })
})

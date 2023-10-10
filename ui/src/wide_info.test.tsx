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
import * as T from './core'
import React from 'react'
import { wave } from './ui'
import { View, State } from './wide_info'

const
  name = 'wide_info',
  pushMock = jest.fn()
let wideInfoProps: T.Model<State>

describe('WideInfo.tsx', () => {
  beforeAll(() => wave.push = pushMock)
  beforeEach(() => {
    pushMock.mockReset()
    wave.args = [] as any
    wideInfoProps = {
      name,
      state: { title: name, name, caption: '' },
      changed: T.box(false)
    }
  })

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<View {...wideInfoProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Does not submit data to server if label specified and name starts with #', () => {
    wideInfoProps.state.name = `#${name}`
    wideInfoProps.state.label = 'label'
    const { getByTestId } = render(<View {...wideInfoProps} />)
    fireEvent.click(getByTestId(name))
    expect(pushMock).not.toHaveBeenCalled()
    expect(wave.args[name]).toBeUndefined()
  })

  it('Submits data to server if label specified and name without #', () => {
    wideInfoProps.state.name = name
    wideInfoProps.state.label = 'label'
    const { getByText } = render(<View {...wideInfoProps} />)
    fireEvent.click(getByText('label'))
    expect(pushMock).toHaveBeenCalled()
    expect(wave.args[name]).toBe(name)
  })

  it('Does not submit data to server if name specified but starts with #', () => {
    wideInfoProps.state.name = `#${name}`
    const { getByTestId } = render(<View {...wideInfoProps} />)
    fireEvent.click(getByTestId(name))
    expect(pushMock).not.toHaveBeenCalled()
    expect(wave.args[name]).toBeUndefined()
  })

  it('Submits data to server if name specified without #', () => {
    wideInfoProps.state.name = name
    const { getByTestId } = render(<View {...wideInfoProps} />)
    fireEvent.click(getByTestId(name))
    expect(pushMock).toHaveBeenCalled()
    expect(wave.args[name]).toBe(name)
  })

  it('Makes card clickable only if name was specified but label was not', () => {
    const { getByTestId } = render(<View {...wideInfoProps} />)
    fireEvent.click(getByTestId(name))
    expect(pushMock).toHaveBeenCalled()
    expect(wave.args[name]).toBe(name)
  })

  it('Makes card unclickable if name is empty', () => {
    wideInfoProps.state.name = ''
    const { getByTestId } = render(<View {...wideInfoProps} />)
    fireEvent.click(getByTestId(name))
    expect(pushMock).not.toHaveBeenCalled()
    expect(wave.args[name]).not.toBe(name)
  })

  it('Makes only the button (label) clickable if label was provided', () => {
    wideInfoProps.state.label = 'Click me'
    const { getByText, getByTestId } = render(<View {...wideInfoProps} />)
    fireEvent.click(getByTestId(name))
    expect(pushMock).not.toHaveBeenCalled()
    expect(wave.args[name]).not.toBe(name)

    fireEvent.click(getByText('Click me'))
    expect(pushMock).toHaveBeenCalled()
    expect(wave.args[name]).toBe(name)
  })
})
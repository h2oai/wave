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
import * as T from 'h2o-wave'
import React from 'react'
import { View } from './tab'
import { wave } from './ui'

const
  name = 'tab',
  hashName = `#${name}`,
  tabProps: T.Model<any> = {
    name,
    state: {
      items: [{ name }]
    },
    changed: T.box(false)
  }

describe('Meta.tsx', () => {
  beforeAll(() => initializeIcons())
  beforeEach(() => {
    wave.args[name] = null
    jest.clearAllMocks()
  })

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<View {...tabProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Sets args and calls sync on click', () => {
    const pushMock = jest.fn()
    wave.push = pushMock

    const { getByRole } = render(<View {...tabProps} />)
    fireEvent.click(getByRole('tab'))

    expect(wave.args[name]).toBe(true)
    expect(pushMock).toHaveBeenCalled()
  })

  it('Does not set args and calls sync on click - hash name', () => {
    const pushMock = jest.fn()
    wave.push = pushMock

    const { getByRole } = render(<View {...{ ...tabProps, state: { items: [{ name: hashName }] } }} />)
    fireEvent.click(getByRole('tab'))

    expect(wave.args[name]).toBeNull()
    expect(pushMock).toHaveBeenCalledTimes(0)
  })

  it('Set args when value is updated', () => {
    const items = [{ name: 'tab1' }, { name: 'tab2' }]
    const { rerender, getAllByRole } = render(<View {...{ ...tabProps, state: { items, value: 'tab1' } }} />)
    expect(getAllByRole('tab')[0]).toHaveClass('is-selected')

    rerender(<View {...{ ...tabProps, state: { items, value: 'tab2' } }} />)
    expect(wave.args[name]).toBe(true)
  })

  it('Does not set args when value is updated - hash name', () => {
    const items = [{ name: '#tab1' }, { name: '#tab2' }]
    const { rerender, getAllByRole } = render(<View {...{ ...tabProps, state: { items, value: '#tab1' } }} />)
    expect(getAllByRole('tab')[0]).toHaveClass('is-selected')

    rerender(<View {...{ ...tabProps, state: { items, value: '#tab2' } }} />)
    expect(wave.args[name]).toBeNull()
  })

  it('Selects tab when value is updated', () => {
    const items = [{ name: 'tab1' }, { name: 'tab2' }]
    const { rerender, getAllByRole } = render(<View {...{ ...tabProps, state: { items, value: 'tab1' } }} />)
    expect(getAllByRole('tab')[0]).toHaveClass('is-selected')

    rerender(<View {...{ ...tabProps, state: { items, value: 'tab2' } }} />)
    expect(getAllByRole('tab')[1]).toHaveClass('is-selected')
  })

  it('Selects tab when value is updated - hash name', () => {
    const items = [{ name: '#tab1' }, { name: '#tab2' }]
    const { rerender, getAllByRole } = render(<View {...{ ...tabProps, state: { items, value: '#tab1' } }} />)
    expect(getAllByRole('tab')[0]).toHaveClass('is-selected')

    rerender(<View {...{ ...tabProps, state: { items, value: '#tab2' } }} />)
    expect(getAllByRole('tab')[1]).toHaveClass('is-selected')
  })

  it('Sets url hash - hash name', () => {
    const { getByRole } = render(<View {...{ ...tabProps, state: { items: [{ name: hashName }] } }} />)
    fireEvent.click(getByRole('tab'))

    expect(window.location.hash).toBe(hashName)
  })

  it('Sets default tab', () => {
    const items = [{ name: 'tab1' }, { name: 'tab2' }]
    const { getAllByRole } = render(<View {...{ ...tabProps, state: { items, value: 'tab2' } }} />)

    expect(getAllByRole('tab')[1]).toHaveClass('is-selected')
  })

})
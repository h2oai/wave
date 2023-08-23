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

describe('Tab.tsx', () => {
  beforeEach(() => {
    window.location.hash = ''
    wave.args = [] as any
    wave.args[name] = null
    jest.clearAllMocks()
  })

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<View {...tabProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Sets args and calls sync on click - name is not defined', () => {
    const pushMock = jest.fn()
    wave.push = pushMock

    const { getByRole } = render(<View {...tabProps} />)
    fireEvent.click(getByRole('tab'))

    expect(wave.args[name]).toBe(true)
    expect(pushMock).toHaveBeenCalled()
  })

  it('Sets args and calls sync on click - name is defined', () => {
    const pushMock = jest.fn()
    wave.push = pushMock

    const { getByRole } = render(<View {...{ ...tabProps, state: { items: [{ name: 'tab1' }], name } }} />)
    fireEvent.click(getByRole('tab'))

    expect(wave.args[name]).toBe('tab1')
    expect(wave.args['tab1']).toBeUndefined()
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

  it('Does not call sync on click - args not changed - name not defined', () => {
    const pushMock = jest.fn()
    wave.push = pushMock

    const { getByRole } = render(<View {...tabProps} />)
    wave.args[name] = true
    fireEvent.click(getByRole('tab'))

    expect(pushMock).toHaveBeenCalledTimes(0)
  })

  it('Does not call sync on click - args not changed - name defined', () => {
    const pushMock = jest.fn()
    wave.push = pushMock

    const props = { ...tabProps, state: { items: [{ name }], name } }
    const { getByRole } = render(<View {...props} />)
    wave.args[name] = name
    fireEvent.click(getByRole('tab'))

    expect(pushMock).toHaveBeenCalledTimes(0)
  })

  it('Set args when value is updated - name not defined', () => {
    const items = [{ name: 'tab1' }, { name: 'tab2' }]
    const props = { ...tabProps, state: { items, value: 'tab1' } }
    const { rerender, getAllByRole } = render(<View {...props} />)
    expect(getAllByRole('tab')[0]).toHaveClass('is-selected')
    expect(wave.args['tab2']).toBeUndefined()

    props.state.value = 'tab2'
    rerender(<View {...props} />)
    expect(wave.args['tab2']).toBe(true)
    expect(wave.args[name]).toBeNull()
  })

  it('Set args when value is updated - name defined', () => {
    const items = [{ name: 'tab1' }, { name: 'tab2' }]
    const props = { ...tabProps, state: { items, value: 'tab1', name } }
    const { rerender, getAllByRole } = render(<View {...props} />)
    expect(getAllByRole('tab')[0]).toHaveClass('is-selected')
    expect(wave.args['tab2']).toBeUndefined()

    props.state.value = 'tab2'
    rerender(<View {...props} />)
    expect(wave.args['tab2']).toBeUndefined()
    expect(wave.args[name]).toBe('tab2')
  })

  it('Does not set args when value is updated - hash name', () => {
    const items = [{ name: '#tab1' }, { name: '#tab2' }]
    const props = { ...tabProps, state: { items, value: '#tab1' } }
    const { rerender } = render(<View {...props} />)
    expect(wave.args[name]).toBeNull()

    props.state.value = '#tab2'
    rerender(<View {...props} />)

    expect(wave.args[name]).toBeNull()
  })

  it('Selects tab when value is updated', () => {
    const items = [{ name: 'tab1' }, { name: 'tab2' }]
    const props = { ...tabProps, state: { items, value: 'tab1' } }
    const { rerender, getAllByRole } = render(<View {...props} />)
    expect(getAllByRole('tab')[0]).toHaveClass('is-selected')
    expect(getAllByRole('tab')[1]).not.toHaveClass('is-selected')

    props.state.value = 'tab2'
    rerender(<View {...props} />)
    expect(getAllByRole('tab')[0]).not.toHaveClass('is-selected')
    expect(getAllByRole('tab')[1]).toHaveClass('is-selected')
  })

  it('Selects tab when value is updated twice to the same value', () => {
    const items = [{ name: 'tab1' }, { name: 'tab2' }]
    const props = { ...tabProps, state: { items, value: 'tab1' } }
    const { rerender, getAllByRole } = render(<View {...props} />)
    expect(getAllByRole('tab')[0]).toHaveClass('is-selected')
    expect(getAllByRole('tab')[1]).not.toHaveClass('is-selected')

    props.state.value = 'tab2'
    rerender(<View {...props} />)
    expect(getAllByRole('tab')[0]).not.toHaveClass('is-selected')
    expect(getAllByRole('tab')[1]).toHaveClass('is-selected')

    fireEvent.click(getAllByRole('tab')[0])
    expect(getAllByRole('tab')[0]).toHaveClass('is-selected')
    expect(getAllByRole('tab')[1]).not.toHaveClass('is-selected')

    props.state.value = 'tab2'
    rerender(<View {...props} />)
    expect(getAllByRole('tab')[0]).not.toHaveClass('is-selected')
    expect(getAllByRole('tab')[1]).toHaveClass('is-selected')
  })

  it('Selects tab when value is updated - hash name', () => {
    const items = [{ name: '#tab1' }, { name: '#tab2' }]
    const props = { ...tabProps, state: { items, value: '#tab1' } }
    const { rerender, getAllByRole } = render(<View {...props} />)
    expect(getAllByRole('tab')[0]).toHaveClass('is-selected')
    expect(getAllByRole('tab')[1]).not.toHaveClass('is-selected')

    props.state.value = '#tab2'
    rerender(<View {...props} />)
    expect(getAllByRole('tab')[0]).not.toHaveClass('is-selected')
    expect(getAllByRole('tab')[1]).toHaveClass('is-selected')
  })

  it('Selects tab when value is updated twice to the same value - hash name', () => {
    const items = [{ name: '#tab1' }, { name: '#tab2' }]
    const props = { ...tabProps, state: { items, value: '#tab1' } }
    const { rerender, getAllByRole } = render(<View {...props} />)
    expect(getAllByRole('tab')[0]).toHaveClass('is-selected')
    expect(getAllByRole('tab')[1]).not.toHaveClass('is-selected')

    props.state.value = '#tab2'
    rerender(<View {...props} />)
    expect(getAllByRole('tab')[0]).not.toHaveClass('is-selected')
    expect(getAllByRole('tab')[1]).toHaveClass('is-selected')

    fireEvent.click(getAllByRole('tab')[0])
    expect(getAllByRole('tab')[0]).toHaveClass('is-selected')
    expect(getAllByRole('tab')[1]).not.toHaveClass('is-selected')

    props.state.value = '#tab2'
    rerender(<View {...props} />)
    expect(getAllByRole('tab')[0]).not.toHaveClass('is-selected')
    expect(getAllByRole('tab')[1]).toHaveClass('is-selected')
  })

  it('Sets url hash - hash name', () => {
    const { getByRole } = render(<View {...{ ...tabProps, state: { items: [{ name: hashName }] } }} />)
    fireEvent.click(getByRole('tab'))

    expect(window.location.hash).toBe(hashName)
  })

  it('Sets url hash when value is updated - hash name', () => {
    const items = [{ name: '#tab1' }, { name: '#tab2' }]
    const props = { ...{ ...tabProps, state: { items, value: '#tab1' } } }
    const { rerender } = render(<View {...props} />)
    expect(window.location.hash).toBe('')

    props.state.value = '#tab2'
    rerender(<View {...props} />)
    expect(window.location.hash).toBe('#tab2')
  })

  it('Sets default tab', () => {
    const items = [{ name: 'tab1' }, { name: 'tab2' }]
    const { getAllByRole } = render(<View {...{ ...tabProps, state: { items, value: 'tab2' } }} />)

    expect(getAllByRole('tab')[1]).toHaveClass('is-selected')
  })

})
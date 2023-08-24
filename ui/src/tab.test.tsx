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
  items = [{ name: 'tab1' }, { name: 'tab2' }],
  getProps = (): T.Model<any> => ({
    name,
    state: { items },
    changed: T.box(false)
  }),
  pushMock = jest.fn()

describe('Tab.tsx', () => {
  beforeAll(() => {
    wave.push = pushMock
  })
  beforeEach(() => {
    window.location.hash = ''
    wave.args = [] as any
    wave.args[name] = null
    jest.clearAllMocks()
  })

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<View {...getProps()} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Sets args and calls push on click - name is not defined', () => {
    const { getAllByRole } = render(<View {...getProps()} />)
    fireEvent.click(getAllByRole('tab')[1])

    expect(wave.args['tab2']).toBe(true)
    expect(pushMock).toHaveBeenCalledTimes(1)
  })

  it('Sets args and calls push on click - name is defined', () => {
    const { getAllByRole } = render(<View {...{ ...getProps(), state: { items, name } }} />)
    fireEvent.click(getAllByRole('tab')[1])

    expect(wave.args[name]).toBe('tab2')
    expect(wave.args['tab1']).toBeUndefined()
    expect(pushMock).toHaveBeenCalledTimes(1)
  })

  it('Does not call push on click selecting already selected', () => {
    const { getAllByRole } = render(<View {...getProps()} />)
    fireEvent.click(getAllByRole('tab')[0])

    expect(pushMock).toHaveBeenCalledTimes(0)
  })

  it('Does not set args and calls push on click - hash name', () => {
    const { getByRole } = render(<View {...{ ...getProps(), state: { items: [{ name: hashName }] } }} />)
    fireEvent.click(getByRole('tab'))

    expect(wave.args[name]).toBeNull()
    expect(pushMock).toHaveBeenCalledTimes(0)
  })

  it('Does not set args when value is updated - hash name', () => {
    const items = [{ name: '#tab1' }, { name: '#tab2' }]
    const props = { ...getProps(), state: { items, value: '#tab1' } }
    const { rerender } = render(<View {...props} />)
    expect(wave.args[name]).toBeNull()

    props.state.value = '#tab2'
    rerender(<View {...props} />)

    expect(wave.args[name]).toBeNull()
    expect(pushMock).toHaveBeenCalledTimes(0)
  })

  it('Selects tab when value is updated', () => {
    const items = [{ name: 'tab1' }, { name: 'tab2' }]
    const props = { ...getProps(), state: { items, value: 'tab1' } }
    const { rerender, getAllByRole } = render(<View {...props} />)
    expect(getAllByRole('tab')[0]).toHaveClass('is-selected')
    expect(getAllByRole('tab')[1]).not.toHaveClass('is-selected')

    props.state.value = 'tab2'
    rerender(<View {...props} />)
    expect(getAllByRole('tab')[0]).not.toHaveClass('is-selected')
    expect(getAllByRole('tab')[1]).toHaveClass('is-selected')
    expect(pushMock).toHaveBeenCalledTimes(0)
  })

  it('Selects tab when value is updated twice to the same value', () => {
    const items = [{ name: 'tab1' }, { name: 'tab2' }]
    const props = { ...getProps(), state: { items, value: 'tab1' } }
    const { rerender, getAllByRole } = render(<View {...props} />)
    expect(getAllByRole('tab')[0]).toHaveClass('is-selected')
    expect(getAllByRole('tab')[1]).not.toHaveClass('is-selected')

    props.state.value = 'tab2'
    rerender(<View {...props} />)
    expect(getAllByRole('tab')[0]).not.toHaveClass('is-selected')
    expect(getAllByRole('tab')[1]).toHaveClass('is-selected')
    expect(pushMock).toHaveBeenCalledTimes(0)

    fireEvent.click(getAllByRole('tab')[0])
    expect(getAllByRole('tab')[0]).toHaveClass('is-selected')
    expect(getAllByRole('tab')[1]).not.toHaveClass('is-selected')
    expect(pushMock).toHaveBeenCalledTimes(1)
    pushMock.mockReset()

    props.state.value = 'tab2'
    rerender(<View {...props} />)
    expect(getAllByRole('tab')[0]).not.toHaveClass('is-selected')
    expect(getAllByRole('tab')[1]).toHaveClass('is-selected')
    expect(pushMock).toHaveBeenCalledTimes(0)
  })

  it('Selects tab when value is updated - hash name', () => {
    const items = [{ name: '#tab1' }, { name: '#tab2' }]
    const props = { ...getProps(), state: { items, value: '#tab1' } }
    const { rerender, getAllByRole } = render(<View {...props} />)
    expect(getAllByRole('tab')[0]).toHaveClass('is-selected')
    expect(getAllByRole('tab')[1]).not.toHaveClass('is-selected')

    props.state.value = '#tab2'
    rerender(<View {...props} />)
    expect(getAllByRole('tab')[0]).not.toHaveClass('is-selected')
    expect(getAllByRole('tab')[1]).toHaveClass('is-selected')
    expect(pushMock).toHaveBeenCalledTimes(0)
  })

  it('Selects tab when value is updated twice to the same value - hash name', () => {
    const items = [{ name: '#tab1' }, { name: '#tab2' }]
    const props = { ...getProps(), state: { items, value: '#tab1' } }
    const { rerender, getAllByRole } = render(<View {...props} />)
    expect(getAllByRole('tab')[0]).toHaveClass('is-selected')
    expect(getAllByRole('tab')[1]).not.toHaveClass('is-selected')

    props.state.value = '#tab2'
    rerender(<View {...props} />)
    expect(getAllByRole('tab')[0]).not.toHaveClass('is-selected')
    expect(getAllByRole('tab')[1]).toHaveClass('is-selected')
    expect(pushMock).toHaveBeenCalledTimes(0)

    fireEvent.click(getAllByRole('tab')[0])
    expect(getAllByRole('tab')[0]).toHaveClass('is-selected')
    expect(getAllByRole('tab')[1]).not.toHaveClass('is-selected')
    expect(pushMock).toHaveBeenCalledTimes(0)

    props.state.value = '#tab2'
    rerender(<View {...props} />)
    expect(getAllByRole('tab')[0]).not.toHaveClass('is-selected')
    expect(getAllByRole('tab')[1]).toHaveClass('is-selected')
    expect(pushMock).toHaveBeenCalledTimes(0)
  })

  it('Sets url hash - hash name', () => {
    const { getAllByRole } = render(<View {...{ ...getProps(), state: { items: [{ name: '#hash1' }, { name: hashName }] } }} />)
    fireEvent.click(getAllByRole('tab')[1])

    expect(window.location.hash).toBe(hashName)
  })

  it('Sets default tab', () => {
    const items = [{ name: 'tab1' }, { name: 'tab2' }]
    const { getAllByRole } = render(<View {...{ ...getProps(), state: { items, value: 'tab2' } }} />)

    expect(getAllByRole('tab')[1]).toHaveClass('is-selected')
  })

  it('Sets default tab - invalid value', () => {
    const items = [{ name: 'tab1' }, { name: 'tab2' }]
    const { getAllByRole } = render(<View {...{ ...getProps(), state: { items, value: 'tab3' } }} />)

    expect(getAllByRole('tab')[0]).toHaveClass('is-selected')
  })

})
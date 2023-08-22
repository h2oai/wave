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
import { Tabs, XTabs } from './tabs'
import { wave } from './ui'

const name = 'tabs'
const hashName = `#${name}`
const tabsProps: Tabs = { name, items: [{ name }] }

describe('Tabs.tsx', () => {
  beforeEach(() => {
    wave.args = [] as any
    wave.args[name] = null
  })

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<XTabs model={tabsProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Sets args and calls sync on click', () => {
    const pushMock = jest.fn()
    wave.push = pushMock

    const { getByRole } = render(<XTabs model={tabsProps} />)
    fireEvent.click(getByRole('tab'))

    expect(wave.args[name]).toBe(name)
    expect(pushMock).toHaveBeenCalled()
  })

  it('Does not call sync on click - args not changed', () => {
    const pushMock = jest.fn()
    wave.push = pushMock

    const { getByRole } = render(<XTabs model={tabsProps} />)
    wave.args[name] = name
    fireEvent.click(getByRole('tab'))

    expect(pushMock).toHaveBeenCalledTimes(0)
  })

  it('Set args when value is updated', () => {
    const items = [{ name: 'tab1' }, { name: 'tab2' }]
    const props = { ...tabsProps, items, value: 'tab1' }
    const { rerender, getAllByRole } = render(<XTabs model={props} />)
    expect(getAllByRole('tab')[0]).toHaveClass('is-selected')
    expect(wave.args['tab2']).toBeUndefined()

    props.value = 'tab2'
    rerender(<XTabs model={props} />)
    expect(wave.args[name]).toBe('tab2')
    expect(wave.args['tab2']).toBeUndefined()
  })

  it('Set args when value is updated - name is an empty string', () => {
    const items = [{ name: 'tab1' }, { name: 'tab2' }]
    const props = { ...tabsProps, items, value: 'tab1', name: '' }
    const { rerender, getAllByRole } = render(<XTabs model={props} />)
    expect(getAllByRole('tab')[0]).toHaveClass('is-selected')
    expect(wave.args['tab2']).toBeUndefined()

    props.value = 'tab2'
    rerender(<XTabs model={props} />)
    expect(wave.args[name]).toBeUndefined()
    expect(wave.args['tab2']).toBe(true)
  })

  it('Does not set args when value is updated - hash name', () => {
    const items = [{ name: '#tab1' }, { name: '#tab2' }]
    const props = { ...tabsProps, items, value: '#tab1' }
    const { rerender } = render(<XTabs model={props} />)
    expect(wave.args[name]).toBeNull()

    props.value = '#tab2'
    rerender(<XTabs model={props} />)

    expect(wave.args[name]).toBeNull()
  })

  it('Selects tab when value is updated', () => {
    const items = [{ name: 'tab1' }, { name: 'tab2' }]
    const props = { ...tabsProps, items, value: 'tab1' }
    const { rerender, getAllByRole } = render(<XTabs model={props} />)
    expect(getAllByRole('tab')[0]).toHaveClass('is-selected')
    expect(getAllByRole('tab')[1]).not.toHaveClass('is-selected')

    props.value = 'tab2'
    rerender(<XTabs model={props} />)
    expect(getAllByRole('tab')[0]).not.toHaveClass('is-selected')
    expect(getAllByRole('tab')[1]).toHaveClass('is-selected')
  })

  it('Selects tab when value is updated twice to the same value', () => {
    const items = [{ name: 'tab1' }, { name: 'tab2' }]
    const props = { ...tabsProps, items, value: 'tab1' }
    const { rerender, getAllByRole } = render(<XTabs model={props} />)
    expect(getAllByRole('tab')[0]).toHaveClass('is-selected')
    expect(getAllByRole('tab')[1]).not.toHaveClass('is-selected')

    props.value = 'tab2'
    rerender(<XTabs model={props} />)
    expect(getAllByRole('tab')[0]).not.toHaveClass('is-selected')
    expect(getAllByRole('tab')[1]).toHaveClass('is-selected')

    fireEvent.click(getAllByRole('tab')[0])
    expect(getAllByRole('tab')[0]).toHaveClass('is-selected')
    expect(getAllByRole('tab')[1]).not.toHaveClass('is-selected')

    props.value = 'tab2'
    rerender(<XTabs model={props} />)
    expect(getAllByRole('tab')[0]).not.toHaveClass('is-selected')
    expect(getAllByRole('tab')[1]).toHaveClass('is-selected')
  })

  it('Selects tab when value is updated - hash name', () => {
    const items = [{ name: '#tab1' }, { name: '#tab2' }]
    const props = { ...tabsProps, items, value: '#tab1' }
    const { rerender, getAllByRole } = render(<XTabs model={props} />)
    expect(getAllByRole('tab')[0]).toHaveClass('is-selected')
    expect(getAllByRole('tab')[1]).not.toHaveClass('is-selected')

    props.value = '#tab2'
    rerender(<XTabs model={props} />)
    expect(getAllByRole('tab')[0]).not.toHaveClass('is-selected')
    expect(getAllByRole('tab')[1]).toHaveClass('is-selected')
  })

  it('Selects tab when value is updated twice to the same value - hash name', () => {
    const items = [{ name: '#tab1' }, { name: '#tab2' }]
    const props = { ...tabsProps, items, value: '#tab1' }
    const { rerender, getAllByRole } = render(<XTabs model={props} />)
    expect(getAllByRole('tab')[0]).toHaveClass('is-selected')
    expect(getAllByRole('tab')[1]).not.toHaveClass('is-selected')

    props.value = '#tab2'
    rerender(<XTabs model={props} />)
    expect(getAllByRole('tab')[0]).not.toHaveClass('is-selected')
    expect(getAllByRole('tab')[1]).toHaveClass('is-selected')

    fireEvent.click(getAllByRole('tab')[0])
    expect(getAllByRole('tab')[0]).toHaveClass('is-selected')
    expect(getAllByRole('tab')[1]).not.toHaveClass('is-selected')

    props.value = '#tab2'
    rerender(<XTabs model={props} />)
    expect(getAllByRole('tab')[0]).not.toHaveClass('is-selected')
    expect(getAllByRole('tab')[1]).toHaveClass('is-selected')
  })

  it('Sets url hash - hash name', () => {
    const { getByRole } = render(<XTabs model={{ ...tabsProps, items: [{ name: hashName }] }} />)
    fireEvent.click(getByRole('tab'))

    expect(window.location.hash).toBe(hashName)
  })

  it('Sets url hash when value is updated - hash name', () => {
    window.location.hash = ''
    const items = [{ name: '#tab1' }, { name: '#tab2' }]
    const props = { ...{ ...tabsProps, items, value: '#tab1' } }
    const { rerender } = render(<XTabs model={props} />)
    expect(window.location.hash).toBe('')

    props.value = '#tab2'
    rerender(<XTabs model={props} />)
    expect(window.location.hash).toBe('#tab2')
  })

  it('Sets default tab', () => {
    const items = [{ name: 'tab1' }, { name: 'tab2' }]
    const { getAllByRole } = render(<XTabs model={{ ...tabsProps, items, value: 'tab2' }} />)

    expect(getAllByRole('tab')[1]).toHaveClass('is-selected')
  })

})
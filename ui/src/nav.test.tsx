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
import { State, View } from './nav'
import { wave } from './ui'

const
  name = 'nav',
  label = 'label',
  items = [{
    label: 'group1',
    items: [
      { name: 'nav1', label: 'Nav 1' },
      { name: 'nav2', label: 'Nav 2' }
    ]
  }],
  hashItems = [{
    label: 'group1',
    items: [
      { name: '#nav1', label: 'Nav 1' },
      { name: '#nav2', label: 'Nav 2' }
    ]
  }],
  navProps: T.Model<State> = {
    name,
    state: { items },
    changed: T.box(false)
  },
  navPropsHash: T.Model<State> = {
    name,
    state: { items: hashItems },
    changed: T.box(false)
  }
describe('Nav.tsx', () => {
  beforeEach(() => {
    wave.args = [] as any
    window.location.hash = ''
  })

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<View {...navProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Sets args - init', () => {
    render(<View {...navProps} />)
    expect(wave.args[name]).toBeUndefined()
  })

  it('Makes link active when value specified', () => {
    const props: T.Model<State> = { ...navProps, state: { ...navProps.state, value: 'nav1' } }
    const { getByTitle } = render(<View {...props} />)
    expect(getByTitle('Nav 1').parentElement).toHaveClass('is-selected')
  })

  it('Makes link inactive when disabled is true', () => {
    const props: T.Model<State> = {
      ...navProps,
      state: {
        items: [
          { label: 'group1', items: [{ name, label, disabled: true }] }
        ]
      },
    }
    const { getByTitle } = render(<View {...props} />)
    expect(getByTitle(label).parentElement).toHaveClass('is-disabled')
  })

  it('Sets args and calls sync on click', () => {
    const pushMock = jest.fn()
    wave.push = pushMock

    const { getByTitle } = render(<View {...navProps} />)
    fireEvent.click(getByTitle('Nav 1'))

    expect(wave.args['nav1']).toBe(true)
    expect(pushMock).toHaveBeenCalled()
  })

  it('Does not set args and calls sync on click when name starts with hash', () => {
    const pushMock = jest.fn()
    wave.push = pushMock

    const { getByTitle } = render(<View {...navPropsHash} />)
    fireEvent.click(getByTitle('Nav 1'))

    expect(wave.args['nav1']).toBeUndefined()
    expect(pushMock).toHaveBeenCalledTimes(0)
  })

  it('Sets window location hash when name starts with hash', () => {
    const { getByTitle } = render(<View {...navPropsHash} />)
    fireEvent.click(getByTitle('Nav 1'))

    expect(window.location.hash).toBe('#nav1')
  })

  it('Collapses a group when collapse is specified', () => {
    const props = {
      ...navProps,
      state: {
        items: [
          { label: 'group1', items: [{ name, label }], collapsed: true }
        ]
      },
    }
    const { container } = render(<View {...props} />)
    expect(container.querySelector('.is-expanded')).not.toBeInTheDocument()
  })

  it('Does redirect if path is specified', () => {
    const
      props = {
        ...navProps,
        state: {
          items: [
            { label: 'group1', items: [{ name, label, path: 'https://h2o.ai/' }] }
          ]
        },
      },
      windowOpenMock = jest.fn(),
      { getByTitle } = render(<View {...props} />)

    window.open = windowOpenMock
    fireEvent.click(getByTitle(label))
    expect(windowOpenMock).toHaveBeenCalled()
  })

  describe('Value update', () => {
    it('Sets args on value update', () => {
      const props: T.Model<State> = { ...navProps, state: { items } }
      const { rerender } = render(<View {...props} />)
      expect(wave.args['nav2']).toBeUndefined()

      props.state.value = 'nav2'
      rerender(<View {...props} />)

      expect(wave.args['nav2']).toBe(true)
    })

    it('Selects nav item on value update', () => {
      const props: T.Model<State> = { ...navProps, state: { items } }
      const { rerender, getByTitle } = render(<View {...props} />)
      expect(getByTitle('Nav 1').parentElement).toHaveClass('is-selected')
      expect(getByTitle('Nav 2').parentElement).not.toHaveClass('is-selected')

      props.state.value = 'nav2'
      rerender(<View {...props} />)

      expect(getByTitle('Nav 1').parentElement).not.toHaveClass('is-selected')
      expect(getByTitle('Nav 2').parentElement).toHaveClass('is-selected')
    })

    it('Selects nav item when value is updated to the same value twice', () => {
      const
        props: T.Model<State> = { ...navProps, state: { items } },
        checkIfFirstItemIsSelected = () => {
          expect(getByTitle('Nav 1').parentElement).toHaveClass('is-selected')
          expect(getByTitle('Nav 2').parentElement).not.toHaveClass('is-selected')
        },
        checkIfSecondItemIsSelected = () => {
          expect(getByTitle('Nav 1').parentElement).not.toHaveClass('is-selected')
          expect(getByTitle('Nav 2').parentElement).toHaveClass('is-selected')
        },
        { rerender, getByTitle } = render(<View {...props} />)

      checkIfFirstItemIsSelected()

      props.state.value = 'nav2'
      rerender(<View {...props} />)
      expect(wave.args['nav2']).toBe(true)
      checkIfSecondItemIsSelected()

      fireEvent.click(getByTitle('Nav 1'))
      expect(wave.args['nav1']).toBe(true)
      checkIfFirstItemIsSelected()

      props.state.value = 'nav2'
      rerender(<View {...props} />)
      expect(wave.args['nav2']).toBe(true)
      checkIfSecondItemIsSelected()
    })

    it('Does not set args on value update when name starts with hash', () => {
      const props: T.Model<State> = { ...navProps, state: { items: hashItems } }
      const { rerender } = render(<View {...props} />)
      expect(wave.args['nav2']).toBeUndefined()

      props.state.value = '#nav2'
      rerender(<View {...props} />)

      expect(wave.args['nav2']).toBeUndefined()
    })

    it('Set window location hash when updated value starts with hash', () => {
      const props: T.Model<State> = { ...navProps, state: { items: hashItems } }
      const { rerender } = render(<View {...props} />)
      expect(window.location.hash).toBe('')

      props.state.value = '#nav2'
      rerender(<View {...props} />)

      expect(window.location.hash).toBe('#nav2')
    })
  })
})
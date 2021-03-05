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
import { View, State } from './nav'
import * as T from './qd'
import { resetArgs } from './setupTests'

const
  name = 'nav',
  hashName = `#${name}`,
  label = 'label',
  navProps: T.Card<State> = {
    name,
    state: {
      items: [
        { label: 'group1', items: [{ name, label }] }
      ]
    },
    changed: T.box(false)
  },
  navPropsHash: T.Card<State> = {
    name,
    state: {
      items: [
        { label: 'group1', items: [{ name: hashName, label }] }
      ]
    },
    changed: T.box(false)
  }
describe('Nav.tsx', () => {
  beforeEach(resetArgs)

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<View {...navProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Makes link active when value specified', () => {
    const props: T.Card<State> = { ...navProps, state: { ...navProps.state, value: name } }
    const { getByTitle } = render(<View {...props} />)
    expect(getByTitle(label).parentElement).toHaveClass('is-selected')
  })

  it('Allows further user clicks after initial value', () => {
    const syncMock = jest.fn()
    T.qd.sync = syncMock
    const props: T.Card<State> = {
      ...navProps, state: {
        value: 'eggs', items: [
          {
            label: 'group1', items: [
              { name: 'ham', label: 'Ham' },
              { name: 'spam', label: 'Spam' },
              { name: 'eggs', label: 'Eggs' },
            ]
          }
        ]
      }
    }
    const { getByTitle } = render(<View {...props} />)
    expect(getByTitle('Eggs').parentElement).toHaveClass('is-selected')
    fireEvent.click(getByTitle('Ham'))
    expect(getByTitle('Ham').parentElement).toHaveClass('is-selected')
    expect(syncMock).toHaveBeenCalled()
    expect(T.qd.args['ham']).toBe(true)
  })

  it('Does not allow further user clicks after explicit value change', () => {
    const syncMock = jest.fn()
    T.qd.sync = syncMock
    const props: T.Card<State> = {
      ...navProps, state: {
        value: 'eggs', items: [
          {
            label: 'group1', items: [
              { name: 'ham', label: 'Ham' },
              { name: 'spam', label: 'Spam' },
              { name: 'eggs', label: 'Eggs' },
            ]
          }
        ]
      }
    }
    const { container, getByTitle } = render(<View {...props} />)
    expect(getByTitle('Eggs').parentElement).toHaveClass('is-selected')

    props.state.value = 'spam'
    render(<View {...props} />, { container })

    // Triggers qd.sync() on explicit value change.
    expect(getByTitle('Spam').parentElement).toHaveClass('is-selected')
    expect(syncMock).toHaveBeenCalled()
    expect(T.qd.args['spam']).toBe(true)

    syncMock.mockReset()
    fireEvent.click(getByTitle('Ham'))

    expect(getByTitle('Ham').parentElement).not.toHaveClass('is-selected')
    expect(syncMock).not.toHaveBeenCalled()
    expect(T.qd.args['ham']).not.toBe(true)
  })
  it('Makes link inactive when disabled is true', () => {
    const props: T.Card<State> = {
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
    const syncMock = jest.fn()
    T.qd.sync = syncMock

    const { getByTitle } = render(<View {...navProps} />)
    fireEvent.click(getByTitle(label))

    expect(T.qd.args[name]).toBe(true)
    expect(syncMock).toHaveBeenCalled()
  })

  it('Does not set args and calls sync on click when name starts with hash', () => {
    const syncMock = jest.fn()
    T.qd.sync = syncMock

    const { getByTitle } = render(<View {...navPropsHash} />)
    fireEvent.click(getByTitle(label))

    expect(T.qd.args[name]).toBeUndefined()
    expect(syncMock).toHaveBeenCalledTimes(0)
  })

  it('Does set window window location hash when name starts with hash', () => {
    const { getByTitle } = render(<View {...navPropsHash} />)
    fireEvent.click(getByTitle(label))

    expect(window.location.hash).toBe(hashName)
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
})
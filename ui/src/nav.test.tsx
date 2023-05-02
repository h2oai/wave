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
  hashName = `#${name}`,
  label = 'label',
  navProps: T.Model<State> = {
    name,
    state: {
      items: [
        { label: 'group1', items: [{ name, label }] }
      ]
    },
    changed: T.box(false)
  },
  navPropsHash: T.Model<State> = {
    name,
    state: {
      items: [
        { label: 'group1', items: [{ name: hashName, label }] }
      ]
    },
    changed: T.box(false)
  }
describe('Nav.tsx', () => {
  beforeEach(() => { wave.args[name] = null })

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<View {...navProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Sets args - init', () => {
    render(<View {...navProps} />)
    expect(wave.args[name]).toBeNull()
  })

  it('Makes link active when value specified', () => {
    const props: T.Model<State> = { ...navProps, state: { ...navProps.state, value: name } }
    const { getByTitle } = render(<View {...props} />)
    expect(getByTitle(label).parentElement).toHaveClass('is-selected')
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
    fireEvent.click(getByTitle(label))

    expect(wave.args[name]).toBe(true)
    expect(pushMock).toHaveBeenCalled()
  })

  it('Does not set args and calls sync on click when name starts with hash', () => {
    const pushMock = jest.fn()
    wave.push = pushMock

    const { getByTitle } = render(<View {...navPropsHash} />)
    fireEvent.click(getByTitle(label))

    expect(wave.args[name]).toBeNull()
    expect(pushMock).toHaveBeenCalledTimes(0)
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
})
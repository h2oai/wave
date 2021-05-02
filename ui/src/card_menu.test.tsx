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
import React from 'react'
import { CardMenu } from './card_menu'
import { box } from './qd'

const name = 'card'
describe('CardMenu.tsx', () => {
  beforeAll(() => initializeIcons())

  it('Does not render data-test attr', () => {
    const { container } = render(<CardMenu commands={[{ name }]} changedB={box(false)} />)
    expect(container.querySelectorAll('[data-test]')).toHaveLength(0)
  })

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<CardMenu name={name} commands={[{ name }]} changedB={box(false)} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Renders menu when commands are specified', () => {
    const { queryByTestId } = render(<CardMenu name={name} commands={[{ name }]} changedB={box(false)} />)
    expect(queryByTestId(name)).toBeTruthy()
  })

  it('Does not change hash when command name does not start with #', () => {
    const { getByTestId, getByText } = render(<CardMenu name={name} commands={[{ name }]} changedB={box(false)} />)

    fireEvent.click(getByTestId(name))
    fireEvent.click(getByText('card'))

    expect(window.location.hash).toBe('')
  })

  it('Changes hash when command name starts with #', () => {
    const { getByTestId, getByText } = render(<CardMenu name={name} commands={[{ name: '#card' }]} changedB={box(false)} />)

    fireEvent.click(getByTestId(name))
    fireEvent.click(getByText('#card'))

    expect(window.location.hash).toBe('#card')
  })
})
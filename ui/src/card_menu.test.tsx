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
import { Card, box } from './core'
import React from 'react'
import { CardMenu } from './card_menu'

const name = 'card'
let card: Card
describe('CardMenu.tsx', () => {
  beforeEach(() => {
    card = {
      name,
      changed: box(false),
      state: { commands: [{ name }], },
      id: 'id',
      set: jest.fn(),
    }
  })
  it('Does not render data-test attr', () => {
    // @ts-ignore
    card.name = undefined
    const { container } = render(<CardMenu card={card} />)
    expect(container.querySelectorAll('[data-test]')).toHaveLength(0)
  })

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<CardMenu card={card} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Renders menu when commands are specified', () => {
    const { queryByTestId } = render(<CardMenu card={card} />)
    expect(queryByTestId(name)).toBeTruthy()
  })

  it('Does not change hash when command name does not start with #', () => {
    const { getByTestId, getByText } = render(<CardMenu card={card} />)

    fireEvent.click(getByTestId(name))
    fireEvent.click(getByText('card'))

    expect(window.location.hash).toBe('')
  })

  it('Changes hash when command name starts with #', () => {
    card.state.commands = [{ name: '#card' }]
    const { getByTestId, getByText } = render(<CardMenu card={card} />)

    fireEvent.click(getByTestId(name))
    fireEvent.click(getByText('#card'))

    expect(window.location.hash).toBe('#card')
  })
})
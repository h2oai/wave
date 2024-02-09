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
import { wave } from './ui'

const name = 'card'
const path = 'https://wave.h2o.ai/img/logo.svg'
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
    wave.args[name] = null
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

  it('Does not set args or calls sync on click when command has download link specified', () => {
    const pushMock = jest.fn()
    wave.push = pushMock
    card.state.commands = [{ name: 'card', download: true, path, value: 'value' }]
    const { getByTestId, getByText } = render(<CardMenu card={card} />)
    fireEvent.click(getByTestId(name))
    fireEvent.click(getByText('card'))

    expect(pushMock).not.toHaveBeenCalled()
    expect(wave.args[name]).toBeNull()
  })

  it('Ignores items when command has download link specified', () => {
    card.state.commands = [
      { name: 'command1', items: [{ name: 'subcommand1', label: "Subcommand 1" }] },
      { name: 'command2', path, download: true, items: [{ name: 'subcommand2', label: "Subcommand 2" }] }
    ]
    const { container, queryByText } = render(<CardMenu card={card} />)

    const contextMenuButton = container.querySelectorAll('i[data-icon-name="MoreVertical"]')[0] as HTMLLIElement
    fireEvent.click(contextMenuButton)

    expect(queryByText('Subcommand 1')).not.toBeInTheDocument()
    const menuItem1 = document.querySelectorAll('button.ms-ContextualMenu-link')[0] as HTMLButtonElement
    fireEvent.click(menuItem1)
    expect(queryByText('Subcommand 1')).toBeInTheDocument()

    expect(queryByText('Subcommand 2')).not.toBeInTheDocument()
    const menuItem2 = document.querySelectorAll('button.ms-ContextualMenu-link')[1] as HTMLButtonElement
    fireEvent.click(menuItem2)
    expect(queryByText('Subcommand 2')).not.toBeInTheDocument()
  })

  it('Opens link in a new tab when command has path specified', () => {
    const windowOpenMock = jest.fn()
    window.open = windowOpenMock
    card.state.commands = [{ name: 'card', path }]
    const { getByTestId, getByText } = render(<CardMenu card={card} />)

    fireEvent.click(getByTestId(name))
    fireEvent.click(getByText('card'))

    expect(windowOpenMock).toHaveBeenCalled()
    expect(windowOpenMock).toHaveBeenCalledWith(path, '_blank')
  })
})
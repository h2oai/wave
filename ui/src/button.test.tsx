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
import { Buttons, MiniButtons, XButtons, XMiniButtons } from './button'
import { wave } from './ui'

const
  name = 'test-btn',
  hashName = `#${name}`,
  btnProps: Buttons = { items: [{ button: { name, label: name } }] },
  btnPropsNameHash: Buttons = { items: [{ button: { name: hashName, label: name } }] },
  pushMock = jest.fn()

wave.push = pushMock
describe('Button.tsx', () => {
  beforeEach(() => {
    window.location.hash = ''
    wave.args[name] = null
    pushMock.mockClear()
  })

  describe('Regular button', () => {
    it('Renders data-test attr for Buttons', () => {
      const { queryByTestId } = render(<XButtons model={{ items: [], name }} />)
      expect(queryByTestId(name)).toBeInTheDocument()
    })

    it('Renders data-test attr for Button', () => {
      const { queryByTestId } = render(<XButtons model={btnProps} />)
      expect(queryByTestId(name)).toBeInTheDocument()
    })

    it('Sets correct state after click', () => {
      const { getByText } = render(<XButtons model={btnProps} />)

      fireEvent.click(getByText(name))

      expect(pushMock).toHaveBeenCalled()
      expect(wave.args[name]).toBe(true)
      expect(window.location.hash).toBe('')
    })

    it('Sets args after click - specified value', () => {
      const { getByText } = render(<XButtons model={{ items: [{ button: { name, label: name, value: 'val' } }] }} />)
      fireEvent.click(getByText(name))

      expect(wave.args[name]).toBe('val')
    })

    it('Sets correct state when name starts with #', () => {
      const { getByText } = render(<XButtons model={btnPropsNameHash} />)
      fireEvent.click(getByText(name))

      expect(window.location.hash).toBe(hashName)
      expect(pushMock).toHaveBeenCalledTimes(0)
      expect(wave.args[name]).toBe(null)
    })

    it('Renders a link when specified', () => {
      const btnLinkProps: Buttons = { items: [{ button: { name, label: name, link: true } }] }
      const { getByTestId } = render(<XButtons model={btnLinkProps} />)

      expect(getByTestId(name)).toHaveClass('ms-Link')
    })

    it('Does not render a link when not specified', () => {
      const { queryByTestId } = render(<XButtons model={btnProps} />)

      expect(queryByTestId(name)).not.toHaveClass('ms-Link')
    })

    it('Does redirect if path is specified', () => {
      const
        windowOpenMock = jest.fn(),
        { getByTestId } = render(<XButtons model={{ items: [{ button: { name, label: name, path: 'https://h2o.ai/' } }] }} />)

      window.open = windowOpenMock
      fireEvent.click(getByTestId(name))
      expect(windowOpenMock).toHaveBeenCalled()
    })
  })

  describe('Mini button', () => {
    const
      miniBtns: MiniButtons = { items: [{ mini_button: { name, label: name } }] },
      miniBtnsNameHash: MiniButtons = { items: [{ mini_button: { name: `#${name}`, label: name } }] }

    it('Renders data-test attr for MiniButton', () => {
      const { queryByTestId } = render(<XMiniButtons model={miniBtns} />)
      expect(queryByTestId(name)).toBeInTheDocument()
    })

    it('Calls sync() after click', () => {
      const { getByText } = render(<XMiniButtons model={miniBtns} />)

      fireEvent.click(getByText(name))

      expect(pushMock).toHaveBeenCalled()
      expect(wave.args[name]).toBe(true)
      expect(window.location.hash).toBe('')
    })

    it('Sets window.location hash when name starts with #', () => {
      const { getByText } = render(<XMiniButtons model={miniBtnsNameHash} />)
      fireEvent.click(getByText(name))

      expect(window.location.hash).toBe(hashName)
      expect(pushMock).toHaveBeenCalledTimes(0)
      expect(wave.args[name]).toBe(null)
    })
  })

  describe('Commands button', () => {
    const path = 'https://wave.h2o.ai/img/logo.svg'
    const buttonProps = {
      items: [{
        button: {
          name,
          label: name,
          commands: [
            { name: 'command1', label: 'Command 1' },
            { name: 'command2', label: 'Command 2' },
          ]
        }
      }]
    }

    it('Renders the context menu with specified items', () => {
      const { container, queryByText, queryByRole } = render(<XButtons model={buttonProps} />)

      expect(queryByRole('menu')).not.toBeInTheDocument()
      expect(queryByText('Command 1')).not.toBeInTheDocument()
      expect(queryByText('Command 2')).not.toBeInTheDocument()

      const contextMenuButton = container.querySelector('i[data-icon-name="ChevronDown"]') as HTMLLIElement
      fireEvent.click(contextMenuButton)

      expect(queryByRole('menu')).toBeInTheDocument()
      expect(queryByText('Command 1')).toBeInTheDocument()
      expect(queryByText('Command 2')).toBeInTheDocument()
    })

    it('Sets args after click', () => {
      const { container, getByText } = render(<XButtons model={buttonProps} />)

      expect(wave.args[name]).toBe(false)
      fireEvent.click(getByText(name))
      expect(wave.args[name]).toBe(true)

      const contextMenuButton = container.querySelector('i[data-icon-name="ChevronDown"]') as HTMLLIElement

      expect(wave.args['command1']).toBe(false)
      fireEvent.click(contextMenuButton)
      fireEvent.click(getByText('Command 1'))
      expect(wave.args['command1']).toBe(true)

      expect(wave.args['command2']).toBe(false)
      fireEvent.click(contextMenuButton)
      fireEvent.click(getByText('Command 2'))
      expect(wave.args['command2']).toBe(true)
    })

    it('Sets args after click - specified value', () => {
      const buttonValueProps = {
        items: [{
          button: {
            name,
            label: name,
            value: 'val',
            commands: [
              { name: 'command1', label: 'Command 1', value: 'commandVal1' },
              { name: 'command2', label: 'Command 2', value: 'commandVal2' },
            ]
          }
        }]
      }
      const { container, getByText } = render(<XButtons model={buttonValueProps} />)

      expect(wave.args[name]).toBe(false)
      fireEvent.click(getByText(name))
      expect(wave.args[name]).toBe('val')

      const contextMenuButton = container.querySelector('i[data-icon-name="ChevronDown"]') as HTMLLIElement

      expect(wave.args['command1']).toBe(false)
      fireEvent.click(contextMenuButton)
      fireEvent.click(getByText('Command 1'))
      expect(wave.args['command1']).toBe('commandVal1')

      expect(wave.args['command2']).toBe(false)
      fireEvent.click(contextMenuButton)
      fireEvent.click(getByText('Command 2'))
      expect(wave.args['command2']).toBe('commandVal2')
    })

    it('Sets correct state when name starts with #', () => {
      const btnNameHashProps = {
        items: [{
          button: {
            name: hashName,
            label: name,
            value: 'val',
            commands: [
              { name: '#command1', label: 'Command 1', value: 'commandVal1' },
              { name: '#command2', label: 'Command 2', value: 'commandVal2' },
            ]
          }
        }]
      }
      const { getByText, container } = render(<XButtons model={btnNameHashProps} />)

      fireEvent.click(getByText(name))
      expect(window.location.hash).toBe(hashName)
      expect(pushMock).toHaveBeenCalledTimes(0)
      expect(wave.args[name]).toBe(null)

      const contextMenuButton = container.querySelector('i[data-icon-name="ChevronDown"]') as HTMLLIElement

      fireEvent.click(contextMenuButton)
      fireEvent.click(getByText('Command 1'))
      expect(window.location.hash).toBe('#command1')
      expect(pushMock).toHaveBeenCalledTimes(0)
      expect(wave.args['#command1']).toBe(false)
    })

    it('Does not render commands when link specified', () => {
      const btnLinkProps: Buttons = {
        items: [{
          button: {
            name,
            label: name,
            link: true,
            commands: [
              { name: 'command1', label: 'Command 1' },
              { name: 'command2', label: 'Command 2' },
            ]
          }
        }]
      }
      const { container, getByTestId } = render(<XButtons model={btnLinkProps} />)

      expect(getByTestId(name)).toHaveClass('ms-Link')
      expect(container.querySelector('i[data-icon-name="ChevronDown"]') as HTMLLIElement).not.toBeInTheDocument()
    })

    it('Does not set args or calls sync on click when command has download link specified', () => {
      const
        btnCommandDownloadProps: Buttons = {
          items: [{
            button: {
              name,
              label: name,
              commands: [
                { name: 'command1', label: 'Command 1' },
                { name: 'command2', label: 'Command 2', path, download: true },
              ]
            }
          }]
        },
        { container, getByText } = render(<XButtons model={btnCommandDownloadProps} />),
        contextMenuButton = container.querySelector('i[data-icon-name="ChevronDown"]') as HTMLLIElement

      expect(wave.args['command1']).toBe(false)
      fireEvent.click(contextMenuButton)
      fireEvent.click(getByText('Command 1'))
      expect(wave.args['command1']).toBe(true)

      expect(pushMock).toHaveBeenCalled()
      expect(pushMock).toHaveBeenCalledTimes(1)

      expect(wave.args['command2']).toBe(false)
      fireEvent.click(contextMenuButton)
      fireEvent.click(getByText('Command 2'))
      expect(wave.args['command2']).toBe(false)

      expect(pushMock).toHaveBeenCalledTimes(1)
    })

    it('Ignores items when command has download link specified', () => {
      const
        btnCommandDownloadProps: Buttons = {
          items: [{
            button: {
              name,
              label: name,
              commands: [
                { name: 'command1', label: 'Command 1', items: [{ name: 'commandItem1', label: 'Command item 1' }] },
                { name: 'command2', label: 'Command 2', path, download: true, items: [{ name: 'commandItem2', label: 'Command item 2' }] },
              ]
            }
          }]
        },
        { container, queryByText } = render(<XButtons model={btnCommandDownloadProps} />),
        contextMenuButton = container.querySelector('i[data-icon-name="ChevronDown"]') as HTMLLIElement

      fireEvent.click(contextMenuButton)

      expect(queryByText('Command item 1')).not.toBeInTheDocument()
      const menuItem1 = document.querySelectorAll('button.ms-ContextualMenu-link')[0] as HTMLButtonElement
      fireEvent.click(menuItem1)
      expect(queryByText('Command item 1')).toBeInTheDocument()

      expect(queryByText('Command item 2')).not.toBeInTheDocument()
      const menuItem2 = document.querySelectorAll('button.ms-ContextualMenu-link')[1] as HTMLButtonElement
      fireEvent.click(menuItem2)
      expect(queryByText('Command item 2')).not.toBeInTheDocument()
    })

    it('Opens link in a new tab when command has path specified', () => {
      const windowOpenMock = jest.fn()
      window.open = windowOpenMock
      const
        btnCommandDownloadProps: Buttons = {
          items: [{
            button: {
              name,
              label: name,
              commands: [
                { name: 'command', label: 'Command', path },
              ]
            }
          }]
        },
        { container, getByText } = render(<XButtons model={btnCommandDownloadProps} />),
        contextMenuButton = container.querySelector('i[data-icon-name="ChevronDown"]') as HTMLLIElement

      fireEvent.click(contextMenuButton)
      fireEvent.click(getByText('Command'))

      expect(windowOpenMock).toHaveBeenCalled()
      expect(windowOpenMock).toHaveBeenCalledWith(path, '_blank')
    })
  })
})
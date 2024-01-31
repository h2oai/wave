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
import userEvent from '@testing-library/user-event'
import React from 'react'
import { Textbox, XTextbox } from './textbox'
import { wave } from './ui'

const
  name = 'textbox',
  pushMock = jest.fn()
let textboxProps: Textbox = { name }
wave.push = pushMock

describe('Textbox.tsx', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
    // Because we mutate props to programatically change "value" from Wave app we need to reset it before every test
    textboxProps = { name }
  })

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<XTextbox model={textboxProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Renders data-test attr - masked', () => {
    const { queryByTestId } = render(<XTextbox model={{ ...textboxProps, mask: 'mask' }} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Sets args - init - no value specified', () => {
    render(<XTextbox model={textboxProps} />)
    expect(wave.args[name]).toBe('')
  })

  it('Sets args - init - value specified', () => {
    render(<XTextbox model={{ ...textboxProps, value: 'text' }} />)
    expect(wave.args[name]).toBe('text')
  })


  it('Sets args on input', () => {
    const { getByTestId } = render(<XTextbox model={textboxProps} />)
    fireEvent.change(getByTestId(name), { target: { value: 'text' } })
    jest.runOnlyPendingTimers()

    expect(wave.args[name]).toBe('text')
  })

  it('Sets args on input - undefined value, no default value specified', () => {
    const { getByTestId } = render(<XTextbox model={textboxProps} />)
    fireEvent.change(getByTestId(name), { target: { value: undefined } })

    expect(wave.args[name]).toBe('')
  })

  it('Sets args on input - undefined value, default value specified', () => {
    const { getByTestId } = render(<XTextbox model={{ ...textboxProps, value: 'default' }} />)
    fireEvent.change(getByTestId(name), { target: { value: undefined } })

    expect(wave.args[name]).toBe('default')
  })

  it('Sets args when "value" prop changes', () => {
    const { rerender } = render(<XTextbox model={{ ...textboxProps, value: 'a' }} />)
    expect(wave.args[name]).toBe('a')

    rerender(<XTextbox model={{ ...textboxProps, value: 'b' }} />)
    expect(wave.args[name]).toBe('b')
  })

  it('Sets args when typing new text and then "value" prop changes', () => {
    const { getByTestId, rerender } = render(<XTextbox model={{ ...textboxProps, value: 'a' }} />)
    expect(wave.args[name]).toBe('a')

    userEvent.type(getByTestId(name), '{backspace}b')
    expect(wave.args[name]).toBe('b')

    rerender(<XTextbox model={{ ...textboxProps, value: 'c' }} />)
    expect(wave.args[name]).toBe('c')
  })

  it('Calls sync on change - trigger specified', () => {
    const { getByTestId } = render(<XTextbox model={{ ...textboxProps, trigger: true }} />)

    fireEvent.change(getByTestId(name), { target: { value: 'aaa' } })

    expect(pushMock).not.toBeCalled() // Not called immediately, but after specified timeout.
    jest.runOnlyPendingTimers()
    expect(pushMock).toBeCalledTimes(1)
  })

  it('Debounces wave push', () => {
    const { getByTestId } = render(<XTextbox model={{ ...textboxProps, trigger: true }} />)

    userEvent.type(getByTestId(name), 'a')
    userEvent.type(getByTestId(name), 'a')
    userEvent.type(getByTestId(name), 'a')
    userEvent.type(getByTestId(name), 'a')
    jest.runOnlyPendingTimers()

    expect(pushMock).toBeCalledTimes(1)
  })

  it('Does not call sync on change - trigger not specified', () => {
    const { getByTestId } = render(<XTextbox model={textboxProps} />)

    fireEvent.change(getByTestId(name), { target: { value: 'aaa' } })

    expect(pushMock).not.toBeCalled()
  })

  it('Display new value when "value" prop changes', () => {
    const { getByTestId, rerender } = render(<XTextbox model={{ ...textboxProps, value: 'A' }} />)
    expect(getByTestId(name)).toHaveValue('A')

    rerender(<XTextbox model={{ ...textboxProps, value: 'B' }} />)
    expect(getByTestId(name)).toHaveValue('B')
  })

  it('Types value and then display new value when "value" prop changes', () => {
    const { getByTestId, rerender } = render(<XTextbox model={textboxProps} />)
    userEvent.type(getByTestId(name), '{backspace}A{Enter}')
    expect(getByTestId(name)).toHaveValue('A')

    rerender(<XTextbox model={{ ...textboxProps, value: 'B' }} />)
    expect(getByTestId(name)).toHaveValue('B')
  })

  it('Display new value when "value" prop changes (masked)', () => {
    const { getByTestId, rerender } = render(<XTextbox model={{ ...textboxProps, value: '123', mask: '(999)' }} />)
    expect(getByTestId(name)).toHaveValue('(123)')

    rerender(<XTextbox model={{ ...textboxProps, value: '456', mask: '(999)' }} />)
    expect(getByTestId(name)).toHaveValue('(456)')
  })

  it('Types value and then display new value when "value" prop changes (masked)', () => {
    const { getByTestId, rerender } = render(<XTextbox model={{ ...textboxProps, mask: '(999)' }} />)
    userEvent.type(getByTestId(name), '{backspace}123{Enter}')
    expect(getByTestId(name)).toHaveValue('(123)')

    rerender(<XTextbox model={{ ...textboxProps, value: '456', mask: '(999)' }} />)
    expect(getByTestId(name)).toHaveValue('(456)')
  })

  it('Can reveal password', () => {
    const { container, getByTestId } = render(<XTextbox model={{ ...textboxProps, password: true }} />)
    const revealButton = container.querySelector('button')

    expect(revealButton).toBeInTheDocument()
    expect(getByTestId(name)).toHaveAttribute('type', 'password')

    fireEvent.click(revealButton!)
    expect(getByTestId(name)).toHaveAttribute('type', 'text')
  })
})
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

import { fireEvent, render, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { Textbox, XTextbox } from './textbox'
import { wave } from './ui'

const name = 'textbox'
let textboxProps: Textbox = { name }

describe('Textbox.tsx', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
    wave.args[name] = null
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
    act(() => { jest.runOnlyPendingTimers() })

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

  it('Calls sync on change - trigger specified', () => {
    const { getByTestId } = render(<XTextbox model={{ ...textboxProps, trigger: true }} />)

    const pushMock = jest.fn()
    wave.push = pushMock

    fireEvent.change(getByTestId(name), { target: { value: 'aaa' } })

    expect(pushMock).not.toBeCalled() // Not called immediately, but after specified timeout.
    act(() => { jest.advanceTimersByTime(250) })
    expect(pushMock).not.toBeCalled()
    act(() => { jest.advanceTimersByTime(250) })
    expect(pushMock).toBeCalled()
  })

  it('Debounces wave push', () => {
    const { getByTestId } = render(<XTextbox model={{...textboxProps, trigger: true}} />)
    const pushMock = jest.fn()
    wave.push = pushMock

    userEvent.type(getByTestId(name), 'a')
    userEvent.type(getByTestId(name), 'a')
    userEvent.type(getByTestId(name), 'a')
    userEvent.type(getByTestId(name), 'a')
    act(() => { jest.runOnlyPendingTimers() })

    expect(pushMock).toBeCalledTimes(1)
  })

  it('Does not call sync on change - trigger not specified', () => {
    const { getByTestId } = render(<XTextbox model={textboxProps} />)

    const pushMock = jest.fn()
    wave.push = pushMock

    fireEvent.change(getByTestId(name), { target: { value: 'aaa' } })

    expect(pushMock).not.toBeCalled()
  })

  it('Display new value when "value" prop changes', () => {
    const { getByTestId, rerender } = render(<XTextbox model={{...textboxProps, value: 'A'}} />)
    expect(getByTestId(name)).toHaveValue('A')

    rerender(<XTextbox model={{...textboxProps, value: 'B'}} />)
    expect(getByTestId(name)).toHaveValue('B')
  })

  it('Types value and then display new value when "value" prop changes', () => {
    const { getByTestId, rerender } = render(<XTextbox model={textboxProps} />)
    userEvent.type(getByTestId(name), '{backspace}A{Enter}')
    expect(getByTestId(name)).toHaveValue('A')

    rerender(<XTextbox model={{...textboxProps, value: 'B'}} />)
    expect(getByTestId(name)).toHaveValue('B')
  })

  it('Display new value when "value" prop changes (masked)', () => {
    const { getByTestId, rerender } = render(<XTextbox model={{...textboxProps, value: '123', mask: '(999)'}} />)
    expect(getByTestId(name)).toHaveValue('(123)')

    rerender(<XTextbox model={{...textboxProps, value: '456', mask: '(999)'}} />)
    expect(getByTestId(name)).toHaveValue('(456)')
  })

  it('Types value and then display new value when "value" prop changes (masked)', () => {
    const { getByTestId, rerender } = render(<XTextbox model={{...textboxProps, mask: '(999)'}} />)
    userEvent.type(getByTestId(name), '{backspace}123{Enter}')
    expect(getByTestId(name)).toHaveValue('(123)')

    rerender(<XTextbox model={{...textboxProps, value: '456', mask: '(999)'}} />)
    expect(getByTestId(name)).toHaveValue('(456)')
  })
})
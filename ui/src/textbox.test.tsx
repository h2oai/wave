import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { XTextbox, Textbox } from './textbox'
import * as T from './qd'
import { initializeIcons } from '@fluentui/react'

const name = 'textbox'
const textboxProps: Textbox = { name }

describe('Textbox.tsx', () => {
  beforeAll(() => initializeIcons())
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
    T.qd.args[name] = null
  })

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<XTextbox model={textboxProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Does not display textbox when visible is false', () => {
    const { queryByTestId } = render(<XTextbox model={{ ...textboxProps, visible: false }} />)
    expect(queryByTestId(name)).toBeInTheDocument()
    expect(queryByTestId(name)).not.toBeVisible()
  })

  it('Renders data-test attr - masked', () => {
    const { queryByTestId } = render(<XTextbox model={{ ...textboxProps, mask: 'mask' }} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Sets args - init - no value specified', () => {
    render(<XTextbox model={textboxProps} />)
    expect(T.qd.args[name]).toBe('')
  })

  it('Sets args - init - value specified', () => {
    render(<XTextbox model={{ ...textboxProps, value: 'text' }} />)
    expect(T.qd.args[name]).toBe('text')
  })


  it('Sets args on input', () => {
    const { getByTestId } = render(<XTextbox model={textboxProps} />)
    fireEvent.change(getByTestId(name), { target: { value: 'text' } })
    jest.runOnlyPendingTimers()

    expect(T.qd.args[name]).toBe('text')
  })

  it('Sets args on input - undefined value, no default value specified', () => {
    const { getByTestId } = render(<XTextbox model={textboxProps} />)
    fireEvent.change(getByTestId(name), { target: { value: undefined } })

    expect(T.qd.args[name]).toBe('')
  })

  it('Sets args on input - undefined value, default value specified', () => {
    const { getByTestId } = render(<XTextbox model={{ ...textboxProps, value: 'default' }} />)
    fireEvent.change(getByTestId(name), { target: { value: undefined } })

    expect(T.qd.args[name]).toBe('default')
  })

  it('Calls sync on change - trigger specified', () => {
    const { getByTestId } = render(<XTextbox model={{ ...textboxProps, trigger: true }} />)

    const syncMock = jest.fn()
    T.qd.sync = syncMock

    fireEvent.change(getByTestId(name), { target: { value: 'aaa' } })

    expect(syncMock).not.toBeCalled() // Not called immediately, but after specified timeout.
    jest.runOnlyPendingTimers()
    expect(syncMock).toBeCalled()
  })

  it('Does not call sync on change - trigger not specified', () => {
    const { getByTestId } = render(<XTextbox model={textboxProps} />)

    const syncMock = jest.fn()
    T.qd.sync = syncMock

    fireEvent.change(getByTestId(name), { target: { value: 'aaa' } })

    expect(syncMock).not.toBeCalled()
  })
})
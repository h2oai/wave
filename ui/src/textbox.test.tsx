import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { XTextbox, Textbox } from './textbox';
import * as T from './qd';
import { initializeIcons } from '@fluentui/react';

const name = 'textbox';
const textboxProps: Textbox = { name }

describe('Textbox.tsx', () => {
  beforeAll(() => initializeIcons())
  beforeEach(() => { T.qd.args[name] = null })

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
})
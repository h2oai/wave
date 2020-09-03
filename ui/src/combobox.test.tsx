import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { XCombobox, Combobox } from './combobox';
import * as T from './qd';
import { initializeIcons } from '@fluentui/react';

const name = 'combobox';
const comboboxProps: Combobox = { name }
describe('Combobox.tsx', () => {
  beforeAll(() => initializeIcons())
  beforeEach(() => { T.qd.args[name] = null })

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<XCombobox model={comboboxProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Sets args - init - value not specified', () => {
    render(<XCombobox model={comboboxProps} />)
    expect(T.qd.args[name]).toBeNull()
  })
  it('Sets args - init - value specified', () => {
    render(<XCombobox model={{ ...comboboxProps, value: 'Test' }} />)
    expect(T.qd.args[name]).toBe('Test')
  })

  it('Sets args - selection', () => {
    const { container, getByText } = render(<XCombobox model={{ ...comboboxProps, choices: ['Choice1', 'Choice2', 'Choice3'] }} />)
    fireEvent.click(container.querySelector('button')!)
    fireEvent.click(getByText('Choice1'))

    expect(T.qd.args[name]).toBe('Choice1')
  })
})
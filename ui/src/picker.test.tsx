import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { XPicker, Picker } from './picker';
import * as T from './qd';
import { initializeIcons } from '@fluentui/react';

const name = 'picker';
const pickerProps: Picker = {
  name,
  choices: [{ name }, { name: 'something else' }]
}
const typeToInput = (input: HTMLInputElement, value: string) => {
  input.focus()
  input.value = value
  fireEvent.input(input, { target: { value } })
}

describe('Picker.tsx', () => {
  beforeAll(() => initializeIcons())
  beforeEach(() => { T.qd.args[name] = null })

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<XPicker model={pickerProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Sets correct args - init', () => {
    render(<XPicker model={pickerProps} />)
    expect(T.qd.args[name]).toBeNull()
  })

  it('Sets correct args - init - values specified', () => {
    render(<XPicker model={{ ...pickerProps, values: [name] }} />)
    expect(T.qd.args[name]).toMatchObject([name])
  })

  it('Renders label if specified', () => {
    const { getByText } = render(<XPicker model={{ ...pickerProps, label: name }} />)
    expect(getByText(name)).toBeInTheDocument()
  })

  it('Does not render label if not specified', () => {
    const { queryByText } = render(<XPicker model={pickerProps} />)
    expect(queryByText(name)).not.toBeInTheDocument()
  })

  it('Filters correctly', () => {
    const { getByRole, getAllByRole } = render(<XPicker model={pickerProps} />)
    const input = getByRole('textbox') as HTMLInputElement

    typeToInput(input, name)
    expect(getAllByRole('option').length).toBe(1)

    typeToInput(input, 'i')
    expect(getAllByRole('option').length).toBe(2)
  })

  it('Filters correctly - different case', () => {
    const { getByRole, getAllByRole } = render(<XPicker model={pickerProps} />)
    const input = getByRole('textbox') as HTMLInputElement

    typeToInput(input, 'PICKER')
    expect(getAllByRole('option').length).toBe(1)
    typeToInput(input, 'Picker')
    expect(getAllByRole('option').length).toBe(1)
  })

  it('Filters correctly - does not offer already selected', () => {
    const { getByRole, queryByRole } = render(<XPicker model={pickerProps} />)
    const input = (getByRole('textbox') as HTMLInputElement);

    typeToInput(input, name)
    fireEvent.click(getByRole('option').querySelector('button')!)
    typeToInput(input, name)

    expect(queryByRole('option')).not.toBeInTheDocument()
  })

  it('Sets args - single selection', () => {
    const { getByRole } = render(<XPicker model={pickerProps} />)

    typeToInput(getByRole('textbox') as HTMLInputElement, name)
    fireEvent.click(getByRole('option').querySelector('button')!)

    expect(T.qd.args[name]).toMatchObject([name])
  })

  it('Sets args - multiple selection', () => {
    const { getByRole } = render(<XPicker model={pickerProps} />)
    const input = getByRole('textbox') as HTMLInputElement

    typeToInput(input, name)
    fireEvent.click(getByRole('option').querySelector('button')!)

    typeToInput(input, 'i')
    fireEvent.click(getByRole('option').querySelector('button')!)

    expect(T.qd.args[name]).toMatchObject([name, 'something else'])
  })

})
import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { XPicker, Picker } from './picker'
import * as T from './qd'
import { initializeIcons } from '@fluentui/react'

const name = 'picker'
let pickerProps: Picker

const typeToInput = (input: HTMLInputElement, value: string) => {
  input.focus()
  input.value = value
  fireEvent.input(input, { target: { value } })
}

describe('Picker.tsx', () => {
  beforeAll(() => initializeIcons())
  beforeEach(() => {
    pickerProps = {
      name,
      choices: [{ name }, { name: 'something else' }]
    }
    T.qd.args[name] = null
  })

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<XPicker model={pickerProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Does not display picker when visible is false', () => {
    const { queryByTestId } = render(<XPicker model={{ ...pickerProps, visible: false }} />)
    expect(queryByTestId(name)).toBeInTheDocument()
    expect(queryByTestId(name)).not.toBeVisible()
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

  it('Shows correct values count - init values specified', () => {
    const { queryAllByRole } = render(<XPicker model={{ ...pickerProps, values: [name] }} />)
    expect(queryAllByRole('listitem')).toHaveLength(1)
  })

  it('Shows correct label - init values specified', () => {
    const label = 'Label'
    pickerProps = {
      ...pickerProps,
      choices: [{ name, label }]
    }
    const { queryByText } = render(<XPicker model={{ ...pickerProps, values: [name] }} />)
    expect(queryByText(label)).toBeInTheDocument()
  })

  it('Shows nothing when values not among choices - init values specified', () => {
    const { queryAllByRole } = render(<XPicker model={{ ...pickerProps, values: ['non-existent'] }} />)
    expect(queryAllByRole('listitem')).toHaveLength(0)
  })

  it('Shows correct values - value picked', () => {
    const { getByRole, queryAllByRole } = render(<XPicker model={pickerProps} />)
    const input = (getByRole('textbox') as HTMLInputElement)
    expect(queryAllByRole('listitem')).toHaveLength(0)

    typeToInput(input, name)
    fireEvent.click(getByRole('option').querySelector('button')!)
    expect(queryAllByRole('listitem')).toHaveLength(1)
  })

  it('Shows correct values - value removed', () => {
    const { getByRole, queryAllByRole } = render(<XPicker model={{ ...pickerProps, values: [name] }} />)
    expect(queryAllByRole('listitem')).toHaveLength(1)
    fireEvent.click(getByRole('listitem').querySelector('.ms-TagItem-close')!)
    expect(queryAllByRole('listitem')).toHaveLength(0)
  })

  it('Does not render label if not specified', () => {
    const { queryByText } = render(<XPicker model={pickerProps} />)
    expect(queryByText(name)).not.toBeInTheDocument()
  })

  it('Filters correctly', () => {
    const { getByRole, getAllByRole } = render(<XPicker model={pickerProps} />)
    const input = getByRole('textbox') as HTMLInputElement

    typeToInput(input, name)
    expect(getAllByRole('option')).toHaveLength(1)

    typeToInput(input, 'i')
    expect(getAllByRole('option')).toHaveLength(2)
  })

  it('Filters correctly - different case', () => {
    const { getByRole, getAllByRole } = render(<XPicker model={pickerProps} />)
    const input = getByRole('textbox') as HTMLInputElement

    typeToInput(input, 'PICKER')
    expect(getAllByRole('option')).toHaveLength(1)
    typeToInput(input, 'Picker')
    expect(getAllByRole('option')).toHaveLength(1)
  })

  it('Filters correctly - does not offer already selected', () => {
    const { getByRole, queryByRole } = render(<XPicker model={pickerProps} />)
    const input = (getByRole('textbox') as HTMLInputElement)

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
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
import { Picker, XPicker } from './picker'
import { wave } from './ui'

const name = 'picker'
let pickerProps: Picker

const typeToInput = (input: HTMLInputElement, value: string) => {
  input.focus()
  input.value = value
  fireEvent.input(input, { target: { value } })
}

describe('Picker.tsx', () => {
  beforeEach(() => {
    pickerProps = {
      name,
      choices: [{ name }, { name: 'something else' }]
    }
    wave.args[name] = null
  })

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<XPicker model={pickerProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Sets correct args - init', () => {
    render(<XPicker model={pickerProps} />)
    expect(wave.args[name]).toBeNull()
  })

  it('Sets correct args - init - values specified', () => {
    render(<XPicker model={{ ...pickerProps, values: [name] }} />)
    expect(wave.args[name]).toMatchObject([name])
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

    expect(wave.args[name]).toMatchObject([name])
  })


  it('Calls sync when trigger specified', () => {
    const synckMock = jest.fn()
    wave.push = synckMock
    const { getByRole } = render(<XPicker model={{ ...pickerProps, trigger: true }} />)

    typeToInput(getByRole('textbox') as HTMLInputElement, name)
    fireEvent.click(getByRole('option').querySelector('button')!)

    expect(synckMock).toHaveBeenCalled()
  })

  it('Sets args - multiple selection', () => {
    const { getByRole } = render(<XPicker model={pickerProps} />)
    const input = getByRole('textbox') as HTMLInputElement

    typeToInput(input, name)
    fireEvent.click(getByRole('option').querySelector('button')!)

    typeToInput(input, 'i')
    fireEvent.click(getByRole('option').querySelector('button')!)

    expect(wave.args[name]).toMatchObject([name, 'something else'])
  })

  it('should open suggestion list on click', () => {
    const { getByTestId, queryByText } = render(<XPicker model={pickerProps} />)
    expect(queryByText('Suggestions')).not.toBeInTheDocument()
    fireEvent.click(getByTestId(name))
    expect(queryByText('Suggestions')).toBeInTheDocument()
  })
})
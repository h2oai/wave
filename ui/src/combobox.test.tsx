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
import { Combobox, XCombobox } from './combobox'
import { wave } from './ui'

const name = 'combobox'
const comboboxProps: Combobox = { name }
describe('Combobox.tsx', () => {
  beforeEach(() => { wave.args[name] = null })

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<XCombobox model={comboboxProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Sets args - init - value not specified', () => {
    render(<XCombobox model={comboboxProps} />)
    expect(wave.args[name]).toBeNull()
  })
  it('Sets args - init - value specified', () => {
    render(<XCombobox model={{ ...comboboxProps, value: 'Test' }} />)
    expect(wave.args[name]).toBe('Test')
  })

  it('Sets args - selection', () => {
    const { container, getByText } = render(<XCombobox model={{ ...comboboxProps, choices: ['Choice1', 'Choice2', 'Choice3'] }} />)
    fireEvent.click(container.querySelector('button')!)
    fireEvent.click(getByText('Choice1'))

    expect(wave.args[name]).toBe('Choice1')
  })
})
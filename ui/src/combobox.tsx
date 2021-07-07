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

import * as Fluent from '@fluentui/react'
import { B, box, Id, S } from 'h2o-wave'
import React from 'react'
import { bond, wave } from './ui'

/**
 * Create a combobox.
 *
 * A combobox is a list in which the selected item is always visible, and the others are visible on demand by
 * clicking a drop-down button or by typing in the input.
 * They are used to simplify the design and make a choice within the UI.
 *
 * When closed, only the selected item is visible.
 * When users click the drop-down button, all the options become visible.
 * To change the value, users open the list and click another value or use the arrow keys (up and down)
 * to select a new value.
 * When collapsed the user can select a new value by typing.
 */
export interface Combobox {
  /** An identifying name for this component. */
  name: Id
  /** Text to be displayed alongside the component. */
  label?: S
  /** A string that provides a brief hint to the user as to what kind of information is expected in the field. */
  placeholder?: S
  /** The name of the selected choice. */
  value?: S
  /** The choices to be presented. */
  choices?: S[]
  /** Text to be displayed as an error below the text box. */
  error?: S
  /** True if this field is disabled. */
  disabled?: B
  /** True if the component should be visible. Defaults to true. */
  visible?: B
  /** An optional tooltip message displayed when a user clicks the help icon to the right of the component. */
  tooltip?: S
}


export const
  XCombobox = bond(({ model: m }: { model: Combobox }) => {
    wave.args[m.name] = m.value || null
    const
      textB = box(m.value),
      options = (m.choices || []).map((text, i): Fluent.IComboBoxOption => ({ key: `${i}`, text })),
      onChange = (_e: React.FormEvent<Fluent.IComboBox>, option?: Fluent.IComboBoxOption, _index?: number, value?: string) => {
        const v = option?.text || value || ''
        wave.args[m.name] = v
        textB(v)
      },
      render = () => (
        <Fluent.ComboBox
          data-test={m.name}
          label={m.label}
          placeholder={m.placeholder}
          options={options}
          disabled={m.disabled}
          autoComplete="on"
          allowFreeform={true}
          errorMessage={m.error}
          text={textB()}
          onChange={onChange}
        />
      )
    return { render, textB }
  })
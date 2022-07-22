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
import { B, Id, S, U } from 'h2o-wave'
import React from 'react'
import { wave } from './ui'

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
  /** The names of the selected choices. If set, multiple selections will be allowed. */
  values?: S[]
  /** The choices to be presented. */
  choices?: S[]
  /** Text to be displayed as an error below the text box. */
  error?: S
  /** True if this field is disabled. */
  disabled?: B
  /** The width of the combobox, e.g. '100px'. Defaults to '100%'. */
  width?: S
  /** True if the component should be visible. Defaults to True. */
  visible?: B
  /** An optional tooltip message displayed when a user clicks the help icon to the right of the component. */
  tooltip?: S
  /** True if the choice should be submitted when an item from the dropdown is selected or the textbox value changes. */
  trigger?: B
  /** True if this is a required field. Defaults to False. */
  required?: B
}

export const
  XCombobox = ({ model: m }: { model: Combobox }) => {
    const
      isMultiValued = !!m.values,
      [text, setText] = React.useState(m.value),
      mapChoices = React.useCallback(() => (m.choices || []).map((text): Fluent.IComboBoxOption => ({ key: text, text })), [m.choices]),
      [options, setOptions] = React.useState(mapChoices()),
      [selected, setSelected] = React.useState<S[]>(m.values || []),
      selectOpt = (option: Fluent.IComboBoxOption) => {
        setSelected(keys => {
          const result = option.selected ? [...keys, String(option.key)] : keys.filter(key => key !== option.key)
          wave.args[m.name] = result
          return result
        })
      },
      byPassTextUpdate = React.useRef(true),
      onChange = (_e: React.FormEvent<Fluent.IComboBox>, option?: Fluent.IComboBoxOption, _index?: U, value?: S) => {
        if (!option && value) {
          const opt: Fluent.IComboBoxOption = { key: value, text: value }
          setOptions((prevOptions = []) => [...prevOptions, opt])
          selectOpt({...opt, selected: true})
        }
        if (option && isMultiValued) {
          selectOpt(option)
        }
        else {
          const v = option?.text || value || ''
          wave.args[m.name] = v
          setText(v)
          // We have to set m.value to a different value (undefined in this case) because a Wave app might
          // try to update the "value" prop with same value and it won't trigger the useEffect because "m.value" didn't change
          m.value = undefined
          // We use this flag to prevent the line above from triggering the useEffect with "m.value" in the dependency array
          byPassTextUpdate.current = true
        }
        if (m.trigger) wave.push()
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    React.useEffect(() => { wave.args[m.name] = m?.value || m?.values || null }, [m.value, m.values])
    React.useEffect(() => {
      if (!byPassTextUpdate.current) {
        setText(m.value)
      }
      // Reset the flag so the next change to "m.value" can be passed down to "setText". This change will come from the Wave app
      // by setting it dynamically e.g. q.page['form'].items[0].combobox.value = 'New Value'
      byPassTextUpdate.current = false
    }, [m.value, m.name])
    React.useEffect(() => { setSelected(m.values || []) }, [m.values])
    React.useEffect(() => { setOptions(mapChoices) }, [m.choices, mapChoices])

    return (
      <Fluent.ComboBox
        data-test={m.name}
        label={m.label}
        placeholder={m.placeholder}
        options={options}
        required={m.required}
        multiSelect={isMultiValued}
        selectedKey={isMultiValued ? selected : undefined}
        text={isMultiValued ? undefined : text}
        allowFreeform
        disabled={m.disabled}
        autoComplete="on"
        errorMessage={m.error}
        onChange={onChange}
      />
    )
  }
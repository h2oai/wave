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
import { IComboBox, IComboBoxOption } from '@fluentui/react'
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

export const XCombobox = ({ model: m }: { model: Combobox }) => m.values ? <ComboboxMultiSelect model={m} /> : <ComboboxSingleSelect model={m} />

const ComboboxSingleSelect = ({ model: m }: { model: Omit<Combobox, 'values'> }) => {
  const
    [options, setOptions] = useOptions(m.choices),
    [selected, setSelected] = React.useState<S | null>(m.value ?? null),
    onChange = (_e: React.FormEvent<IComboBox>, option?: IComboBoxOption, _index?: U, value?: S) => {
      const v = (option && String(option.key)) || value || ''
      setSelected(v)

      // Hacky: Ensure that next "model.value" set from a Wave App will be different and trigger the second "useEffect"
      m.value = v

      wave.args[m.name] = v
      if (m.trigger) wave.push()
    }

  React.useEffect(() => { wave.args[m.name] = selected }, [m.name, selected])

  // Whenever a new "value" is set in a Wave App, set it as the current value and add it to options list if it's not included yet
  React.useEffect(() => {
    setSelected(m.value || null)
    if (m.value && !(m.choices || []).includes(m.value)) {
      setOptions((prevOptions = []) => [...prevOptions, { key: m.value!, text: m.value! }])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [m.value])

  return (
    <Fluent.ComboBox
      data-test={m.name}
      label={m.label}
      placeholder={m.placeholder}
      options={options}
      required={m.required}
      selectedKey={selected}
      allowFreeform
      disabled={m.disabled}
      autoComplete="on"
      errorMessage={m.error}
      onChange={onChange}
    />
  )
}

const ComboboxMultiSelect = ({ model: m }: { model: Omit<Combobox, 'value'> }) => {
  const
    [options, setOptions] = useOptions(m.choices),
    [selected, setSelected] = React.useState<S[]>(m.values ?? []),
    selectOpt = (option: IComboBoxOption) => {
      setSelected(keys => {
        const result = option.selected ? [...keys, String(option.key)] : keys.filter(key => key !== option.key)
        wave.args[m.name] = result
        return result
      })
    },
    onChange = (_e: React.FormEvent<IComboBox>, option?: IComboBoxOption, _index?: U, value?: S) => {
      if (!option && value) {
        const opt: IComboBoxOption = { key: value, text: value }
        setOptions((prevOptions = []) => [...prevOptions, opt])
        selectOpt({ ...opt, selected: true })
      }
      if (option) {
        selectOpt(option)
      }
      if (m.trigger) wave.push()
    }

  React.useEffect(() => {
    wave.args[m.name] = m.values?.length ? m.values : null
    setSelected(m.values || [])
    if (m.values?.length) {
      setOptions((prevOptions = []) =>
        [
          ...prevOptions,
          ...m.values!.filter(v => !prevOptions.some(o => o.key === v)).map(v => ({ key: v, text: v }))
        ]
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [m.values])

  return (
    <Fluent.ComboBox
      data-test={m.name}
      label={m.label}
      placeholder={m.placeholder}
      options={options}
      required={m.required}
      multiSelect
      selectedKey={selected}
      allowFreeform
      disabled={m.disabled}
      autoComplete="on"
      errorMessage={m.error}
      onChange={onChange}
    />
  )
}

const useOptions = (choices?: S[]): [Fluent.IComboBoxOption[], React.Dispatch<React.SetStateAction<Fluent.IComboBoxOption[]>>] => {
  const mappedChoices = React.useMemo(() => (choices || []).map((text): Fluent.IComboBoxOption => ({ key: text, text })), [choices])
  const [options, setOptions] = React.useState(mappedChoices)

  React.useEffect(() => setOptions(mappedChoices), [choices, mappedChoices])

  return [options, setOptions]
}

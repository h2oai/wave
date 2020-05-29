import * as Fluent from '@fluentui/react';
import React from 'react';
import { B, bond, box, Rec, S } from './telesync';

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
  name: S
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
  /** An optional tooltip message displayed when a user clicks the help icon to the right of the component. */
  tooltip?: S
}


export const
  XCombobox = bond(({ args, model: m }: { args: Rec, model: Combobox }) => {
    args[m.name] = m.value || null
    const
      textB = box(m.value),
      options = (m.choices || []).map((text, i): Fluent.IComboBoxOption => ({ key: `${i}`, text })),
      onChange = (_e: React.FormEvent<Fluent.IComboBox>, option?: Fluent.IComboBoxOption, _index?: number, value?: string) => {
        const v = option ? option.text : value ? value : ''
        args[m.name] = v
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
          allowFreeform
          errorMessage={m.error}
          text={textB()}
          onChange={onChange}
        />
      )
    return { render, textB }
  })
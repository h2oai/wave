import * as Fluent from '@fluentui/react';
import React from 'react';
import { B, bond, S, qd } from './qd';
import { px } from './theme';

/**
 * Create a checkbox.
 *
 * A checkbox allows users to switch between two mutually exclusive options (checked or unchecked, on or off) through
 * a single click or tap. It can also be used to indicate a subordinate setting or preference when paired with another
 * component.
 *
 * A checkbox is used to select or deselect action items. It can be used for a single item or for a list of multiple
 * items that a user can choose from. The component has two selection states: unselected and selected.
 *
 * For a binary choice, the main difference between a checkbox and a toggle switch is that the checkbox is for status
 * and the toggle switch is for action.
 *
 * Use multiple checkboxes for multi-select scenarios in which a user chooses one or more items from a group of
 * choices that are not mutually exclusive.
 */
export interface Checkbox {
  /** An identifying name for this component. */
  name: S
  /** Text to be displayed alongside the checkbox. */
  label?: S
  /** True if selected, False if unselected. */
  value?: B
  /** True if the selection is indeterminate (neither selected nor unselected). */
  indeterminate?: B
  /** True if the checkbox is disabled. */
  disabled?: B
  /** True if the form should be submitted when the checkbox value changes. */
  trigger?: B
  /** An optional tooltip message displayed when a user clicks the help icon to the right of the component. */
  tooltip?: S
}

const
  checkboxStyles: Partial<Fluent.ICheckboxStyles> = {
    root: {
      marginBottom: px(10),
    }
  }

export const
  XCheckbox = bond(({ model: m }: { model: Checkbox }) => {
    qd.args[m.name] = !!m.value
    const
      onChange = (_e?: React.FormEvent<HTMLElement>, checked?: boolean) => {
        qd.args[m.name] = checked === null ? null : !!checked
        if (m.trigger) qd.sync()
      },
      render = () =>
        m.indeterminate
          ? (
            <Fluent.Checkbox
              data-test={m.name}
              inputProps={{ 'data-test': m.name } as any} // HACK: data-test does not work on root as of this version
              label={m.label}
              defaultIndeterminate={true}
              onChange={onChange}
              disabled={m.disabled}
              styles={checkboxStyles}
            />
          )
          : (
            <Fluent.Checkbox
              data-test={m.name}
              inputProps={{ 'data-test': m.name } as any} // HACK: data-test does not work on root as of this version
              label={m.label}
              defaultChecked={m.value}
              onChange={onChange}
              disabled={m.disabled}
              styles={checkboxStyles}
            />
          )

    return { render }
  })
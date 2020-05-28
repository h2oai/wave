import * as Fluent from '@fluentui/react';
import React from 'react';
import { Choice } from './choice_group';
import { B, bond, iff, Rec, S } from './telesync';

export interface Dropdown {
  name: S
  label: S
  placeholder: S
  multiple: B
  value: S
  values: S[]
  choices: Choice[]
  required: B
  disabled: B
  trigger: B
  tooltip: S
}

export const
  XDropdown = bond(({ args, model: m, submit }: { args: Rec, model: Dropdown, submit: () => void }) => {
    args[m.name] = m.multiple ? m.values : m.value
    const
      selection = m.multiple ? new Set<S>(m.values) : null,
      options = m.choices.map(({ name, label, disabled }): Fluent.IDropdownOption => ({ key: name, text: label, disabled })),
      onChange = (_e?: React.FormEvent<HTMLElement>, option?: Fluent.IDropdownOption) => {
        if (option) {
          const name = option.key as S
          if (m.multiple && selection !== null) {
            if (option.selected) {
              selection.add(name)
            } else {
              selection.delete(name)
            }
            args[m.name] = Array.from(selection)
          } else {
            args[m.name] = name
          }
        }
        if (m.trigger) submit();
      },
      render = () =>
        m.multiple
          ? (
            <Fluent.Dropdown
              data-test={m.name}
              label={m.label}
              placeholder={iff(m.placeholder)}
              options={options}
              required={m.required}
              disabled={m.disabled}
              multiSelect
              defaultSelectedKeys={m.values}
              onChange={onChange}
            />
          )
          : (
            <Fluent.Dropdown
              data-test={m.name}
              label={m.label}
              placeholder={iff(m.placeholder)}
              options={options}
              required={m.required}
              disabled={m.disabled}
              defaultSelectedKey={m.value}
              onChange={onChange}
            />
          )

    return { render }
  })
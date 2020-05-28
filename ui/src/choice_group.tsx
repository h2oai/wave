import * as Fluent from '@fluentui/react';
import React from 'react';
import { B, bond, Rec, S } from './telesync';

export interface Choice {
  name: S
  label: S
  disabled: B
}

export interface ChoiceGroup {
  name: S
  label: S
  value: S
  choices: Choice[]
  required: B
  trigger: B
  tooltip: S
}

export const
  XChoiceGroup = bond(({ args, model: m, submit }: { args: Rec, model: ChoiceGroup, submit: () => void }) => {
    args[m.name] = m.value
    const
      options = m.choices.map(({ name, label, disabled }): Fluent.IChoiceGroupOption => ({ key: name, text: label, disabled })),
      onChange = (_e?: React.FormEvent<HTMLElement>, option?: Fluent.IChoiceGroupOption) => {
        if (option) args[m.name] = option.key
        if (m.trigger) submit();
      },
      render = () => (
        <Fluent.ChoiceGroup
          data-test={m.name}
          label={m.label}
          required={m.required}
          defaultSelectedKey={m.value}
          options={options}
          onChange={onChange}
        />
      )

    return { render }
  })
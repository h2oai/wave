import * as Fluent from '@fluentui/react';
import React from 'react';
import { B, bond, Rec, S } from './telesync';

export interface Toggle {
  name: S
  label: S
  value: B
  disabled: B
  trigger: B
  tooltip: S
}

export const
  XToggle = bond(({ args, model: m, submit }: { args: Rec, model: Toggle, submit: () => void }) => {
    args[m.name] = m.value
    const
      onChange = (_e?: React.FormEvent<HTMLElement>, checked?: boolean) => {
        args[m.name] = checked ? true : false
        if (m.trigger) submit();
      },
      render = () => (
        <Fluent.Toggle
          data-test={m.name}
          label={m.label}
          defaultChecked={m.value}
          onChange={onChange}
          disabled={m.disabled}
          onText="On"
          offText="Off"
          inlineLabel
        />
      )

    return { render }
  })
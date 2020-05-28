import * as Fluent from '@fluentui/react';
import React from 'react';
import { B, bond, Rec, S } from './telesync';
import { px } from './theme';

export interface Checkbox {
  name: S
  label: S
  value: B
  indeterminate: B
  disabled: B
  trigger: B
  tooltip: S
}

const
  checkboxStyles = () => ({
    root: {
      marginBottom: px(10),
    }
  })

export const
  XCheckbox = bond(({ args, model: m, submit }: { args: Rec, model: Checkbox, submit: () => void }) => {
    args[m.name] = m.value
    const
      onChange = (_e?: React.FormEvent<HTMLElement>, checked?: boolean) => {
        args[m.name] = checked === true
          ? true
          : checked === false
            ? false
            : null
        if (m.trigger) submit();
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
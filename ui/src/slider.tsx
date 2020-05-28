import * as Fluent from '@fluentui/react';
import React from 'react';
import { B, bond, F, Rec, S } from './telesync';

export interface Slider {
  name: S
  label: S
  min: F
  max: F
  step: F
  value: F
  disabled: B
  trigger: B
  tooltip: S
}

export const
  XSlider = bond(({ args, model: m, submit }: { args: Rec, model: Slider, submit: () => void }) => {
    const default_value = (m.value < m.min) ? m.min : ((m.value > m.max) ? m.max : m.value)
    args[m.name] = default_value
    const
      onChange = (v: number) => args[m.name] = v,
      onChanged = (_event: MouseEvent | KeyboardEvent | TouchEvent, _value: number) => {
        if (m.trigger) submit();
      },
      render = () => (
        <Fluent.Slider
          data-test={m.name}
          buttonProps={{ 'data-test': m.name } as any} // HACK: data-test does not work on root as of this version
          label={m.label}
          min={m.min}
          max={m.max}
          step={m.step}
          defaultValue={default_value}
          showValue={true}
          originFromZero={m.min < 0 && m.max >= 0}
          onChange={onChange}
          onChanged={onChanged}
          disabled={m.disabled}
        />
      )

    return { render }
  })
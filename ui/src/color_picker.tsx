import * as Fluent from '@fluentui/react';
import React from 'react';
import { bond, Rec, S } from './telesync';

export interface ColorPicker {
  name: S
  label: S
  value: S
  choices: S[]
  tooltip: S
}

const
  toColorCells = (cs: S[]) => cs.map((c): Fluent.IColorCellProps => ({ id: c, label: c, color: c }))

export const
  XColorPicker = bond(({ args, model: m }: { args: Rec, model: ColorPicker }) => {
    args[m.name] = m.value
    const
      onColorChanged = (_id?: string, color?: string) => args[m.name] = color ? color : m.value,
      onChange = (_e: React.SyntheticEvent<HTMLElement>, color: Fluent.IColor) => args[m.name] = color ? color.str : m.value,
      render = () => m.choices && m.choices.length
        ? (
          <div>
            <Fluent.Label>{m.label}</Fluent.Label>
            <Fluent.SwatchColorPicker
              data-test={m.name}
              columnCount={10}
              selectedId={m.value}
              colorCells={toColorCells(m.choices)}
              onColorChanged={onColorChanged}
            />
          </div>
        )
        : (
          <div>
            <Fluent.Label>{m.label}</Fluent.Label>
            <Fluent.ColorPicker
              data-test={m.name}
              color={m.value}
              onChange={onChange}
            />
          </div>
        )

    return { render }
  })
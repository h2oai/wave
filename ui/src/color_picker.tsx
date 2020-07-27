import * as Fluent from '@fluentui/react';
import React from 'react';
import { bond, S, qd } from './qd';

/**
 * Create a color picker.
 *
 * A date picker allows a user to pick a color value.
 * If the 'choices' parameter is set, a swatch picker is displayed instead of the standard color picker.
 */
export interface ColorPicker {
  /** An identifying name for this component. */
  name: S
  /** Text to be displayed alongside the component. */
  label?: S
  /** The selected color (CSS-compatible string) */
  value?: S
  /** A list of colors (CSS-compatible strings) to limit color choices to. */
  choices?: S[]
  /** An optional tooltip message displayed when a user clicks the help icon to the right of the component. */
  tooltip?: S
}

const
  toColorCells = (cs: S[]) => cs.map((c): Fluent.IColorCellProps => ({ id: c, label: c, color: c }))

export const
  XColorPicker = bond(({ model: m }: { model: ColorPicker }) => {
    const value = m.value || null
    qd.args[m.name] = value
    const
      onColorChanged = (_id?: string, color?: string) => qd.args[m.name] = color ? color : value,
      onChange = (_e: React.SyntheticEvent<HTMLElement>, color: Fluent.IColor) => qd.args[m.name] = color ? color.str : value,
      render = () => m.choices && m.choices.length
        ? (
          <div>
            <Fluent.Label>{m.label}</Fluent.Label>
            <Fluent.SwatchColorPicker
              data-test={m.name}
              columnCount={10}
              selectedId={value || m.choices[0]}
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
              color={value || '#000'}
              onChange={onChange}
            />
          </div>
        )

    return { render }
  })
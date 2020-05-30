import * as Fluent from '@fluentui/react';
import React from 'react';
import { Choice } from './choice_group';
import { B, bond, box, Box, on, S, telesync } from './telesync';
import { px } from './theme';

/**
 * Create a set of checkboxes.
 * Use this for multi-select scenarios in which a user chooses one or more items from a group of
 * choices that are not mutually exclusive.
 */
export interface Checklist {
  /** An identifying name for this component. */
  name: S
  /** Text to be displayed above the component. */
  label?: S
  /** The names of the selected choices. */
  values?: S[]
  /** The choices to be presented. */
  choices?: Choice[]
  /** An optional tooltip message displayed when a user clicks the help icon to the right of the component. */
  tooltip?: S
}

const
  checklistItemStyles = () => ({
    root: {
      marginBottom: px(4),
    }
  }),
  XChecklistItem = bond(({ name, label, disabled, selectedB }: { name: S, label: S, disabled: B, selectedB: Box<B> }) => {
    const
      onChange = (_e?: React.FormEvent<HTMLElement>, checked?: boolean) => selectedB(checked === true),
      render = () => {
        return (
          <Fluent.Checkbox
            data-test={name}
            label={label}
            checked={selectedB()}
            onChange={onChange}
            disabled={disabled}
            styles={checklistItemStyles}
          />
        )
      }
    return { render, selectedB }
  })

export const
  XChecklist = bond(({ model: m }: { model: Checklist }) => {
    telesync.args[m.name] = m.values || []
    let _pause = false
    const
      defaultSelection = new Set<S>(m.values),
      choices = (m.choices || []).map(c => ({
        choice: c,
        selectedB: box(defaultSelection.has(c.name))
      })),
      capture = () => {
        if (_pause) return
        const vs: S[] = []
        for (const c of choices) if (c.selectedB()) vs.push(c.choice.name)
        telesync.args[m.name] = vs
      },
      select = (value: B) => {
        _pause = true
        for (const c of choices) if (!c.choice.disabled) c.selectedB(value)
        _pause = false
        capture()
      },
      selectAll = () => select(true),
      deselectAll = () => select(false),
      render = () => {
        const
          items = choices.map(({ choice, selectedB }, i) => (
            <XChecklistItem name={`checkbox-${i + 1}`} key={i} label={choice.label || choice.name} disabled={choice.disabled || false} selectedB={selectedB} />
          ))
        return (
          <div data-test={m.name}>
            <Fluent.Label>{m.label}</Fluent.Label>
            <div>
              <Fluent.Link onClick={selectAll}>Select All</Fluent.Link> | <Fluent.Link onClick={deselectAll}>Deselect All</Fluent.Link>
            </div>
            <div>{items}</div>
          </div>
        )
      }
    choices.forEach(c => on(c.selectedB, capture))
    return { render }
  })
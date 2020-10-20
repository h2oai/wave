import * as Fluent from '@fluentui/react'
import React from 'react'
import { Choice } from './choice_group'
import { B, bond, box, Box, on, S, qd } from './qd'
import { margin, displayMixin } from './theme'
import { stylesheet } from 'typestyle'

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
  /** True if the form should be submitted when the checklist value changes. */
  trigger?: B
  /** True if the component should be visible. Defaults to true. */
  visible?: B
  /** An optional tooltip message displayed when a user clicks the help icon to the right of the component. */
  tooltip?: S
}

const
  css = stylesheet({
    toolbar: {
      margin: margin(5, 0)
    },
    items: {
      $nest: {
        '> *': {
          margin: '10px 0',
        }
      },
    },
  }),
  XChecklistItem = bond(({ name, label, disabled, selectedB }: { name: S, label: S, disabled: B, selectedB: Box<B> }) => {
    const
      onChange = (_e?: React.FormEvent<HTMLElement>, checked?: boolean) => selectedB(!!checked),
      render = () => {
        return (
          <Fluent.Checkbox
            data-test={name}
            label={label}
            checked={selectedB()}
            onChange={onChange}
            disabled={disabled}
            styles={{ root: { marginBottom: 4 } }}
          />
        )
      }
    return { render, selectedB }
  })

export const
  XChecklist = bond(({ model: m }: { model: Checklist }) => {
    qd.args[m.name] = m.values || []
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
        qd.args[m.name] = vs
        if (m.trigger) qd.sync()
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
            <XChecklistItem name={`checkbox-${i + 1}`} key={i} label={choice.label || choice.name} disabled={!!choice.disabled} selectedB={selectedB} />
          ))
        return (
          <div data-test={m.name} style={displayMixin(m.visible)}>
            <Fluent.Label>{m.label}</Fluent.Label>
            <div className={css.toolbar}>
              <Fluent.Text variant='small'>
                <Fluent.Link onClick={selectAll}>Select All</Fluent.Link> | <Fluent.Link onClick={deselectAll}>Deselect All</Fluent.Link>
              </Fluent.Text>
            </div>
            <div className={css.items}>{items}</div>
          </div>
        )
      }
    choices.forEach(c => on(c.selectedB, capture))
    return { render }
  })
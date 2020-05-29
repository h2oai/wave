import * as Fluent from '@fluentui/react';
import React from 'react';
import { stylesheet } from 'typestyle';
import { Component, XComponents } from './form';
import { B, bond, box, Rec, S } from './telesync';

/**
 * Creates a new expander.
 *
 * Expanders can be used to show or hide a group of related components.
 */
export interface Expander {
  /** An identifying name for this component. */
  name: S
  /** The text displayed on the expander. */
  label?: S
  /** True if expanded, False if collapsed. */
  expanded?: B
  /** List of components to be hideable by the expander. */
  items?: Component[]
}

const
  css = stylesheet({
    card: {
      display: 'flex',
      flexDirection: 'column',
    },
    expanderOpen: {
      $nest: {
        '>div:last-child': {
          display: 'block',
        },
      },
    },
    expanderClosed: {
      $nest: {
        '>div:last-child': {
          display: 'none',
        },
      },
    },
  })

export const
  XExpander = bond(({ args, model: m, submit }: { args: Rec, model: Expander, submit: () => void }) => {
    const
      isOpenB = box(args[m.name]),
      onClick = () => {
        args[m.name] = m.expanded = !m.expanded
        isOpenB(m.expanded)
      },
      render = () => {
        const
          isOpen = isOpenB(),
          actionTitle = isOpen ? 'Shrink' : 'Expand',
          expanderIcon = { iconName: isOpen ? 'ChevronDownMed' : 'ChevronRightMed' },
          className = isOpenB() ? css.expanderOpen : css.expanderClosed

        return (
          <div data-test='expander' className={className}>
            <Fluent.Separator alignContent="start"><Fluent.ActionButton title={actionTitle} iconProps={expanderIcon} onClick={onClick}>{m.label}</Fluent.ActionButton></Fluent.Separator>
            <div>
              <XComponents items={m.items || []} args={args} submit={submit} />
            </div>
          </div>
        )
      }
    return { isOpenB, render }
  })
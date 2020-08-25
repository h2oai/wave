import * as Fluent from '@fluentui/react'
import React from 'react'
import { stylesheet } from 'typestyle'
import { Component, XComponents } from './form'
import { B, bond, box, S, qd } from './qd'

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
  XExpander = bond(({ model: m }: { model: Expander }) => {
    const
      isOpenB = box(!!qd.args[m.name]),
      onClick = () => {
        qd.args[m.name] = m.expanded = !m.expanded
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
              <XComponents items={m.items || []} />
            </div>
          </div>
        )
      }
    return { isOpenB, render }
  })
import * as Fluent from '@fluentui/react'
import React from 'react'
import { stylesheet } from 'typestyle'
import { Component } from './form'
import { B, bond, S, qd } from './qd'
import { padding } from './theme'
import { XToolTip } from './tooltip'

/**
 * Create a button.
 *
 * Buttons are best used to enable a user to commit a change or complete steps in a task.
 * They are typically found inside forms, dialogs, panels or pages.
 * An example of their usage is confirming the deletion of a file in a confirmation dialog.
 *
 * When considering their place in a layout, contemplate the order in which a user will flow through the UI.
 * As an example, in a form, the individual will need to read and interact with the form fields before submitting
 * the form. Therefore, as a general rule, the button should be placed at the bottom of the UI container
 * which holds the related UI elements.
 *
 * Buttons may be placed within a "buttons" component which will lay out the buttons horizontally, or used
 * individually and they will be stacked vertically.
 *
 * While buttons can technically be used to navigate a user to another part of the experience, this is not
 * recommended unless that navigation is part of an action or their flow.
 */
export interface Button {
  /** An identifying name for this component. If the name is prefixed with a '#', the button sets the location hash to the name when clicked. */
  name: S
  /** The text displayed on the button. */
  label?: S
  /** The caption displayed below the label. Setting a caption renders a compound button. */
  caption?: S
  /** A value for this button. If a value is set, it is used for the button's submitted instead of a boolean True. */
  value?: S
  /** True if the button should be rendered as the primary button in the set. */
  primary?: B
  /** True if the button should be disabled. */
  disabled?: B
  /** True if the button should be rendered as link text and not a standard button. */
  link?: B
  /** An optional tooltip message displayed when a user clicks the help icon to the right of the component. */
  tooltip?: S
}

/** Create a set of buttons to be layed out horizontally. */
export interface Buttons {
  /** The button in this set. */
  items: Component[]
}

const
  css = stylesheet({
    buttons: {
      boxSizing: 'border-box',
      padding: padding(20, 0)
    },
  })

const
  XButton = bond(({ model: m }: { model: Button }) => {
    qd.args[m.name] = false
    const
      onClick = () => {
        if (m.name[0] === '#') {
          window.location.hash = m.name.substr(1)
          return
        }
        qd.args[m.name] = m.value !== undefined ? m.value : true
        qd.sync()
      },
      render = () => {
        if (m.link) {
          return (<Fluent.Link data-test='link' disabled={m.disabled} onClick={onClick}>{m.label}</Fluent.Link>)
        }
        return m.caption?.length
          ? m.primary
            ? <Fluent.CompoundButton data-test={m.name} primary text={m.label} secondaryText={m.caption} disabled={m.disabled} onClick={onClick} />
            : <Fluent.CompoundButton data-test={m.name} text={m.label} secondaryText={m.caption} disabled={m.disabled} onClick={onClick} />
          : m.primary
            ? <Fluent.PrimaryButton data-test={m.name} text={m.label} disabled={m.disabled} onClick={onClick} />
            : <Fluent.DefaultButton data-test={m.name} text={m.label} disabled={m.disabled} onClick={onClick} />
      }
    return { render }
  })
export const
  XButtons = bond(({ model: m }: { model: Buttons }) => {
    const
      render = () => {
        const
          buttons = m.items.map(c => c.button).filter(b => !!b) as Button[],
          children = buttons.map(b => (
            <XToolTip key={b.name} content={b.tooltip} showIcon={false} expand={false}>
              <XButton model={b}>{b.label}</XButton>
            </XToolTip>
          ))
        return <div data-test='buttons' className={css.buttons}><Fluent.Stack horizontal tokens={{ childrenGap: 10 }}>{children}</Fluent.Stack></div>
      }
    return { render }
  }),
  XStandAloneButton = ({ model: m }: { model: Button }) => (
    <div data-test={m.name} className={css.buttons}><XButton key={m.name} model={m}>{m.label}</XButton></div>
  )
// Copyright 2020 H2O.ai, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as Fluent from '@fluentui/react'
import { B, Dict, Id, S } from 'h2o-wave'
import React from 'react'
import { stylesheet } from 'typestyle'
import { Component } from './form'
import { cssVar, formItemWidth, padding } from './theme'
import { XToolTip } from './tooltip'
import { wave } from './ui'

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
  name: Id
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
  /** An optional icon to display next to the button label (not applicable for links). */
  icon?: S
  /** The width of the button, e.g. '100px'. */
  width?: S
  /** True if the component should be visible. Defaults to true. */
  visible?: B
  /** An optional tooltip message displayed when a user clicks the help icon to the right of the component. */
  tooltip?: S
}

/** Create a set of buttons laid out horizontally. */
export interface Buttons {
  /** The buttons in this set. */
  items: Component[]
  /** Specifies how to lay out buttons horizontally. */
  justify?: 'start' | 'end' | 'center' | 'between' | 'around'
  /** An identifying name for this component. */
  name?: S
  /** The width of the buttons, e.g. '100px'. */
  width?: S
  /** True if the component should be visible. Defaults to true. */
  visible?: B
}

/** Create a set of mini buttons laid out horizontally. */
export interface MiniButtons {
  /** The buttons in this set. */
  items: MiniButton[]
}

/** Create a mini button - same as regular button, but smaller in size. */
export interface MiniButton {
  /** An identifying name for this component. If the name is prefixed with a '#', the button sets the location hash to the name when clicked. */
  name: Id
  /** The text displayed on the button. */
  label: S
  /** An optional icon to display next to the button label. */
  icon?: S
}

const
  css = stylesheet({
    buttons: {
      boxSizing: 'border-box',
      overflowX: 'auto'
    },
  }),
  justifications: Dict<Fluent.Alignment> = {
    start: 'start',
    end: 'end',
    center: 'center',
    between: 'space-between',
    around: 'space-around',
  }

const
  XButton = ({ model: { name, visible = true, link, label, disabled, icon, caption, value, primary, width } }: { model: Button }) => {
    const
      onClick = () => {
        if (name.startsWith('#')) {
          window.location.hash = name.substr(1)
          return
        }
        wave.args[name] = value === undefined || value
        wave.push()
      },
      // HACK: Our visibility logic in XComponents doesn't count with nested components, e.g. Butttons > Button.
      styles: Fluent.IButtonStyles = {
        root: {
          display: visible ? 'inherit' : 'none',
          width: formItemWidth(width),
          minWidth: width ? 'initial' : undefined
        }
      }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    React.useEffect(() => { wave.args[name] = false }, [])

    if (link) {
      return <Fluent.Link data-test={name} disabled={disabled} onClick={onClick} styles={styles}>{label}</Fluent.Link>
    }
    const btnProps: Fluent.IButtonProps = { text: label, disabled, onClick, styles, iconProps: { iconName: icon } }
    if (!label && icon) return <Fluent.IconButton {...btnProps} data-test={name} title={caption} />

    return caption?.length
      ? primary
        ? <Fluent.CompoundButton {...btnProps} data-test={name} primary secondaryText={caption} />
        : <Fluent.CompoundButton {...btnProps} data-test={name} secondaryText={caption} />
      : primary
        ? <Fluent.PrimaryButton {...btnProps} data-test={name} />
        : <Fluent.DefaultButton {...btnProps} data-test={name} />
  }
export const
  XButtons = ({ model }: { model: Buttons }) => {
    const
      { name, items, justify, width } = model,
      children = (items.map(c => c.button).filter(Boolean) as Button[]).map(b => (
        <XToolTip key={b.name} content={b.tooltip} showIcon={false} expand={false}>
          <XButton model={b} />
        </XToolTip>
      ))
    return (
      <div data-test={name} className={css.buttons} style={{ width }}>
        <Fluent.Stack horizontal horizontalAlign={justifications[justify || '']} tokens={{ childrenGap: 10 }}>{children}</Fluent.Stack>
      </div>
    )
  },
  XStandAloneButton = ({ model: m }: { model: Button }) => (
    <div className={css.buttons}>
      <XButton key={m.name} model={m} />
    </div>
  ),
  MiniButtons = ({ items }: MiniButtons) => (
    <Fluent.Stack horizontal verticalAlign='center' styles={{ root: { height: 24 } }}>
      {items.map(miniBtn => <MiniButton key={miniBtn.name} {...miniBtn} />)}
    </Fluent.Stack>
  ),
  MiniButton = ({ name, label, icon }: MiniButton) => {
    const onClick = () => {
      if (name.startsWith('#')) {
        window.location.hash = name.substr(1)
        return
      }
      wave.args[name] = true
      wave.push()
    }

    return (
      <Fluent.ActionButton
        data-test={name}
        styles={{
          label: { color: cssVar('$neutralTertiary') },
          labelHovered: { color: 'inherit' },
          icon: { color: cssVar('$neutralTertiary') },
          root: { padding: padding(0, 1) }
        }}
        text={label}
        iconProps={{ iconName: icon }}
        onClick={onClick}
      />
    )
  }
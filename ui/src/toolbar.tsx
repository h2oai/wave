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
import { ICommandBarItemProps } from '@fluentui/react'
import { Id, Model, S } from './core'
import React from 'react'
import { stylesheet } from 'typestyle'
import { CardEffect, cards } from './layout'
import { fixMenuOverflowStyles } from './parts/utils'
import { bond, wave } from './ui'

/**
 * Create a command.
 *
 * Commands are typically displayed as context menu items or toolbar button.
 */
export interface Command {
  /** An identifying name for this component. If the name is prefixed with a '#', the command sets the location hash to the name when executed. */
  name: Id
  /** The text displayed for this command. */
  label?: S
  /** The caption for this command (typically a tooltip). */
  caption?: S
  /** The icon to be displayed for this command. */
  icon?: S
  /** Sub-commands, if any */
  items?: Command[]
  /** Data associated with this command, if any. */
  value?: S
}

/** Create a card containing a toolbar. */
interface State {
  /** Items to render. */
  items: Command[]
  /** Items to render on the right side (or left, in RTL). */
  secondary_items?: Command[]
  /** Items to render in an overflow menu. */
  overflow_items?: Command[]
}

const
  css = stylesheet({
    card: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
  }),
  toCommand = ({ name, label, caption, icon, items, value }: Command): ICommandBarItemProps => {
    wave.args[name] = false
    const onClick = () => {
      if (name.startsWith('#')) {
        window.location.hash = name.substring(1)
        return
      }
      wave.args[name] = value === undefined || value
      wave.push()
    }
    return {
      key: name,
      text: label,
      ariaLabel: caption || label,
      title: caption,
      iconOnly: !label,
      iconProps: icon ? { iconName: icon } : undefined,
      subMenuProps: items ? { items: toCommands(items), styles: fixMenuOverflowStyles } : undefined,
      onClick,
    }
  }

export const
  toCommands = (commands: Command[]) => commands.map(toCommand),
  View = bond(({ name, state, changed }: Model<State>) => {
    const
      render = () => {
        const
          { items, overflow_items, secondary_items } = state,
          commands = toCommands(items),
          overflowCommands = overflow_items ? toCommands(overflow_items) : undefined,
          farCommands = secondary_items ? toCommands(secondary_items) : undefined
        return (
          <div className={css.card}>
            <Fluent.CommandBar
              data-test={name}
              items={commands}
              overflowItems={overflowCommands}
              overflowButtonProps={{ ariaLabel: 'More' }}
              farItems={farCommands}
              ariaLabel='Use left and right arrow keys to navigate between commands.'
            />
          </div>
        )
      }
    return { render, changed }
  })

cards.register('toolbar', View, { effect: CardEffect.Transparent })
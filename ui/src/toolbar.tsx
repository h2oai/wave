import { CommandBar, IButtonProps, ICommandBarItemProps } from '@fluentui/react'
import React from 'react'
import { cards } from './layout'
import { bond, Card, qd, S } from './qd'

/**
 * Create a command.
 *
 * Commands are typically displayed as context menu items or toolbar button.
 */
export interface Command {
  /** An identifying name for this component. If the name is prefixed with a '#', the command sets the location hash to the name when executed. */
  name: S
  /** The text displayed for this command. */
  label?: S
  /** The caption for this command (typically a tooltip). */
  caption?: S
  /** The icon to be displayed for this command. */
  icon?: S
  /** Sub-commands, if any */
  items?: Command[]
  /** Data associated with this command, if any. */
  data?: S
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
  overflowProps: IButtonProps = { ariaLabel: 'More' },
  toCommands = (commands: Command[]) => commands.map(toCommand),
  toCommand = ({ name, label, caption, icon, items }: Command): ICommandBarItemProps => {
    qd.args[name] = false
    const onClick = () => {
      if (name[0] === '#') {
        window.location.hash = name.substr(1)
        return
      }
      qd.args[name] = true
      qd.sync()
    }
    return {
      key: name,
      text: label,
      ariaLabel: caption || label,
      iconOnly: !label,
      iconProps: icon ? { iconName: icon } : undefined,
      subMenuProps: items ? { items: toCommands(items) } : undefined,
      onClick,
    }
  }

export const
  View = bond(({ state, changed }: Card<State>) => {
    const
      render = () => {
        const
          { items, overflow_items, secondary_items } = state,
          commands = toCommands(items),
          overflowCommands = overflow_items ? toCommands(overflow_items) : undefined,
          farCommands = secondary_items ? toCommands(secondary_items) : undefined
        return (
          <div>
            <CommandBar
              data-test='toolbar'
              items={commands}
              overflowItems={overflowCommands}
              overflowButtonProps={overflowProps}
              farItems={farCommands}
              ariaLabel='Use left and right arrow keys to navigate between commands.'
            />
          </div>
        )
      }
    return { render, changed }
  })

cards.register('toolbar', View)



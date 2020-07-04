import { CommandBar, IButtonProps, ICommandBarItemProps } from '@fluentui/react';
import React from 'react';
import { cards } from './layout';
import { Command } from './notebook';
import { bond, Card, telesync } from './telesync';

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
  toCommand = ({ name, label, caption, icon, items }: Command): ICommandBarItemProps => {
    telesync.args[name] = false
    const onClick = () => {
      telesync.args[name] = true
      telesync.sync()
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
  },
  toCommands = (commands: Command[]) => commands.map(toCommand),
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



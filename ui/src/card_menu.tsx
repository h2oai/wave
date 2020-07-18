import { ContextualMenu, Icon, IContextualMenuItem } from '@fluentui/react';
import * as React from 'react';
import { stylesheet } from 'typestyle';
import { Command } from './toolbar';
import { bond, box, telesync, Card } from './telesync';

const
  css = stylesheet({
    menu: {
      position: 'absolute',
      top: 5, // should be 0 logically, but adjusted here to suit the MoreVertical icon.
      right: 0,
      $nest: {
        '>div:first-child': {
          width: 32, height: 32,
          padding: 8,
        },
      },
    },
    icon: {
      userSelect: 'none',
    },
    target: {
      boxSizing: 'border-box',
      cursor: 'pointer',
      opacity: 0.5,
      $nest: {
        '&:hover': {
          opacity: 1,
        },
      },
    }
  })

const
  toContextMenuItem = (c: Command): IContextualMenuItem => {
    const
      onClick = () => {
        telesync.args[c.name] = c.data === undefined ? true : c.data
        telesync.sync()
      }
    return {
      key: c.name,
      text: c.label || c.name || 'Untitled',
      iconProps: c.icon ? { iconName: c.icon } : undefined,
      title: c.caption || undefined,
      subMenuProps: c.items ? { items: c.items.map(toContextMenuItem) } : undefined,
      onClick,
    }
  }

export const
  CardMenu = bond(({ card }: { card: Card<any> }) => {
    const
      { state, changed } = card,
      target = React.createRef<HTMLDivElement>(),
      hiddenB = box(true),
      show = () => hiddenB(false),
      hide = () => hiddenB(true),
      render = () => {
        const commands: Command[] | undefined = state.commands
        if (!commands) return <></>
        if (!commands.length) return <></>
        const
          hidden = hiddenB(),
          items = commands.map(toContextMenuItem)
        return (
          <div className={css.menu}>
            <div className={css.target} ref={target} onClick={show}>
              <Icon className={css.icon} iconName='MoreVertical' />
            </div>
            <ContextualMenu target={target} items={items} hidden={hidden} onItemClick={hide} onDismiss={hide} />
          </div>
        )
      }
    return { render, changed, hiddenB }
  })
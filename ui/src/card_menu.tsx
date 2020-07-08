import { ContextualMenu, Icon, IContextualMenuItem } from '@fluentui/react';
import * as React from 'react';
import { stylesheet } from 'typestyle';
import { Command } from './notebook';
import { bond, box, telesync } from './telesync';
import { grid } from './layout'

const
  css = stylesheet({
    menu: {
      position: 'absolute',
      top: -grid.gap + 5,
      right: -grid.gap,
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
  CardMenu = bond(({ items }: { items: Command[] }) => {
    const
      target = React.createRef<HTMLDivElement>(),
      hiddenB = box(true),
      show = () => hiddenB(false),
      hide = () => hiddenB(true),
      contextMenuItems = items.map(toContextMenuItem),
      render = () => {
        const
          hidden = hiddenB()
        return (
          <div className={css.menu}>
            <div className={css.target} ref={target} onClick={show}>
              <Icon className={css.icon} iconName='MoreVertical' />
            </div>
            <ContextualMenu target={target} items={contextMenuItems} hidden={hidden} onItemClick={hide} onDismiss={hide} />
          </div>
        )
      }
    return { render, hiddenB }
  })
import { ContextualMenu, Icon, IContextualMenuItem } from '@fluentui/react'
import * as React from 'react'
import { stylesheet } from 'typestyle'
import { Command } from './toolbar'
import { bond, box, qd, Box, B, S } from './qd'

const
  css = stylesheet({
    menu: {
      position: 'absolute',
      top: 0, right: 0,
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
        if (c.name.startsWith('#')) {
          window.location.hash = c.name.substr(1)
          return
        }
        qd.args[c.name] = c.data === undefined ? true : c.data
        qd.sync()
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
  CardMenu = bond(({ name, commands, changedB }: { name: S, commands: Command[], changedB?: Box<B> }) => {
    const
      target = React.createRef<HTMLDivElement>(),
      hiddenB = box(true),
      show = () => hiddenB(false),
      hide = () => hiddenB(true),
      render = () => {
        const
          hidden = hiddenB(),
          items = commands.map(toContextMenuItem)
        return (
          <div className={css.menu} data-test={name}>
            <div className={css.target} ref={target} onClick={show}>
              <Icon className={css.icon} iconName='MoreVertical' />
            </div>
            <ContextualMenu target={target} items={items} hidden={hidden} onItemClick={hide} onDismiss={hide} />
          </div>
        )
      }
    return { render, changedB, hiddenB }
  })
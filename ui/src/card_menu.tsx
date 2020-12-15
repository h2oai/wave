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
        qd.args[c.name] = c.value ?? c.data ?? true
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
  CardMenu = bond(({ commands, name, changedB }: { commands: Command[], name?: S, changedB?: Box<B> }) => {
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
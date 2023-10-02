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
import { B, Card, S } from 'h2o-wave'
import * as React from 'react'
import { stylesheet } from 'typestyle'
import { deleteCard, editCard } from './editing'
import { fixMenuOverflowStyles } from './parts/utils'
import { clas, cssVar } from './theme'
import { Command } from './toolbar'
import { bond, wave } from './ui'

const
  css = stylesheet({
    menu: {
      position: 'absolute',
      top: 0, right: 0,
      $nest: {
        '>div:first-child': {
          padding: 24,
          fontSize: 16,
          color: cssVar('$text7')
        },
      },
    },
    icon: {
      userSelect: 'none',
      marginRight: -6,
      color: cssVar('$text'),
      $nest: {
        '&:hover': {
          color: cssVar('$themePrimary'),
        },
      },
    },
    target: {
      boxSizing: 'border-box',
      cursor: 'pointer',
    }
  })

const
  editCommand = '__edit__',
  deleteCommand = '__delete__',
  toContextMenuItem = (c: Command): IContextualMenuItem => {
    const
      onClick = () => {
        if (c.name === editCommand) {
          if (c.value) editCard(c.value)
          return
        }
        if (c.name === deleteCommand) {
          if (c.value) deleteCard(c.value)
          return
        }
        if (c.name.startsWith('#')) {
          window.location.hash = c.name.substring(1)
          return
        }
        wave.args[c.name] = c.value ?? true
        wave.push()
      }
    return {
      key: c.name,
      text: c.label || c.name || 'Untitled',
      iconProps: c.icon ? { iconName: c.icon } : undefined,
      title: c.caption || undefined,
      subMenuProps: c.items ? { items: c.items.map(toContextMenuItem), styles: fixMenuOverflowStyles } : undefined,
      onClick,
    }
  }

export const
  ContextMenu = ({ name, commands }: { commands: Command[], name?: S }) => {
    const
      target = React.useRef<HTMLDivElement>(null),
      [isHidden, setIsHidden] = React.useState(true)

    return commands.length ? (
      // `w-card-menu` is a marker class.
      <div className={clas(css.menu, 'w-card-menu')} data-test={name}>
        <div className={css.target} ref={target} onClick={() => setIsHidden(false)}>
          <Icon className={css.icon} iconName='MoreVertical' />
        </div>
        <ContextualMenu
          target={target}
          items={commands.map(toContextMenuItem)}
          hidden={isHidden}
          onItemClick={() => setIsHidden(true)}
          onDismiss={() => setIsHidden(true)}
          styles={fixMenuOverflowStyles}
        />
      </div>
    ) : null
  },
  CardMenu = bond(({ card, canEdit }: { card: Card, canEdit?: B }) => {
    const render = () => {
      const cmds = card.state.commands ?? []
      if (canEdit) {
        cmds.push(
          { name: editCommand, label: 'Edit this card', icon: 'Edit', value: card.name },
          { name: deleteCommand, label: 'Delete this card', icon: 'Delete', value: card.name },
        )
      }
      return <ContextMenu name={card.name} commands={cmds} />
    }
    return { render, changed: card.changed }
  })
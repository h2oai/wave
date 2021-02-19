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
import React from 'react'
import { stylesheet } from 'typestyle'
import { cards } from './layout'
import { B, bond, Box, box, Card, Dict, Page, qd, S } from './qd'
import { cssVar } from './theme'

const
  css = stylesheet({
    fab: {
      position: 'fixed',
      right: 20,
      bottom: 20,
      width: 56,
      height: 56,
      borderRadius: '50%',
      background: 'black',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: `0px 3px 5px ${cssVar('$text0')}`,
      $nest: {
        '&:hover': {
          boxShadow: `0px 12px 20px ${cssVar('$text2')}`,
        }
      },
    },
    fabIcon: {
      color: 'white',
    },
    panelActions: {
      marginTop: 10,
    }
  })

/**
 * Create a card that enables WYSIWYG editing on a page.
 * Adding this card to a page makes it editable by end-users.
 */
interface State {
  /** The title for this card.*/
  title: S
}

enum AttrT { S, P }

type Attr = {
  t: AttrT
  name: S
  value: S
  optional: B
}

type AttrPanel = {
  view: S
  attrs: Attr[]
}

type EditOp = {
  name?: S
  panel: AttrPanel
}

const
  attr = (t: AttrT, name: S, value: S = '', optional: B = false) => ({ t, name, value, optional }),
  MarkdownCardAttrPanel: AttrPanel = {
    view: 'markdown',
    attrs: [
      attr(AttrT.S, 'box', '1 1 2 2'),
      attr(AttrT.S, 'title', 'Card title'),
      attr(AttrT.P, 'content', 'Some *content*.'),
    ],
  },
  AttrPanelView = bond(({ opB }: { opB: Box<EditOp | null> }) => {
    const
      { name, panel: { view, attrs } } = opB() as EditOp, // never null when initialized
      isNew = name ? false : true,
      original: Dict<any> = {},
      changes: Dict<any> = {}

    for (const { name, value } of attrs) original[name] = changes[name] = value

    let cardName = name ? name : `${view}${(new Date()).toISOString()}`

    const
      save = () => {
        const page = qd.edit()
        if (isNew) {
          const card: Dict<any> = { view }
          for (const k in original) card[k] = original[k]
          for (const k in changes) card[k] = changes[k]
          page.put(cardName, card)
        } else {
          for (const k in changes) {
            const v = changes[k]
            if (v !== original[k]) page.set(`${cardName} ${k}`, v)
          }
        }
        page.sync()
        opB(null)
      },
      cancel = () => {
        opB(null)
      },
      onChangeCardName = ({ target }: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, v?: string) => {
        cardName = v || (target as HTMLInputElement).value
      },
      render = () => {
        const fields = attrs.map(({ t, name }) => {
          switch (t) {
            case AttrT.S:
            case AttrT.P:
              {
                const onChange = ({ target }: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, v?: string) => {
                  changes[name] = v || (target as HTMLInputElement).value
                }
                return (
                  <Fluent.TextField
                    key={name}
                    label={name}
                    defaultValue={changes[name]}
                    multiline={t === AttrT.P}
                    onChange={onChange} />
                )
              }
            default:
              return (
                <div key={name}>
                  <Fluent.Label>{name}</Fluent.Label>
                  <Fluent.MessageBar messageBarType={Fluent.MessageBarType.warning}>Could not render field</Fluent.MessageBar>
                </div>
              )
          }
        })
        return (
          <div>
            <Fluent.Separator>{view}</Fluent.Separator>
            {isNew ? <Fluent.TextField label='Card Name' defaultValue={cardName} onChange={onChangeCardName} /> : null}
            <div>
              {fields}
            </div>
            <Fluent.Stack horizontal tokens={{ childrenGap: 10 }} className={css.panelActions}>
              <Fluent.PrimaryButton onClick={save}>{isNew ? 'Add card' : 'Save changes'}</Fluent.PrimaryButton>
              <Fluent.DefaultButton onClick={cancel}>Back</Fluent.DefaultButton>
            </Fluent.Stack>
          </div>
        )
      }
    return { render }
  }),
  Editor = bond(({ activeB }: { activeB: Box<B> }) => {
    const
      pageChangedB = (qd.page as Page).changed, // can never be null, since the Editor wouldn't exist otherwise.
      opB = box<EditOp | null>(null),
      onDismiss = () => {
        activeB(false)
      },
      addMarkdownCard = () => {
        opB({ panel: MarkdownCardAttrPanel })
      },
      addChatCard = () => {
        const page = qd.edit()
        page.put('markdown1', { view: 'editor', box: '1 1 2 2', title: 'Modify this page', content: 'Hello world' })
        page.sync()
      },
      addCanvasCard = () => {
        const page = qd.edit()
        page.put('markdown1', { view: 'editor', box: '1 1 2 2', title: 'Modify this page', content: 'Hello world' })
        page.sync()
      },
      tools: Fluent.ICommandBarItemProps[] = [
        {
          key: 'addCard',
          text: 'Add Card',
          iconProps: { iconName: 'Add' },
          subMenuProps: {
            items: [
              {
                key: 'markdown',
                text: 'Markdown',
                iconProps: { iconName: 'InsertTextBox' },
                onClick: addMarkdownCard,
              },
              {
                key: 'chat',
                text: 'Chat',
                iconProps: { iconName: 'OfficeChat' },
                onClick: addChatCard,
              },
              {
                key: 'canvas',
                text: 'Canvas',
                iconProps: { iconName: 'EditCreate' },
                onClick: addCanvasCard,
              },
            ],
          },
        },
      ],
      render = () => {
        const op = opB()
        return (
          <Fluent.Panel headerText={op ? 'Edit Card' : 'Edit Page'} isLightDismiss={true} isOpen={activeB()} onDismiss={onDismiss} >
            { op ? (
              <AttrPanelView opB={opB} />
            ) : (
                <Fluent.CommandBar items={tools} styles={{ root: { padding: 0 } }} />
              )}
          </Fluent.Panel>
        )
      }
    return { render, activeB, opB, pageChangedB }
  })

export const
  View = bond(({ name, changed }: Card<State>) => {
    const
      editingB = box(false),
      onClick = () => { editingB(true) },
      render = () => {
        return (
          <div data-test={name} className={css.fab} onClick={onClick} >
            <Fluent.FontIcon iconName='Edit' className={css.fabIcon} />
            <Editor activeB={editingB} />
          </div>
        )
      }
    return { render, changed }
  })

cards.register('editor', View)

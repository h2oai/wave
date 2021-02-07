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

import { TextField } from '@fluentui/react'
import React from 'react'
import { stylesheet } from 'typestyle'
import { cards, grid } from './layout'
import { bond, Card, qd, Rec, S, unpack } from './qd'
import { border, clas, cssVar, padding } from './theme'

const
  css = stylesheet({
    card: {
      display: 'flex',
      flexDirection: 'column',
      padding: grid.gap,
      overflow: 'auto',
    },
    messages: {
      flexGrow: 1,
      overflow: 'auto',
    },
    message: {
      padding: padding(6, 0)
    },
    header: {
      marginBottom: 2,
    },
    user: {
      marginRight: 5,
    },
    date: {
      color: cssVar('$text7')
    },
    body: {
      paddingLeft: 10,
      borderLeft: border(1, cssVar('$text3')),
    }
  })

/** Create a card that displays a chat room. Chat messages  */
interface State {
  /** The title for this card.*/
  title: S
  /** The data for this card.*/
  data: Rec
}

/** A chat message. */
interface ChatMessage {
  /** The message */
  time: S
  /** The message */
  user: S
  /** The message */
  message: S
}

type HTMLTextBox = HTMLInputElement | HTMLTextAreaElement

const
  ChatInputField = ({ name }: { name: S }) => {
    const
      [val, setVal] = React.useState(''),
      onChange = React.useCallback(
        (_event: React.FormEvent<HTMLTextBox>, newValue?: string) => {
          setVal(newValue || '')
        },
        [],
      ),
      onKeyUp = ({ key, target }: React.KeyboardEvent<HTMLTextBox>, v?: S) => {
        if (key == 'Enter') {
          const message = v ?? (target as HTMLTextBox).value
          if (!message || (message && !message.length)) return // no message

          setVal('') // clear input field
          const page = qd.page()
          // TODO actual username
          page.set(`${name} data -1`, ['admin', (new Date()).toISOString(), message])
          page.sync()
        }
      }
    return (
      <TextField
        label='Send a message'
        multiline autoAdjustHeight
        onKeyUp={onKeyUp}
        onChange={onChange}
        value={val} />
    )
  }

export const
  View = bond(({ name, state: s, changed }: Card<State>) => {
    const
      messagesRef = React.createRef<HTMLDivElement>(),
      scroll = () => {
        const ref = messagesRef.current
        if (ref) ref.scrollTop = ref.scrollHeight
      },
      render = () => {
        const
          data = unpack<(ChatMessage | null)[]>(s.data),
          messages = data.map(cm => {
            if (!cm) return
            const { time, user, message } = cm
            return (
              <div key={`${user}|${time}|${message}`} className={css.message}>
                <div className={clas('s12', css.header)}>
                  <span className={clas('w6', css.user)}>{user}</span>
                  <span className={clas('s10', css.date)}>{(new Date(time)).toLocaleString()}</span>
                </div>
                <div className={css.body}>{message}</div>
              </div>
            )
          })
        return (
          <div data-test={name} className={css.card}>
            <div className='s12 w6'>{s.title}</div>
            <div ref={messagesRef} className={css.messages}>{messages}</div>
            <div><ChatInputField name={name} /></div>
          </div>)

      }
    return { render, init: scroll, update: scroll, changed }
  })

cards.register('chat_room', View)

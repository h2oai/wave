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
import { Box, box, Dict, Model, on, Rec, S, U } from 'h2o-wave'
import React from 'react'
import { stylesheet } from 'typestyle'
import { cards, grid } from './layout'
import { border, clas, cssVar, padding } from './theme'
import { bond, config, wave } from './ui'

const
  css = stylesheet({
    card: {
      display: 'flex',
      flexDirection: 'column',
      padding: grid.gap,
      overflow: 'auto',
    },
    history: {
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

/**
 * WARNING: Experimental and subject to change.
 * Do not use in production sites!
 *
 * Create a card that displays a chat room.
 * :icon "OfficeChat"
 */
interface State {
  /**
   * The title for this card.
   * :t "textbox"
   * :value "Untitled Chat"
   */
  title: S
  /**
   * The data for this card.
   * :t "record"
   * :value {}
   */
  data: Rec
  /**
   * The maximum number of messages contained in this card. Defaults to 50.
   * :t "spinbox"
   * :value 50
   * :min 10
   * :max 10000
   * :step 10
   **/
  capacity?: U
}

type ChatMessage = {
  /** Username of the sender. */
  u: S
  /** The message contents. */
  m: S
}

type HTMLTextBox = HTMLInputElement | HTMLTextAreaElement

const
  ChatInputField = ({ inputB }: { inputB: Box<S> }) => {
    const
      [value, setValue] = React.useState(''),
      onChange = React.useCallback(
        (_event: React.FormEvent<HTMLTextBox>, newValue?: string) => {
          setValue(newValue || '')
        },
        [],
      ),
      onKeyUp = ({ key, target }: React.KeyboardEvent<HTMLTextBox>, v?: S) => {
        if (key === 'Enter') {
          let input = v ?? (target as HTMLTextBox).value
          if (!input) {
            return
          }
          input = input.trim()
          setValue('') // clear input field
          if (input.length) {
            inputB(input)
          }
        }
      }
    return (
      <TextField
        label='Send a message'
        multiline autoAdjustHeight
        onKeyUp={onKeyUp}
        onChange={onChange}
        value={value} />
    )
  },
  unpack = (d: any): Dict<ChatMessage> => {
    if (!d) {
      return {}
    }
    const shapes: Dict<ChatMessage> = {}
    for (const k in d) shapes[k] = JSON.parse(d[k])
    
    return shapes
  }

export const
  View = bond(({ name, state, changed }: Model<State>) => {
    let _keys: S[] = []
    const
      messagesRef = React.createRef<HTMLDivElement>(),
      inputB = box('', () => false),
      scroll = () => {
        const ref = messagesRef.current
        if (ref) ref.scrollTop = ref.scrollHeight
      },
      render = () => {
        const
          messages = unpack(state.data),
          keys = Object.keys(messages).sort(),
          history = keys.map(time => {
            const { u: user, m: message } = messages[time]
            return (
              <div key={`${user}|${time}|${message}`} className={css.message}>
                <div className={clas('wave-s12', css.header)}>
                  <span className={clas('wave-w6', css.user)}>{user}</span>
                  <span className={clas('wave-s10', css.date)}>{(new Date(time)).toLocaleString()}</span>
                </div>
                <div className={css.body}>{message}</div>
              </div>
            )
          })
        _keys = keys
        return (
          <div data-test={name} className={css.card}>
            <div className='wave-s12 wave-w6'>{state.title}</div>
            <div ref={messagesRef} className={css.history}>{history}</div>
            <div><ChatInputField inputB={inputB} /></div>
          </div>
        )
      }

    on(inputB, input => {
      const
        page = wave.fork(),
        cap = state.capacity ?? 50,
        n = _keys.length

      // TODO actual username

      if (n >= cap) {
        for (let i = 0; i < n - cap + 1; i++) page.set(`${name} data ${_keys[i]}`, null)
      }
      const cm: ChatMessage = { u: config.username ?? '?', m: input }
      page.set(`${name} data ${(new Date()).toISOString()}`, JSON.stringify(cm))
      page.push()
    })

    return { render, init: scroll, update: scroll, changed }
  })

cards.register('chat', View)

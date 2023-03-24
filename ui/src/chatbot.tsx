// Copyright 2020 H2O.ai, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License")
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
import { Id, Model, Rec, unpack } from 'h2o-wave'
import React from 'react'
import { stylesheet } from 'typestyle'
import { cards } from './layout'
import { clas, margin } from './theme'
import { bond, wave } from './ui'


const css = stylesheet({
  chatWindow: {
    height: '100%',
    minHeight: 400,
    display: 'flex',
    flexDirection: 'column',
  },
  messageContainer: {
    overflowY: 'auto',
    flexGrow: 1,
  },
  message: {
    backgroundColor: '#f3f2f1',
    color: '#000',
    padding: 10,
    borderRadius: 10,
    direction: 'rtl',
  },
  userMessage: {
    backgroundColor: '#0078d4',
    color: '#fff',
    direction: 'ltr',
  },
})

/** Create a wide plot card displaying a title, caption and a plot. */
export interface Chatbot {
  /** An identifying name for this component. */
  name: Id
  /** Chat messages data. */
  data: Rec[]
}

export const XChatbot = ({ model }: { model: Chatbot }) => {
  const
    [conversation, setConversation] = React.useState<any[]>([]),
    [userInput, setUserInput] = React.useState(''),
    msgContainerRef = React.useRef<HTMLDivElement>(null),
    onChange = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newVal = '') => {
      e.preventDefault()
      wave.args[model.name] = newVal
      setUserInput(newVal)
    },
    onKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => { if (e.key === 'Enter') submit() },
    submit = () => {
      setConversation([...conversation, { msg: userInput, fromUser: true }])
      wave.push()
      setUserInput('')
    }

  React.useEffect(() => {
    if (msgContainerRef.current) msgContainerRef.current.scrollTop = msgContainerRef.current.scrollHeight
  }, [conversation])

  React.useEffect(() => { if (model.data) setConversation(model.data) }, [model.data])

  return (
    <div className={css.chatWindow}>
      <div className={css.messageContainer} ref={msgContainerRef}>
        {conversation.map(({ msg, fromUser }, idx) => (
          <div key={idx} style={{ margin: margin(20, 10), textAlign: fromUser ? 'left' : 'right' }} >
            <span className={clas(css.message, fromUser ? css.userMessage : '')}>{msg}</span>
          </div>
        ))}
      </div>
      <Fluent.Stack horizontal style={{ padding: 10, position: 'relative' }}>
        <Fluent.TextField
          value={userInput}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder="Type your message"
          styles={{ root: { flexGrow: 1 } }}
        />
        <Fluent.IconButton iconProps={{ iconName: 'Send' }} onClick={submit} styles={{ root: { position: 'absolute', top: 10, right: 10, height: 30 } }} />
      </Fluent.Stack>
    </div>

  )
}

/** Create a card displaying a plot. */
interface State {
  /** An identifying name for this component. */
  name: Id
  /** The card's plot data. */
  data: Rec
}

export const
  View = bond(({ state, changed }: Model<State>) => {
    const
      render = () => {
        return <XChatbot model={{ name: state.name, data: unpack<any>(state.data) }} />
      }
    return { render, changed }
  })

cards.register('chatbot', View)
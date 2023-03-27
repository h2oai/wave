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
import { B, Id, Model, Rec, S, unpack } from 'h2o-wave'
import React from 'react'
import { stylesheet } from 'typestyle'
import { cards } from './layout'
import { clas, cssVar, getContrast } from './theme'
import { bond, wave } from './ui'

const css = stylesheet({
  chatWindow: {
    height: '100%',
    minHeight: 400,
  },
  messageContainer: {
    overflowY: 'auto',
    // HACK: Prevent Safari from rendering double scrollbar. 52px is the total height of the input field.
    height: 'calc(100% - 52px)',
  },
  message: {
    display: 'inline-block',
    backgroundColor: cssVar('$themeTertiary'),
    padding: 8,
    borderRadius: 4,
    maxWidth: '65ch',
  },
  userMessage: {
    backgroundColor: cssVar('$themePrimary'),
  },
})

type ChatMessage = { msg: S, fromUser: B }

/** Create a chatbot card to allow getting prompts from users and providing them with LLM generated answers. */
export interface Chatbot {
  /** An identifying name for this component. */
  name: Id
  /** Chat messages data. Requires cyclic buffer. */
  data: Rec[]
}

export const XChatbot = ({ model }: { model: Chatbot }) => {
  const
    [msgs, setMsgs] = React.useState<ChatMessage[]>([]),
    [userInput, setUserInput] = React.useState(''),
    msgContainerRef = React.useRef<HTMLDivElement>(null),
    onChange = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newVal = '') => {
      e.preventDefault()
      wave.args[model.name] = newVal
      setUserInput(newVal)
    },
    onKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => { if (e.key === 'Enter') submit() },
    submit = () => {
      if (!userInput.trim()) return
      setMsgs([...msgs, { msg: userInput, fromUser: true }])
      wave.push()
      setUserInput('')
    }

  React.useEffect(() => { if (msgContainerRef.current) msgContainerRef.current.scrollTop = msgContainerRef.current.scrollHeight }, [msgs])
  React.useEffect(() => { if (model.data) setMsgs(model.data as ChatMessage[]) }, [model.data])

  return (
    <div className={css.chatWindow}>
      <div className={css.messageContainer} ref={msgContainerRef}>
        {msgs.map(({ msg, fromUser }, idx) => (
          <div key={idx} style={{ margin: 15, textAlign: fromUser ? 'left' : 'right', color: getContrast(fromUser ? '$themePrimary' : '$themeTertiary') }} >
            <span className={clas(css.message, fromUser ? css.userMessage : '', 'wave-s14')}>{msg}</span>
          </div>
        ))}
      </div>
      <Fluent.Stack horizontal style={{ padding: 10, position: 'relative' }}>
        <Fluent.TextField
          data-test={model.name}
          value={userInput}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder="Type your message"
          styles={{ root: { flexGrow: 1 } }}
        />
        <Fluent.IconButton
          data-test={`${model.name}-submit`}
          iconProps={{ iconName: 'Send' }}
          onClick={submit}
          disabled={!userInput.trim()}
          styles={{
            root: { position: 'absolute', top: 10, right: 10, height: 30 },
            rootHovered: { backgroundColor: 'transparent' },
            rootDisabled: { position: 'absolute', top: 10, right: 10, height: 30, backgroundColor: 'transparent' }
          }} />
      </Fluent.Stack>
    </div>
  )
}

/** Create a chatbot card to allow getting prompts from users and providing them with LLM generated answers. */
interface State {
  /** An identifying name for this component. */
  name: Id
  /** Chat messages data. Requires cyclic buffer. */
  data: Rec
}

export const
  View = bond(({ state, changed }: Model<State>) => {
    const render = () => <XChatbot model={{ name: state.name, data: unpack<ChatMessage[]>(state.data) }} />
    return { render, changed }
  })

cards.register('chatbot', View)
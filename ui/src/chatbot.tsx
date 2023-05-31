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
import { cards } from './layout'
import { Markdown } from './markdown'
import { clas, cssVar, getContrast, important, padding, px } from './theme'
import { bond, wave } from './ui'

const
  SUBMIT_BTN_SIZE = 30,
  css = Fluent.mergeStyleSets({
    chatWindow: {
      height: '100%',
      minHeight: 400,
      // HACK: Use absolute positionning due to Safari being Safari.
      position: 'relative',
      flexGrow: 1,
    },
    msgContainer: {
      position: 'absolute',
      top: 15,
      left: 0,
      right: 0,
      bottom: 62, // Height of input box + padding.
      overflowY: 'auto',
      padding: padding(0, 15),
    },
    msg: {
      display: 'inline-block',
      backgroundColor: cssVar('$text'),
      padding: 6,
      borderRadius: 4,
      maxWidth: '65ch',
      borderTopLeftRadius: 0,
      textAlign: 'left',
    },
    userMsg: {
      backgroundColor: cssVar('$themePrimary'),
      borderTopLeftRadius: 4,
      borderTopRightRadius: 0,
    },
    msgWrapper: {
      '&:first-child': { marginTop: important(px(0)) },
    }
  }),
  getCornerStyle = (prev?: B, curr?: B, next?: B): React.CSSProperties | undefined => {
    // First.
    if (curr && curr !== prev && curr === next) return { borderBottomRightRadius: 0, borderTopRightRadius: 4 }
    if (!curr && curr !== prev && curr === next) return { borderBottomLeftRadius: 0, borderTopLeftRadius: 4 }

    // Middle.
    if (curr && prev === curr && curr === next) return { borderTopRightRadius: 0, borderBottomRightRadius: 0 }
    if (!curr && prev === curr && curr === next) return { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }

    // Last.
    if (curr && prev === curr && curr !== next) return { borderTopRightRadius: 0, borderBottomRightRadius: 4 }
    if (!curr && prev === curr && curr !== next) return { borderTopLeftRadius: 0, borderBottomLeftRadius: 4 }
  }

type ChatMessage = { msg: S, fromUser: B }

/** Create a chatbot card to allow getting prompts from users and providing them with LLM generated answers. */
export interface Chatbot {
  /** An identifying name for this component. */
  name: Id
  /** Chat messages data. Requires cyclic buffer. */
  data: Rec[]
  /** Chat input box placeholder. Use for prompt examples. */
  placeholder?: S
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
      <div className={css.msgContainer} ref={msgContainerRef}>
        {msgs.map(({ msg, fromUser }, idx) => (
          <div
            key={idx}
            className={css.msgWrapper}
            style={{
              marginTop: msgs[idx - 1]?.fromUser !== fromUser ? 3 : 10,
              textAlign: fromUser ? 'right' : 'left',
              color: getContrast(fromUser ? '$themePrimary' : '$text')
            }} >
            <span
              className={clas(css.msg, fromUser ? css.userMsg : '', 'wave-s14')}
              style={{
                ...getCornerStyle(msgs[idx - 1]?.fromUser, fromUser, msgs[idx + 1]?.fromUser),
                padding: msg?.includes('\n') ? 12 : 6,
              }}>
              <Markdown source={msg || ''} />
            </span>
          </div>
        ))}
      </div>
      <div style={{ padding: 15, position: 'absolute', bottom: 0, left: 0, right: 0 }}>
        <Fluent.TextField
          data-test={model.name}
          value={userInput}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder={model.placeholder || 'Type your message'}
          styles={{ root: { flexGrow: 1 }, field: { width: `calc(100% - ${SUBMIT_BTN_SIZE}px)`, paddingRight: 0 } }}
        />
        <Fluent.IconButton
          data-test={`${model.name}-submit`}
          iconProps={{ iconName: 'Send' }}
          onClick={submit}
          disabled={!userInput.trim()}
          styles={{
            root: { position: 'absolute', top: 15, right: 15, height: SUBMIT_BTN_SIZE },
            rootHovered: { backgroundColor: 'transparent' },
            rootDisabled: { position: 'absolute', top: 15, right: 15, height: SUBMIT_BTN_SIZE, backgroundColor: 'transparent' }
          }} />
      </div>
    </div>
  )
}

/** Create a chatbot card to allow getting prompts from users and providing them with LLM generated answers. */
interface State {
  /** An identifying name for this component. */
  name: Id
  /** Chat messages data. Requires cyclic buffer. */
  data: Rec
  /** Chat input box placeholder. Use for prompt examples. */
  placeholder?: S
}

export const
  View = bond(({ name, state, changed }: Model<State>) => {
    const render = () => (
      <div data-test={name} style={{ display: 'flex', flexDirection: 'column' }}>
        <XChatbot model={{ name: state.name, data: unpack<ChatMessage[]>(state.data), placeholder: state.placeholder }} />
      </div>
    )
    return { render, changed }
  })

cards.register('chatbot', View)
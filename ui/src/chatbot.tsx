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
import { clas, cssVar, getContrast, important, padding, px, rem } from './theme'
import { bond, wave } from './ui'

const
  SUBMIT_BTN_SIZE = 30,
  css = Fluent.mergeStyleSets({
    chatWindow: {
      display: 'flex',
      flex: '1 0 400px',
      flexDirection: 'column',
      overflowY: 'auto',
    },
    msgContainer: {
      flexGrow: 1,
      overflowY: 'scroll',
      padding: padding(0, 0),
    },
    msgWrapper: {
      '&:first-child': { marginTop: important(px(0)) },
      display: 'flex',
      justifyContent: 'center',
    },
    msg: {
      maxWidth: '65ch',
      flexGrow: 1,
    },
    botMsg: {
      backgroundColor: cssVar('$neutralLighter'),
    },
    text: {
      display: 'inline-block',
      textAlign: 'left',
    },
    textInput: {
      position: 'relative',
      padding: 15,
    }
  })

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
    theme = Fluent.useTheme(),
    botTextColor = React.useMemo(() => getContrast(theme.palette.neutralLighter), [theme.palette.neutralLighter]),
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

  React.useEffect(() => {
    const msgContainer = msgContainerRef.current
    if (!msgContainer) return
    else if (msgContainer?.scrollTo) msgContainer.scrollTo({ top: msgContainer.scrollHeight, behavior: 'smooth' })
    else msgContainer.scrollTop = msgContainer.scrollHeight
  }, [msgs])
  React.useEffect(() => { if (model.data) setMsgs(model.data as ChatMessage[]) }, [model.data])

  return (
    <div className={css.chatWindow}>
      <div className={css.msgContainer} ref={msgContainerRef}>
        {msgs.map(({ msg, fromUser }, idx) => (
          <div
            key={idx}
            className={clas(css.msgWrapper, fromUser ? '' : css.botMsg)}
            style={{
              paddingTop: msgs[idx - 1]?.fromUser !== fromUser ? rem(0.7) : 0,
              paddingBottom: msgs?.[idx + 1]?.fromUser !== fromUser ? rem(0.85) : 0,
              color: fromUser ? '$text' : botTextColor
            }} >
            <div
              className={clas(css.msg, 'wave-s14')}
              style={{ padding: msg?.includes('\n') ? 12 : 6 }}>
              <span className={css.text}>
                <Markdown source={msg || ''} />
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className={css.textInput}>
        <Fluent.TextField
          data-test={model.name}
          value={userInput}
          onChange={onChange}
          onKeyDown={onKeyDown}
          autoComplete='off'
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